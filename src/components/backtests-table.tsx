import React, { Component } from "react";
import { Table, Tabs } from "antd";
import { StrategyBacktestResults } from "../models/strategy-backtest-results";
import { columns } from "../constants/constants";

type PropsType = {
  strategyBacktestResults?: StrategyBacktestResults
}
type StateType = {
  strategyBacktestResults?: StrategyBacktestResults
}


export default class BacktestsTable extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      strategyBacktestResults: props.strategyBacktestResults
    }    
  }

  componentDidUpdate(prevProps: PropsType) {
    if(prevProps.strategyBacktestResults !== this.props.strategyBacktestResults) {
      this.setState({strategyBacktestResults: this.props.strategyBacktestResults});
    }
  }

  render() {
    return (
      <div>
        <Table columns={columns} dataSource={this.state?.strategyBacktestResults?.backtestResults}/>
      </div>
    );
  }
}
