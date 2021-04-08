import { ColumnsType } from "antd/lib/table";
import { BacktestResult } from "../models/backtest-result";


let getColorFromPlFactor = (plFactor: any) : string => {
  if (plFactor < 0.5)
    return 'red'
  else if (plFactor == 0.5)
    return 'black'
  return 'limegreen'
} 
let getColorFromPlRatio = (plFactor: any) : string => {
  if (plFactor < 1)
    return 'red'
  else if (plFactor == 1)
    return 'black'
  return 'limegreen'
} 

export const columns: ColumnsType<BacktestResult> = [
  {
    title: 'Stock',
    dataIndex: 'stockName',
    width: '1%',    
  },
  {
    title: 'Interval',
    dataIndex: 'interval',
    width: '1%',
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
    width: '1%',
    sorter: (a: BacktestResult, b: BacktestResult) => a.plFactor - b.plFactor,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromPlFactor(record.plFactor)
      return <span style={{ color: color }}>{record.plFactor.toFixed(3)}</span>
    })
  },
  {
    title: 'Profit/Loss ratio',
    width: '1%',
    sorter: (a: BacktestResult, b: BacktestResult) => a.plRatio - b.plRatio,
    sortDirections: ['ascend', 'descend'],
    render: ((value, record: BacktestResult) => {
      const color = getColorFromPlRatio(record.plRatio)
      return <span style={{ color: color }}>{record.plRatio.toFixed(2)}</span>
    })
  },
  {
    title: 'Sample(win-loss-indecisive)',
    width: '1%',
    sorter: (a: BacktestResult, b: BacktestResult) => (a.timesProfited + a.timesLost + a.timesIndecisive) - (b.timesProfited + b.timesLost + b.timesIndecisive),
    sortDirections: ['ascend', 'descend'],
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
  }

  
];