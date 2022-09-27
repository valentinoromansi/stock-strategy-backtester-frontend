import React, { Component } from "react";
import { strategyBacktestResultsMock, strategyMock } from "../mocks/mocks";
import { StrategyBacktestResults } from "../models/strategy-backtest-results";
import BacktestsTable from "./backtests-table";
import { getBacktestData } from "../http/http";

type PropsType = {
  strategyBacktestResults?: StrategyBacktestResults
}
type StateType = {
  strategyBacktestResults?: StrategyBacktestResults
}

export default class Main extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.getBacktestData()
  }

  getBacktestData = () => {
    getBacktestData(strategyMock).then(data => {
      this.setState({ strategyBacktestResults: data })
    })

  }

  render() {
    const navStyle = {
      width: '100%',
      height: '50px',
      backgroundColor: 'red'
    }
    const underNavStyle = {
      height: window.innerHeight - 50,
      display: 'flex',
    }

    const strategyListStyle = {
      width: '10%',
      backgroundColor: 'purple'
    }
    
    const graphBacktestListWrapperStyle = {
      width: '90%',
      backgroundColor: 'blue'
    }
    const graphStyle = {
      backgroundColor: 'yellow',
      height: '70%'
    }
    const backtestListStyle = {
    }
    
    
    
    let backtestTableDiv;
    if(!this.state?.strategyBacktestResults) {
      backtestTableDiv = <BacktestsTable></BacktestsTable>;
    } else {
      let rowsForDisplay: StrategyBacktestResults = new StrategyBacktestResults({
        strategyName: this.state?.strategyBacktestResults?.strategyName,
        backtestResults: this.state?.strategyBacktestResults?.backtestResults?.filter((record) => record.timesProfited + record.timesLost + record.timesIndecisive > 50)
      })
      backtestTableDiv = <BacktestsTable strategyBacktestResults={rowsForDisplay}></BacktestsTable>;
    }
    

    return (
      <div>
        <div style={navStyle}></div>
        <div style={underNavStyle}>
          <div style={strategyListStyle}></div>
          <div style={graphBacktestListWrapperStyle}>
            <div style={graphStyle}></div>
            <div style={backtestListStyle}>
            {backtestTableDiv}
            </div>
          </div>
        </div>
          {/*<BacktestsTable strategyBacktestResults={rowsForDisplay}></BacktestsTable>*/}
      </div>
    );
  }
}
