import React, { Component } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./backtests-table";
import Navigation from './navigation'
import StrategyList from './strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";


type PropsType = {
  strategyBacktestResults?: StrategyReport
}
type StateType = {
  strategyBacktestResults?: StrategyReport
}

class Main extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    actions.getStrategies();
    actions.getStrategyReport();
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
      backtestTableDiv = <StrategyReportTable></StrategyReportTable>;
    } else {
      let rowsForDisplay: StrategyReport = new StrategyReport({
        strategyName: this.state?.strategyBacktestResults?.strategyName,
        backtestResults: this.state?.strategyBacktestResults?.backtestResults?.filter((record) => record.timesProfited + record.timesLost + record.timesIndecisive > 50)
      })
      backtestTableDiv = <StrategyReportTable></StrategyReportTable>
    }
    

    return (
      <div>
        <Navigation></Navigation>
        <div style={underNavStyle}>
          <StrategyList></StrategyList>
          <div style={graphBacktestListWrapperStyle}>
            <div style={graphStyle}></div>
            <div style={backtestListStyle}>
            {/*backtestTableDiv*/}
            <StrategyReportTable></StrategyReportTable>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: reducer.StateType) => {
  return {
    strategyReports: state.strategyReports,
    strategyReportsFecthing: state.strategyReportsFecthing,
  };
};

export default connect(mapStateToProps)(Main);