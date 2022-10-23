import { ColumnsType } from "antd/lib/table";
import { BacktestResult, TradeDateAndValues } from "../../models/backtest-result";
import styles from 'styles/global.module.sass'

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

let getLastXTrades = (record: BacktestResult, numOfTrades: number): {profitTrades: TradeDateAndValues[], lossTrades: TradeDateAndValues[]} => {
  const profitLossTrades = record.tradeDateAndValues.filter(t => t.profitHitDate || t.stopLossHitDate)
  const lastXprofitLossTrades = profitLossTrades.slice(-Math.min(profitLossTrades.length, numOfTrades))
  return {
    profitTrades: lastXprofitLossTrades.filter(t => t.profitHitDate != null),
    lossTrades: lastXprofitLossTrades.filter(t => t.stopLossHitDate != null)
  }
} 


const intervalSortOrderMap = {
  '15min': 0,
  '1h': 1,
  '1day': 2
}

export const columns: ColumnsType<BacktestResult> = [
  {
    title: <span className={styles.reportTableTitle}>Stock</span>,
    dataIndex: 'stockName',
    render: ((value, record: BacktestResult) => {
      return <span className={styles.reportTableColumn}>{record.stockName}</span>
    })
  },
  {
    title: <span className={styles.reportTableTitle}>Interval</span>,
    dataIndex: 'interval',
    filters: [
      {
        text: '15min',
        value: '15min'
      },
      {
        text: '1h',
        value: '1h'
      },
      {
        text: '1day',
        value: '1day'
      },
    ],
    onFilter: (value: any, record: BacktestResult) => record.interval.indexOf(value) === 0,
    sorter: (a: BacktestResult, b: BacktestResult) => intervalSortOrderMap[a.interval] - intervalSortOrderMap[b.interval],
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      return <span className={styles.reportTableColumn}>{record.interval}</span>
    })
  },
  {
    title: <span className={styles.reportTableTitle}>P/L factor</span>,
    sorter: (a: BacktestResult, b: BacktestResult) => a.plFactor - b.plFactor,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromPlFactor(record.plFactor)
      return <span className={styles.reportTableColumn} style={{ color: color }}>{record.plFactor.toFixed(3)}</span>
    })
  },
  {
    title: <span className={styles.reportTableTitle}>P/L ratio</span>,
    sorter: (a: BacktestResult, b: BacktestResult) => a.plRatio - b.plRatio,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromPlRatio(record.plRatio)
      const plRatioText = record.timesLost == 0 ? '-' : record.plRatio.toFixed(2) 
      return <span className={styles.reportTableColumn} style={{ color: color }}>{plRatioText}</span>
    })
  },
  {
    title: <span className={styles.reportTableTitle}>Average profit per trade</span>,
    sorter: (a: BacktestResult, b: BacktestResult) => a.plRatio - b.plRatio,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromAvgProfit(record.plRatio - 1)
      const plRatioText = record.timesLost == 0 ? '-' : (record.plRatio - 1).toFixed(2) 
      return <span className={styles.reportTableColumn} style={{ color: color }}>{plRatioText}</span>
    })
  },
  {
    title: <span className={styles.reportTableTitle}>Sample(win-loss-indecisive)</span>,
    sorter: (a: BacktestResult, b: BacktestResult) => (a.timesProfited + a.timesLost + a.timesIndecisive) - (b.timesProfited + b.timesLost + b.timesIndecisive),
    sortDirections: ['ascend', 'descend'],
    onFilter: (value: any, record: BacktestResult) => record.timesProfited > 100,
    render: ((value, record: BacktestResult) => {
      const sample = record.timesProfited + record.timesLost + record.timesIndecisive
      return <span className={styles.reportTableColumn}>
        <span>{sample} (</span>
        <span style={{ color: color.green }}>{( record.timesProfited / sample * 100 || 0).toFixed(2)}%</span>
        <span> - </span>
        <span style={{ color: color.red }}>{( record.timesLost / sample * 100 || 0).toFixed(2)}%</span>
        <span> - </span>
        <span style={{ color: color.neutral }}>{( record.timesIndecisive / sample * 100 || 0).toFixed(2)}%</span>
        <span>)</span>
      </span>
    })
  },
  {
    title: <span className={styles.reportTableTitle}>Reward:risk</span>,
    sorter: (a: BacktestResult, b: BacktestResult) => a.rewardToRisk - b.rewardToRisk,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      return <span className={styles.reportTableColumn}>{record.rewardToRisk}:1</span>
    })
  },
  {
    title: <span className={styles.reportTableTitle}>P/L ratio of last 30 trades</span>,
    sorter: (a: BacktestResult, b: BacktestResult) => {
      const tradesA = getLastXTrades(a, 30)
      const tradesB = getLastXTrades(b, 30)
      return tradesA.profitTrades.length - tradesB.profitTrades.length
    },
    render: ((value, record: BacktestResult) => {
      const trades = getLastXTrades(record, 30)
      const tradesSum = trades.profitTrades.length + trades.lossTrades.length
      return <span className={styles.reportTableColumn}>
        <span style={{ color: color.green }}>{(trades.profitTrades.length / tradesSum * 100 || 0).toFixed(2) + '%'}</span>
        <span> - </span>
        <span style={{ color: color.red }}>{(trades.lossTrades.length / tradesSum * 100 || 0).toFixed(2) + '%'}</span>
      </span>
    })
  }

  
];