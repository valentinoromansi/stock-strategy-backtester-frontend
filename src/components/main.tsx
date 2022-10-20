import React, { Component, CSSProperties, useEffect, useRef, useState } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./backtests-table";
import Navigation from './navigation'
import StrategyList from './strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import Graph from "./graph";
import styles from '../styles/global.module.sass'
console.log(styles)


type PropsType = {
  strategyBacktestResults?: StrategyReport
}
type StateType = {
  strategyBacktestResults?: StrategyReport,
  windowWidth: number,
  windowHeight: number
}

class Main extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    actions.getStrategies();
    actions.getStrategyReports();

    this.state = {windowWidth: window.innerWidth, windowHeight: window.innerHeight}

    this.handleResize = this.handleResize.bind(this)    
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight})
  }

  render() {
    const underNavStyle = {
      height: window.innerHeight - 50,
      display: 'flex',
    }
    const graphStyle: CSSProperties = {
      backgroundColor: '#1a2027',
      minHeight: '70%',
      textAlign: 'start'
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
          <div className={styles.graphBacktestListWrapperStyle}>
            <div style={graphStyle}>
              <Graph width={this.state.windowWidth * 0.85} height={this.state.windowHeight * 0.6}></Graph>
            </div>
            <div style={backtestListStyle}>
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