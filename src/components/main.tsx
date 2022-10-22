import React, { Component, CSSProperties, useEffect, useRef, useState } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./strategy-report-table";
import Navigation from './navigation'
import StrategyList from './strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import Graph from "./graph";
import styles from 'styles/global.module.sass'



type PropsType = {
}
type StateType = {
  strategyBacktestResults?: StrategyReport,
  graphWidth: number,
  graphHeight: number
}

class Main extends Component<PropsType, StateType> {

  constructor(props: PropsType) {
    super(props);
    actions.getStrategies();
    actions.getStrategyReports();
    
    this.state = {
      graphWidth: this.getGraphSize().width,
      graphHeight: this.getGraphSize().height
    }
    

    this.handleResize = this.handleResize.bind(this)    
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ 
      graphWidth: this.getGraphSize().width,
      graphHeight: this.getGraphSize().height
    })
  }

  getGraphSize(): { width: number, height: number} {
    return {
      width: window.innerWidth * 0.85,
      height: window.innerHeight * 0.6
    }
  }



  render() {

    const { graphWidth, graphHeight} = this.state

    return (
      <div>
        <Navigation/>
        <div className={styles.underNavStyle}>
          <StrategyList/>
          <div className={styles.graphBacktestListWrapperStyle}>
            <div className={styles.graphStyle}>
              <Graph width={graphWidth} height={graphHeight}/>
            </div>
            <StrategyReportTable/>
          </div>
        </div>
      </div>
    );
  }

}

export default Main;