import React, { Component } from "react";
import { Spin, Table, Tabs } from "antd";
import { StrategyReport } from "../models/strategy-report";
import { columns } from "../constants/constants";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import { Strategy } from "../models/strategy";

type PropsType = {
  selectedStrategy: Strategy | null,
  strategiesFecthing: boolean,
  strategyReports: StrategyReport[],
  strategyReportsFecthing: boolean
}
type StateType = {
  selectedStrategyReport: StrategyReport | null,
}


class StrategyReportTable extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.setSelectedStrategyReport(props)
  }

  setSelectedStrategyReport(props: PropsType) {
    const selectedStrategyReport = props.strategyReports.filter(item => item.strategyName === props.selectedStrategy?.name)[0]
    this.setState({ selectedStrategyReport: selectedStrategyReport })
  }

  componentWillReceiveProps(nextProps: PropsType) {
    this.setSelectedStrategyReport(nextProps)
  }

  render() {
    let strategyReport = this.state?.selectedStrategyReport
    
    return (
      <div>
        <Table columns={columns} dataSource={strategyReport?.backtestResults} loading={this.props.strategyReportsFecthing || this.props.strategiesFecthing} />
      </div>
    );
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy,
    strategiesFecthing: state.strategiesFecthing,
    strategyReports: state.strategyReports,
    strategyReportsFecthing: state.strategyReportsFecthing,
  };
};

export default connect(mapStateToProps)(StrategyReportTable);
