import React, { Component } from "react";
import { StrategyReport } from "../models/strategy-report";
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getStrategyReports } from "../http/http";
import { store } from "../state/store";
import * as types from '../state/types';
import * as actions from "../state/actions";


type PropsType = {
  strategyBacktestResults?: StrategyReport[]
  currentStr?: string
}
type StateType = {
  strategyBacktestResults?: StrategyReport[]
  spinnerActive?: boolean
}


class Navigation extends Component<PropsType, StateType> {
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

  onRefresh() {
    actions.getStrategyReport();
  }

  render() {
    const navStyle = {
      width: '100%',
      padding: '8px',
      backgroundColor: 'red'
    }
    
    return (
      <div style={navStyle}>
        <Stack spacing={1} direction="row">
          <Button variant="text" onClick={() => { this.onRefresh();}}>
            <div>
              <RefreshIcon fontSize="large"/>
              <div>
                <b>refresh</b>
              </div>
            </div>
          </Button>
        </Stack>
      </div>
    );
  }

}


const mapStateToProps = (state: any) => {
  return {
    currentStr: state.currentStr
  };
};

export default connect(mapStateToProps)(Navigation);
