import React, { Component } from "react";
import { Spin, Table, Tabs } from "antd";
import { StrategyBacktestResults } from "../models/strategy-backtest-results";
import { columns } from "../constants/constants";
import { connect } from "react-redux";

type PropsType = {
  strategyBacktestResults?: StrategyBacktestResults
  backtestDataLoading?: boolean
}
type StateType = {
}


class BacktestsTable extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
  }

  render() {
    
    return (
      <div>
        <Table columns={columns} dataSource={this.props?.strategyBacktestResults?.backtestResults} loading={this.props.backtestDataLoading} />
      </div>
    );
  }

}


const mapStateToProps = (state: any) => {
  return {
    backtestDataLoading: state.backtestDataLoading,
    strategyBacktestResults: state.strategyBacktestResults
  };
};

export default connect(mapStateToProps)(BacktestsTable);
