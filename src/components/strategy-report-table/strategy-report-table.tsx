import React, { Component } from "react";
import { Spin, Table, Tabs } from "antd";
import { StrategyReport } from "../../models/strategy-report";
import { columns } from "./strategy-report-columns";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import { Strategy } from "../../models/strategy";
import { SpinnerComponent } from 'react-element-spinner';
import { BacktestResult } from "../../models/backtest-result";
import * as actions from "../../state/actions";
import styles from 'styles/global.module.sass'


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

  onRowClick(row: BacktestResult) {
    return {
      onClick: (event: any) => {
        actions.getStock(row.interval, row.stockName);
        actions.setSelectedBacktestResult(row)
      }
    }
  }

  render() {
    let strategyReport = this.state?.selectedStrategyReport
    
    return (
      <div className={styles.reportTableWrapper}>
        <SpinnerComponent loading={this.props.strategyReportsFecthing} position="centered" />
        <Table 
          columns={columns} 
          dataSource={strategyReport?.backtestResults} 
          onRow={this.onRowClick}
          pagination={{ pageSize: 30 }}/>
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
