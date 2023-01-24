import React, { Component } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./strategy-report-table";
import MenuMainActions from './menu-main-actions'
import MenuStrategyList from './menu-strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import GraphWithTradeMarkings from "./graph-with-trade-markings-and-bars/graph-with-trade-markings";
import StrategyDesigner from "./strategy-designer/strategy-designer";
import Box from '@mui/material/Box';
import { BacktestResult } from "models/backtest-result";
import NotificationsStack from "./notifications-stack";
import LoginForm from "./login-form";
import { Typography } from "@mui/material";

type PropsType = {
  strategyEditorActive: boolean,
  selectedStrategyReport: StrategyReport,
  selectedBacktestResult: BacktestResult,
  authenticated: boolean
}
type StateType = {
  graphSize: GraphSize
}

interface GraphSize {
  width: number,
  height: number
}

class Main extends Component<PropsType, StateType> {

  graphWrapperRef: React.RefObject<HTMLElement> = React.createRef();

  constructor(props: PropsType) {
    super(props);
    this.state = {
      graphSize: { width: 0, height: 0}
    }
    this.updateGraphSize = this.updateGraphSize.bind(this)
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

  componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<StateType>, snapshot?: any): void {
    if(prevProps.authenticated !== this.props.authenticated) {
      actions.getStrategies()
      actions.getStrategyReports()
    }
    if(prevProps.selectedBacktestResult !== this.props.selectedBacktestResult)
      this.updateGraphSize()
  }


  GraphAndReportTable(props: { backtestResults: BacktestResult[], selectedBacktestResult: BacktestResult, graphSize: GraphSize }) {
    return(
      <React.Fragment> 
        {
          props.backtestResults ?
          <React.Fragment>                         
            { 
              props.selectedBacktestResult &&
              <Box width='100%' display='flex' flexDirection='column'>
                <GraphWithTradeMarkings width={props.graphSize.width} height={props.graphSize.height}/>
              </Box> 
            }
            <Box width='100%' display='flex' flexDirection='column'>
              <StrategyReportTable/>
            </Box>
          </React.Fragment>
          :
          <Typography fontSize='large' color="#343434">There are no reports generated for this strategy.</Typography>
        }                                
      </React.Fragment>)
  }


  render() {
    const { authenticated, strategyEditorActive, selectedStrategyReport, selectedBacktestResult  } = this.props
    const { graphSize } = this.state

    return (
        <Box p={'24px'}>
          <NotificationsStack/>
          {
            !authenticated ?
            <LoginForm/>
            :
            <Box display='flex' flexDirection='row' gap='16px'>          
              {/* Action and strategy menus */}
              <Box minWidth='190px' display='flex' flexDirection='column' gap='16px'>
                <MenuMainActions/>      
                <MenuStrategyList/>
              </Box>
              {/* Strategy designer or (graph and report table)*/}
              <Box sx={{width:'100%', minWidth:'500px', display:'flex', flexDirection:'column', gap:'16px'}} width='100%' minWidth='500px' display='flex' flexDirection='column' gap='16px' ref={this.graphWrapperRef}>
                {
                  strategyEditorActive ?                  
                  <StrategyDesigner/>                
                  :
                  <this.GraphAndReportTable backtestResults={selectedStrategyReport?.backtestResults} selectedBacktestResult={selectedBacktestResult} graphSize={graphSize}/>
                }
              </Box>
            </Box>
          }
        </Box>
    );
  }

}



const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyEditorActive: state.strategyDesignerActive,
    selectedBacktestResult: state.selectedBacktestResult,
    selectedStrategyReport: state.strategyReports.find(item => item.strategyName === state.selectedStrategy?.name),
    authenticated: state.authenticated
  };
};

export default connect(mapStateToProps)(Main);