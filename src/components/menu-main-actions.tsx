import { Component } from "react";
import { StrategyReport } from "../models/strategy-report";
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import * as actions from "../state/actions";
import { Grid, List } from "@mui/material";
import * as storage from "../browser-storage/browser-storage";


type PropsType = {
  strategyBacktestResults?: StrategyReport[]
  strategiesFecthing: boolean,
  strategyReportsFecthing: boolean    
}
type StateType = {
}


class MenuMainActions extends Component<PropsType, StateType> {

  logout() {
    storage.removeItem('session', 'access_token')
    actions.setAuthenticationFlag(false)
  }


  buttonStyle =  { width: "auto", padding: "10px 20px" }

  render() {

    return (
      <List sx={{ borderRadius: '4px'} }>
        <Grid container alignItems='center'>
          {/* Strategy name */}
          <Grid item xs={12} sx={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <Button sx={ this.buttonStyle } variant="outlined" onClick={this.logout}>
              logout
            </Button>
            <Button sx={ this.buttonStyle } variant="contained" onClick={actions.getStrategies} disabled={this.props.strategiesFecthing}>
              Refetch strategies
            </Button>
            <Button sx={ this.buttonStyle } variant="contained" onClick={actions.getStrategyReports} disabled={this.props.strategyReportsFecthing}>
              Refetch reports
            </Button>
            <Button sx={ this.buttonStyle } variant="contained" onClick={actions.updateStrategyReports} disabled={this.props.strategyReportsFecthing}>
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
    strategiesFecthing: state.strategiesFecthing,
    strategyReportsFecthing: state.strategyReportsFecthing    
  };
};

export default connect(mapStateToProps)(MenuMainActions);
