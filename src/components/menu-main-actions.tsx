import React, { Component, CSSProperties } from "react";
import { StrategyReport } from "../models/strategy-report";
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getStrategyReports } from "../http/http";
import { store } from "../state/store";
import * as types from '../state/types';
import * as actions from "../state/actions";
import UpdateIcon from '@mui/icons-material/Update';
import "apercu-font";
import styles from '../styles/global.module.sass'
import { Divider, Grid, List, ListItemButton, ListSubheader, Typography } from "@mui/material";


type PropsType = {
  strategyBacktestResults?: StrategyReport[]
  currentStr?: string
}
type StateType = {
  strategyBacktestResults?: StrategyReport[]
}


class MenuMainActions extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    getStrategyReports().then(data => {
      this.setState({ strategyBacktestResults: data })
      store.dispatch({type: types.UPDATE_STRATEGY_REPORTS, payload: data})
    })

  }

  componentDidUpdate(prevProps: PropsType) {
    if(prevProps.strategyBacktestResults !== this.props.strategyBacktestResults) {
      this.setState({strategyBacktestResults: this.props.strategyBacktestResults});
    }
  }

  updateStrategyReports() {
    actions.updateStrategyReports()
  }

  refetchStrategyReports() {
    actions.getStrategyReports()
  }  

  refetchStrategies() {
    actions.getStrategies()
  }

  readonly sxIconStyle = {
    fontSize: '3.2rem'
  }

  render() {
    return (
      <List sx={{ paddingBottom: '10px', bgcolor: 'background.paper', borderRadius: '6px'} }>
        <Grid container alignItems='center'>
          {/* Strategy name */}
          <Grid item xs={12} sx={{display: "flex", flexDirection: "column", gap: "8px", paddingLeft: '8px', paddingRight: '8px'}}>
            <Button sx={{ width: "auto" }} variant="contained">
              Refetch strategies
            </Button>
            <Divider variant='middle' sx={{ paddingTop: '2px', marginBottom: '2px' }} orientation="horizontal" flexItem />
            <Button sx={{width: "auto" }} variant="contained">
              Refetch reports
            </Button>
            <Divider variant='middle' sx={{ paddingTop: '2px', marginBottom: '2px' }} orientation="horizontal" flexItem />            
            <Button sx={{width: "auto" }} variant="contained">
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
    currentStr: state.currentStr
  };
};

export default connect(mapStateToProps)(MenuMainActions);
