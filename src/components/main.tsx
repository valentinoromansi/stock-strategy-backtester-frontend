import React, { Component, CSSProperties, useEffect, useRef, useState } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./strategy-report-table/strategy-report-table";
import Navigation from './navigation'
import StrategyList from './strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import GraphWithTradeMarkings from "./graph-with-trade-markings/graph-with-trade-markings";
import styles from '../styles/global.module.sass'
import StrategyDesigner from "./strategy-designer/strategy-designer";



type PropsType = {
  strategyEditorActive: boolean
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
      width: window.innerWidth * 0.9,
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
            {/* Render strategy editor or graph with trade markings */}
            {this.props.strategyEditorActive ?
              <StrategyDesigner/> :
              <div>
                <GraphWithTradeMarkings width={graphWidth} height={graphHeight}/>
                <StrategyReportTable/>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

}



const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyEditorActive: state.strategyEditorActive
  };
};

export default connect(mapStateToProps)(Main);
