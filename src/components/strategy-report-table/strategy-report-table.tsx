import React, { Component } from "react";
import { StrategyReport } from "../../models/strategy-report";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import { Strategy } from "../../models/strategy";
import { SpinnerComponent } from 'react-element-spinner';
import { BacktestResult } from "../../models/backtest-result";
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
import { Box, IconButton } from "@mui/material";
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

type ColumnKey = 'name' | 'code' | 'population' | 'size' | 'density'


const columnKeySortingFunMap: { [key in ColumnKey]: (a, b) => number } = {
  "name": (a, b) => { return (a > b ? 1 : -1) },
  "code": (a, b) => { return (a > b ? 1 : -1) },
  "population": (a, b) => { return (a < b ? 1 : -1) },
  "size": (a, b) => { return (a > b ? 1 : -1) },
  "density": (a, b) => { return (a > b ? 1 : -1) }
}

interface Column {
  key: ColumnKey;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { key: 'name', label: 'Name', minWidth: 170 },
  { key: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
  {
    key: 'population',
    label: 'Population',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    key: 'size',
    label: 'Size\u00a0(km\u00b2)',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    key: 'density',
    label: 'Density',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
];


interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number,
  ): Data {
    const density = population / size;
    return { name, code, population, size, density };
  }
  
  let rows = [
    createData('India', 'IN', 1324171354, 3287263),
    createData('China', 'CN', 1403500365, 9596961),
    createData('Italy', 'IT', 60483973, 301340),
    createData('United States', 'US', 327167434, 9833520),
    createData('Canada', 'CA', 37602103, 9984670),
    createData('Australia', 'AU', 25475400, 7692024),
    createData('Germany', 'DE', 83019200, 357578),
    createData('Ireland', 'IE', 4857000, 70273),
    createData('Mexico', 'MX', 126577691, 1972550),
    createData('Japan', 'JP', 126317000, 377973),
    createData('France', 'FR', 67022000, 640679),
    createData('United Kingdom', 'GB', 67545757, 242495),
    createData('Russia', 'RU', 146793744, 17098246),
    createData('Nigeria', 'NG', 200962417, 923768),
    createData('Brazil', 'BR', 210147125, 8515767),
  ];

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
      orderBy: "name"
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
    this.setState({ selectedStrategyReport: deepCopy(selectedStrategyReport)})
  }

  
  componentDidMount() {
    this.setSelectedStrategyReport(this.props)
  }

  componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<StateType>, snapshot?: any): void {
    console.log(this.state.orderDirection + ' ' + this.state.orderBy)
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
      const sortedRows = rows.sort((a, b) => {
        if(newSortOrder == 'asc')
          return columnKeySortingFunMap[key](a[key], b[key])
        return columnKeySortingFunMap[key](b[key], b[key])
      })
      rows = sortedRows
      this.setState({
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
    
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>     
        <SpinnerComponent loading={this.props.strategyReportsFecthing} position="centered" />
        <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >                                   
                  <this.ColumnSort column={column}></this.ColumnSort>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.key];
                      return (
                        <TableCell key={column.key} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={this.handleChangePage}
        onRowsPerPageChange={this.handleChangeRowsPerPage}
      />
        
        
        {/* <Table 
          columns={columns} 
          dataSource={strategyReport?.backtestResults} 
          onRow={this.onRowClick}
          pagination={{ pageSize: 30 }}/> */}
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
