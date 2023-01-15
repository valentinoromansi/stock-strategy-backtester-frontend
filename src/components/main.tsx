import React, { Component, CSSProperties, useEffect, useRef, useState } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./strategy-report-table/strategy-report-table";
import MenuMainActions from './menu-main-actions'
import MenuStrategyList from './menu-strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import GraphWithTradeMarkings from "./graph-with-trade-markings/graph-with-trade-markings";
import styles from '../styles/global.module.sass'
import StrategyDesigner from "./strategy-designer/strategy-designer";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Collapse, Grid, List, ListSubheader, MenuItem, Select, Typography } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';
import { Strategy } from "models/strategy";
import { BacktestResult } from "models/backtest-result";


type PropsType = {
  strategyEditorActive: boolean,
  strategyReports: StrategyReport[],
  selectedStrategyReport: StrategyReport,
  selectedBacktestResult: BacktestResult
}
type StateType = {
  strategyBacktestResults?: StrategyReport,
  actionMenuOpened: boolean,
  graphSize: { width: number, height: number }
}


class Main extends Component<PropsType, StateType> {


  graphWrapperRef: React.RefObject<HTMLElement> = React.createRef();

  constructor(props: PropsType) {
    super(props);
    actions.getStrategies();
    actions.getStrategyReports();    
    this.state = {
      actionMenuOpened: true,
      graphSize: { width: 0, height: 0}
    }
    this.updateGraphSize = this.updateGraphSize.bind(this)
    this.handleActionMenuClick = this.handleActionMenuClick.bind(this)
  }
  
  
  updateGraphSize() {
    this.setState({
      graphSize: {
        width: this.graphWrapperRef?.current?.clientWidth,
        height: window.innerHeight * 0.7
      }
    })
  }
  
  componentDidMount(): void {
    this.updateGraphSize()
    window.addEventListener('resize', this.updateGraphSize)
  }
 
  handleActionMenuClick() {
    this.setState({actionMenuOpened: !this.state.actionMenuOpened})
  }


  render() {

    return (
        <Box sx={{ width: '100%', padding: '24px' }}>
          <Box sx={{ display:'flex', flexDirection: 'row', gap: '16px'}}>          
            {/* Action and strategy list */}
            <Box sx={{ width: '200px', display:'flex', flexDirection: 'column', gap: '16px'}}>
              <MenuMainActions/>      
              <MenuStrategyList/>
            </Box>
            {/* Strategy designer, graph view, report table  */}
            <Box sx={{ width: '100%', minWidth: '500px', display:'flex', flexDirection: 'column', gap: '16px'}} ref={this.graphWrapperRef}>
              {/* Strategy designer*/}
                {this.props.strategyEditorActive ?                  
                  <StrategyDesigner/>                
                :
                <React.Fragment>
                    {/* Graph and Report table */}
                    {
                      this.props.selectedStrategyReport?.backtestResults &&
                      <React.Fragment>                         
                        { this.props.selectedBacktestResult &&
                          <Box sx={{ width: '100%', display:'flex', flexDirection: 'column'}}>
                            <GraphWithTradeMarkings width={this.state.graphSize.width} height={this.state.graphSize.height}/>
                          </Box> 
                        }
                        <Box sx={{ width: '100%', display:'flex', flexDirection: 'column'}}>
                          <StrategyReportTable/>
                        </Box>
                      </React.Fragment>
                    }                                
                  </React.Fragment>
                }
            </Box>
          </Box>
        </Box>
    );
  }

}



const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyEditorActive: state.strategyEditorActive,
    strategyReports: state.strategyReports,
    selectedStrategyReport: state.strategyReports.find(item => item.strategyName === state.selectedStrategy?.name),
    selectedBacktestResult: state.selectedBacktestResult
  };
};

export default connect(mapStateToProps)(Main);