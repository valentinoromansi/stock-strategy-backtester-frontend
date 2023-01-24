import { Component } from "react";
import { StrategyReport } from "../models/strategy-report";
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import * as actions from "../state/actions";
import "apercu-font";
import { Grid, List } from "@mui/material";
import * as storage from "../browser-storage/browser-storage";


type PropsType = {
  strategyBacktestResults?: StrategyReport[]
  currentStr?: string
  strategiesFecthing: boolean,
  strategyReportsFecthing: boolean    
}
type StateType = {
  strategyBacktestResults?: StrategyReport[]
}


class MenuMainActions extends Component<PropsType, StateType> {

  componentDidUpdate(prevProps: PropsType) {
    if(prevProps.strategyBacktestResults !== this.props.strategyBacktestResults) {
      this.setState({strategyBacktestResults: this.props.strategyBacktestResults});
    }
  }

  generateStrategyReports() {
    actions.updateStrategyReports()
  }

  refetchStrategyReports() {
    actions.getStrategyReports()
  }  

  refetchStrategies() {
    actions.getStrategies()
  }

  logout() {
    storage.removeItem('session', 'access_token')
    actions.setAuthenticationFlag(false)
  }

  readonly sxIconStyle = {
    fontSize: '3.2rem'
  }



  render() {
    return (
      <List sx={{ borderRadius: '4px'} }>
        <Grid container alignItems='center'>
          {/* Strategy name */}
          <Grid item xs={12} sx={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <Button sx={{ width: "auto", padding: "10px 20px" }} variant="outlined" onClick={this.logout}>
              logout
            </Button>
            <Button sx={{ width: "auto", padding: "10px 20px" }} variant="contained" onClick={this.refetchStrategies} disabled={this.props.strategiesFecthing}>
              Refetch strategies
            </Button>
            <Button sx={{width: "auto", padding: "10px 20px" }} variant="contained" onClick={this.refetchStrategyReports} disabled={this.props.strategyReportsFecthing}>
              Refetch reports
            </Button>
            <Button sx={{width: "auto", padding: "10px 20px" }} variant="contained" onClick={this.generateStrategyReports} disabled={this.props.strategyReportsFecthing}>
              Regenerate reports
            </Button>
          </Grid>
        </Grid>
      </List>
    );
  }

}


const mapStateToProps = (state: any) => {
  return {
    currentStr: state.currentStr,
    strategiesFecthing: state.strategiesFecthing,
    strategyReportsFecthing: state.strategyReportsFecthing    
  };
};

export default connect(mapStateToProps)(MenuMainActions);
