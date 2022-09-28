import React, { Component } from "react";
import { Table, Tabs } from "antd";
import { StrategyBacktestResults } from "../models/strategy-backtest-results";
import { columns } from "../constants/constants";
import ClipLoader from "react-spinners/ClipLoader";

type PropsType = {
  strategyBacktestResults?: StrategyBacktestResults
}
type StateType = {
  strategyBacktestResults?: StrategyBacktestResults
  spinnerActive?: boolean
}


export default class BacktestsTable extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      strategyBacktestResults: props.strategyBacktestResults,
      spinnerActive: true
    }    
  }

  componentDidUpdate(prevProps: PropsType) {
    if(prevProps.strategyBacktestResults !== this.props.strategyBacktestResults) {
      this.setState({strategyBacktestResults: this.props.strategyBacktestResults});
    }
  }

  render() {
    let spinnerActive = this.state.spinnerActive;
    let contentToRender = (spinnerActive) ? <ClipLoader color={'red'} loading={this.state.spinnerActive} size={150} /> : <Table columns={columns} dataSource={this.state?.strategyBacktestResults?.backtestResults}/>
    
    return (
      <div>
        <button onClick={() => this.setState({spinnerActive: !this.state.spinnerActive})}>Toggle Loader</button>
        <div>{'' + this.state.spinnerActive}</div>

        {contentToRender}
      </div>
    );
  }


}
