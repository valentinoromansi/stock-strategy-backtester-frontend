import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import { ColumnsType } from "antd/lib/table";
import TimestampList from "../components/timestamp-list";
import { BacktestResult } from "../models/backtest-result";
import { TradeResult } from "../types/trade-result";


let getColorFromPlFactor = (plFactor: any) : string => {
  if (plFactor < 0.5)
    return 'red'
  else if (plFactor === 0.5)
    return 'black'
  return 'limegreen'
} 
let getColorFromPlRatio = (plRatio: any) : string => {
  if (plRatio < 1)
    return 'red'
  else if (plRatio === 1)
    return 'black'
  return 'limegreen'
}
let getColorFromAvgProfit = (avgProfit: any) : string => {
  if (avgProfit < 0)
    return 'red'
  else if (avgProfit === 0)
    return 'black'
  return 'limegreen'
} 

export const columns: ColumnsType<BacktestResult> = [
  {
    title: 'Stock',
    dataIndex: 'stockName'
  },
  {
    title: 'Interval',
    dataIndex: 'interval',
    filters: [
      {
        text: '15min',
        value: '15min',
      },
      {
        text: '1h',
        value: '1h',
      },
      {
        text: '1day',
        value: '1day',
      },
    ],
    onFilter: (value: any, record: BacktestResult) => record.interval.indexOf(value) === 0,
    sorter: (a: BacktestResult, b: BacktestResult) => a.interval.length - b.interval.length,
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Profit/Loss factor',
    sorter: (a: BacktestResult, b: BacktestResult) => a.plFactor - b.plFactor,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromPlFactor(record.plFactor)
      return <span style={{ color: color }}>{record.plFactor.toFixed(3)}</span>
    })
  },
  {
    title: 'Profit/Loss ratio',
    sorter: (a: BacktestResult, b: BacktestResult) => a.plRatio - b.plRatio,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromPlRatio(record.plRatio)
      return <span style={{ color: color }}>{record.plRatio.toFixed(2)}</span>
    })
  },
  {
    title: 'Average profit per trade',
    sorter: (a: BacktestResult, b: BacktestResult) => a.plRatio - b.plRatio,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromAvgProfit(record.plRatio - 1)
      return <span style={{ color: color }}>{(record.plRatio - 1).toFixed(2)}</span>
    })
  },
  {
    title: 'Sample(win-loss-indecisive)',
    sorter: (a: BacktestResult, b: BacktestResult) => (a.timesProfited + a.timesLost + a.timesIndecisive) - (b.timesProfited + b.timesLost + b.timesIndecisive),
    sortDirections: ['ascend', 'descend'],
    onFilter: (value: any, record: BacktestResult) => record.timesProfited > 100,
    render: ((value, record: BacktestResult) => {
      const sample = record.timesProfited + record.timesLost + record.timesIndecisive
      return <span>
        <span>{sample}(</span>
        <span style={{ color: 'limegreen' }}>{(record.timesProfited / sample * 100).toFixed(2)}%</span>
        <span>-</span>
        <span style={{ color: 'red' }}>{(record.timesLost / sample * 100).toFixed(2)}%</span>
        <span>-</span>
        <span style={{ color: 'lightgrey' }}>{(record.timesIndecisive / sample * 100).toFixed(2)}%</span>
        <span>)</span>
      </span>
    })
  },
  {
    title: 'Reward:risk',
    sorter: (a: BacktestResult, b: BacktestResult) => a.rewardToRisk - b.rewardToRisk,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      return <span>{record.rewardToRisk}:1</span>
    })
  },
  {
    title: 'Profit trade entries',
    render: ((value, record: BacktestResult) => {
      const profitEnterDates = record.tradeDateAndValues.filter(trade => trade.tradeResult == TradeResult.PROFIT).map(trade => trade.enterDate)
      const title = 'Profit entries - ' + profitEnterDates.length
      return <span>
        <TimestampList title={title} timestamps={profitEnterDates}></TimestampList>
      </span>
    })
  },
  {
    title: 'Loss trade entries',
    width: '40%',
    render: ((value, record: BacktestResult) => {
      const lossEnterDates = record.tradeDateAndValues.filter(trade => trade.tradeResult == TradeResult.LOSS).map(trade => trade.enterDate)
      const title = 'Loss entries - ' + lossEnterDates.length
      return <span>
        <TimestampList title={title} timestamps={lossEnterDates}></TimestampList>
      </span>
    })
  }

  
];