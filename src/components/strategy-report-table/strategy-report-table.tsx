import React, { Component } from "react";
import { StrategyReport } from "../../models/strategy-report";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import { Strategy } from "../../models/strategy";
import { SpinnerComponent } from 'react-element-spinner';
import { BacktestResult, TradeDateAndValues } from "../../models/backtest-result";
import * as actions from "../../state/actions";
import styles from 'styles/global.module.sass'

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import { deepCopy } from "utils/utils";

type PropsType = {
  selectedStrategy: Strategy | null,
  strategiesFecthing: boolean,
  strategyReports: StrategyReport[],
  strategyReportsFecthing: boolean
}
type StateType = {
  selectedStrategyReport: StrategyReport | null,
  page: number,
  rowsPerPage: number,
  orderDirection: 'asc' | 'desc',
  orderBy: ColumnKey
}

type ColumnKey = 'stockName' | 'interval' | 'plFactor' | 'plRatio' | 'avgTradeProfit'  | 'sampleWinLossIndecisiveRatio' | 'rewardToRisk' | 'profitToLossLas30Trades'

const columnKeySortingFunMap: { [key in ColumnKey]: (a, b) => number } = {
  "stockName": (a, b) => { return (a > b ? 1 : -1) },
  "interval": (a, b) => {
    const intervalSortOrderMap = {
      '15min': 0,
      '1h': 1,
      '1day': 2
    }
    return (intervalSortOrderMap[a] > intervalSortOrderMap[b] ? 1 : -1) 
  },
  "plFactor": (a, b) => { return (a > b ? 1 : -1) },
  "plRatio": (a, b) => { return (a > b ? 1 : -1) },
  "avgTradeProfit": (a, b) => { return (a < b ? 1 : -1) },
  "sampleWinLossIndecisiveRatio": (a, b) => { return (a < b ? 1 : -1) },
  "rewardToRisk": (a, b) => { return (a < b ? 1 : -1) },
  "profitToLossLas30Trades": (a, b) => { return (a < b ? 1 : -1) }
}

let getLastXTrades = (record: BacktestResult, numOfTrades: number): {profitTrades: TradeDateAndValues[], lossTrades: TradeDateAndValues[]} => {
  const profitLossTrades = record.tradeDateAndValues.filter(t => t.profitHitDate || t.stopLossHitDate)
  const lastXprofitLossTrades = profitLossTrades.slice(-Math.min(profitLossTrades.length, numOfTrades))
  return {
    profitTrades: lastXprofitLossTrades.filter(t => t.profitHitDate != null),
    lossTrades: lastXprofitLossTrades.filter(t => t.stopLossHitDate != null)
  }
} 

interface RowKey {
  stockName: string,
  interval: string,
  rewardToRisk: string
}

interface Column {
  key: ColumnKey
  label: string
  minWidth?: number
  align?: "right" | "left" | "inherit" | "center" | "justify"
  format?: (value: any) => any
}

const columns: readonly Column[] = [
  { key: 'stockName', label: 'Stock name', minWidth: 50, align: 'left', },
  { key: 'interval', label: 'Interval', minWidth: 50, align: 'left', },
  {
    key: 'plFactor',
    label: 'P/L factor',
    minWidth: 50,
    align: 'left',
    format: (backtest: BacktestResult) => {
      const color = getColorFromPlFactor(backtest.plFactor)
      return <Typography sx={{ color: color }}>{ backtest.plFactor.toFixed(3) }</Typography>
    },
  },
  {
    key: 'plRatio',
    label: 'P/L ratio',
    minWidth: 50,
    align: 'left',
    format: (backtest: BacktestResult) => {
      const color = getColorFromPlRatio(backtest.plRatio)
      const plRatioText = backtest.timesLost == 0 ? '-' : backtest.plRatio.toFixed(2) 
      return <Typography sx={{ color: color }}>{ plRatioText }</Typography>
    },
  },
  {
    key: 'avgTradeProfit',
    label: 'Avg. profit per trade',
    minWidth: 50,
    align: 'left',
    format: (backtest: BacktestResult) => {
      const color = getColorFromAvgProfit(backtest.plRatio - 1)
      const plRatioText = backtest.timesLost == 0 ? '-' : (backtest.plRatio - 1).toFixed(2) 
      return <Typography sx={{ color: color }}>{ plRatioText }</Typography>
    },
  },
  {
    key: 'sampleWinLossIndecisiveRatio',
    label: 'Sample(win-loss-indecisive)',
    minWidth: 50,
    align: 'left',
    format: (backtest: BacktestResult) => {
      const sample = backtest.timesProfited + backtest.timesLost + backtest.timesIndecisive
      return <Box sx={{display: "flex", flexDirection: "row"}}>
        <Typography>{sample} (</Typography>
        <Typography style={{ color: color.green }}>{( backtest.timesProfited / sample * 100 || 0).toFixed(2)}%</Typography>
        <Typography> - </Typography>
        <Typography style={{ color: color.red }}>{( backtest.timesLost / sample * 100 || 0).toFixed(2)}%</Typography>
        <Typography> - </Typography>
        <Typography style={{ color: color.neutral }}>{( backtest.timesIndecisive / sample * 100 || 0).toFixed(2)}%</Typography>
        <Typography>)</Typography>
      </Box>
    }
  },
  {
    key: 'rewardToRisk',
    label: 'Reward : risk',
    minWidth: 50,
    align: 'left',
    format: (backtest: BacktestResult) => {
      return <Typography>{backtest.rewardToRisk}:1</Typography>
    },
  },
  {
    key: 'profitToLossLas30Trades',
    label: 'Profit:loss for last 30 trades',
    minWidth: 50,
    align: 'left',
    format: (backtest: BacktestResult) => {
      const trades = getLastXTrades(backtest, 30)
      const tradesSum = trades.profitTrades.length + trades.lossTrades.length
      return <Box sx={{display: "flex", flexDirection: "row"}}>
        <Typography style={{ color: color.green }}>{(trades.profitTrades.length / tradesSum * 100 || 0).toFixed(2) + '%'}</Typography>
        <Typography> - </Typography>
        <Typography style={{ color: color.red }}>{(trades.lossTrades.length / tradesSum * 100 || 0).toFixed(2) + '%'}</Typography>
      </Box>
    },
  }
];

const color = {
  green: 'limegreen',
  red: 'red',
  neutral: '#9e9e9e'
}

let getColorFromPlFactor = (plFactor: any) : string => {
  if (plFactor < 0.5)
    return color.red
  else if (plFactor === 0.5)
    return color.neutral
  return color.green
} 
let getColorFromPlRatio = (plRatio: any) : string => {
  if (plRatio < 1)
    return color.red
  else if (plRatio === 1)
    return color.neutral
  return color.green
}
let getColorFromAvgProfit = (avgProfit: any) : string => {
  if (avgProfit < 0)
    return color.red
  else if (avgProfit === 0)
    return color.neutral
  return color.green
}
  

class StrategyReportTable extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.ColumnSort = this.ColumnSort.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this)
    this.state = {
      selectedStrategyReport: null,
      page: 0,
      rowsPerPage: 10,
      orderDirection: "asc",
      orderBy: "stockName"
    }
  }

  handleChangePage(event: unknown, newPage: number) {
    this.setState({page: newPage});
  };

  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0
    })
  };

  setSelectedStrategyReport(props: PropsType) {
    const selectedStrategyReport = props.strategyReports.find(item => item.strategyName === props.selectedStrategy?.name)
    if(selectedStrategyReport)
      this.setState({ selectedStrategyReport: deepCopy(selectedStrategyReport)})
  }

  
  componentDidMount() {
    this.setSelectedStrategyReport(this.props)
  }

  componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<StateType>, snapshot?: any): void {
    console.log(this.state.orderDirection + ' ' + this.state.orderBy)
    console.log(this.state.selectedStrategyReport?.backtestResults?.map(item => item.interval))
  }
  

  componentWillReceiveProps(nextProps: PropsType) {
    this.setSelectedStrategyReport(nextProps)
  }

  onRowClick(row: BacktestResult) {
    return {
      onClick: (event: any) => {
        actions.getStock(row.interval, row.stockName);
        actions.setSelectedBacktestResult(row)
      }
    }
  }

  ColumnSort(props: { column: Column }): any {
    const { key } = props.column
    const onChange = (key: ColumnKey) => {
      const newSortOrder = this.state.orderDirection == 'asc' ? 'desc' : 'asc'
      const sortedStrategyReport = this.state.selectedStrategyReport
      sortedStrategyReport.backtestResults = sortedStrategyReport?.backtestResults?.sort((a, b) => {
        if(newSortOrder == 'asc')
          return columnKeySortingFunMap[key](a[key], b[key])
        return columnKeySortingFunMap[key](b[key], b[key])
      })
      this.setState({
        selectedStrategyReport: sortedStrategyReport,
        orderDirection: newSortOrder,
        orderBy: key
      })
    }
    return (
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        <Box sx={{marginBlock: 'auto'}}>{key}</Box>
        <IconButton aria-label="delete" size="large" onClick={() => onChange(key)}>
          {
            this.state.orderDirection === 'asc' ?
            <KeyboardArrowDownSharpIcon fontSize="inherit" /> :
            <KeyboardArrowUpSharpIcon fontSize="inherit" />
          }
        </IconButton>
       </Box> 
    )
  }

  

  render() {
    let strategyReport = this.state?.selectedStrategyReport
    const page = this.state.page
    const rowsPerPage = this.state.rowsPerPage

    const backtests = this.state.selectedStrategyReport?.backtestResults
    const rowNumber = this.state.selectedStrategyReport?.backtestResults?.length ?? 0

    console.log(rowNumber)
    
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)" }}>     
        <SpinnerComponent loading={this.props.strategyReportsFecthing} position="centered" />
        <TableContainer sx={{ overflow: 'hidden' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={'center'}
                >                                   
                  <this.ColumnSort column={column}></this.ColumnSort>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            { backtests &&
              backtests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((backtest, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.key} align={column.align}>
                          {column.format
                            ? column.format(backtest)
                            : backtest[column.key]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowNumber}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={this.handleChangePage}
          onRowsPerPageChange={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy,
    strategiesFecthing: state.strategiesFecthing,
    strategyReports: state.strategyReports,
    strategyReportsFecthing: state.strategyReportsFecthing,
  };
};

export default connect(mapStateToProps)(StrategyReportTable);
