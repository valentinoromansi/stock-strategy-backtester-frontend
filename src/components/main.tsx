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
    this.state = {
      strategyBacktestResults: strategyBacktestResultsMock
    };
    console.log( this.state.strategyBacktestResults)
    //this.getBacktestData()
  }

  getBacktestData = () => {    
    getBacktestData(strategyMock).then(data => {
      this.setState({strategyBacktestResults: data})
    })
    
  }

  render() {
    return (
      <div>
        <BacktestsTable strategyBacktestResults={this.state.strategyBacktestResults}></BacktestsTable>
      </div>
    );
  }
}
