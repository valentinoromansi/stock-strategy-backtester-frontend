import React, { Component } from "react";
import { StrategyBacktestResults } from "../models/strategy-backtest-results";
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getBacktestData } from "../http/http";
import { strategyMock } from "../mocks/mocks";
import { store } from "../state/store";
import * as types from '../state/types';
import * as actions from "../state/actions";


type PropsType = {
  strategyBacktestResults?: StrategyBacktestResults
  currentStr?: string
}
type StateType = {
  strategyBacktestResults?: StrategyBacktestResults
  spinnerActive?: boolean
}


class Navigation extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    getBacktestData(strategyMock).then(data => {
      this.setState({ strategyBacktestResults: data })
      store.dispatch({type: types.UPDATE_BACKTEST_DATA, payload: data})
    })

  }

  componentDidUpdate(prevProps: PropsType) {
    if(prevProps.strategyBacktestResults !== this.props.strategyBacktestResults) {
      this.setState({strategyBacktestResults: this.props.strategyBacktestResults});
    }
  }

  onRefresh() {
    actions.getBacktestData();
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
