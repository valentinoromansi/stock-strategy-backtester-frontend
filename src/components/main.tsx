import React, { Component } from "react";
//import BacktestsTable from "./backtests-table";
import { Button } from "antd";
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
  }

  getBacktestData = () => {
    getBacktestData(strategyMock).then(data => {
      this.setState({strategyBacktestResults: data})
    })
  }

  render() {
    return (
      <div>
        <Button onClick={this.getBacktestData}>GuMbbiiC</Button>
        <BacktestsTable strategyBacktestResults={this.state.strategyBacktestResults}></BacktestsTable>
      </div>
    );
  }
}
