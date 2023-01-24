import React, { Component } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./strategy-report-table/strategy-report-table";
import MenuMainActions from './menu-main-actions'
import MenuStrategyList from './menu-strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import GraphWithTradeMarkings from "./graph-with-trade-markings/graph-with-trade-markings";
import StrategyDesigner from "./strategy-designer/strategy-designer";
import Box from '@mui/material/Box';
import { BacktestResult } from "models/backtest-result";
import NotificationsStack from "./notifications-stack";
import LoginForm from "./login-form/login-form";
import { Typography } from "@mui/material";

type PropsType = {
  strategyEditorActive: boolean,
  strategyReports: StrategyReport[],
  selectedStrategyReport: StrategyReport,
  selectedBacktestResult: BacktestResult,
  authenticated: boolean
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

  componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<StateType>, snapshot?: any): void {
    if(prevProps.authenticated !== this.props.authenticated) {
      actions.getStrategies()
      actions.getStrategyReports()
    }
    if(prevProps.selectedBacktestResult !== this.props.selectedBacktestResult)
      this.updateGraphSize()
  }


  render() {
    return (
        <Box sx={{ padding: '24px'}}>
          <NotificationsStack/>
          {
            !this.props.authenticated ?
            <LoginForm/> :
            <React.Fragment>       
              <Box sx={{ display:'flex', flexDirection: 'row', gap: '16px'}}>          
                {/* Action and strategy list */}
                <Box sx={{ minWidth: '190px', display:'flex', flexDirection: 'column', gap: '16px'}}>
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
                          this.props.selectedStrategyReport?.backtestResults ?
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
                          :
                          <Typography fontSize={'large'} color="#343434">There are no reports generated for this strategy.</Typography>
                        }                                
                      </React.Fragment>
                    }
                </Box>
              </Box>
            </React.Fragment>
          }
        </Box>
    );
  }

}



const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyEditorActive: state.strategyEditorActive,
    strategyReports: state.strategyReports,
    selectedStrategyReport: state.strategyReports.find(item => item.strategyName === state.selectedStrategy?.name),
    selectedBacktestResult: state.selectedBacktestResult,
    authenticated: state.authenticated
  };
};

export default connect(mapStateToProps)(Main);