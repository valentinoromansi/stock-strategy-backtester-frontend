import React, { Component } from "react";
import { Table, Tabs } from "antd";
import { StrategyBacktestResults } from "../models/strategy-backtest-results";
import { BacktestResult } from "../models/backtest-result";
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
        <Tabs defaultActiveKey="1" onChange={() => {}}>
          <Tabs.TabPane tab={this.state?.strategyBacktestResults?.strategyName} key="1">
            <Table columns={columns} dataSource={this.state?.strategyBacktestResults?.backtestResults}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
