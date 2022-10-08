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

  updateStrategyReports() {
    actions.updateStrategyReports()
  }

  refetchStrategyReports() {
    actions.getStrategyReports()
  }  

  refetchStrategies() {
    actions.getStrategies()
  }

  navItemStyle = { py: 0, minHeight: 16, "&:hover": {backgroundColor: '#212936'} }
  navItemTextStyle = {color: '#56657f'}

  render() {
    const navStyle: CSSProperties = {
      width: '100%',
      padding: '8px',
      backgroundColor: '#212936',
      display: 'flex',
      justifyContent:'left', 
      flexDirection: 'row',
      gap: '10px'
    }
    

    return (
      <div style={navStyle}>
        <div style={this.navItemStyle}>
          <Button variant="text" onClick={() => { this.updateStrategyReports()}}>
              <div>
                <UpdateIcon fontSize="large"/>
                <div>
                  <b style={this.navItemTextStyle}>Regenerate reports</b>
                </div>
              </div>
          </Button>
          </div>
          <div>
          <Button variant="text" onClick={() => { this.refetchStrategyReports();}}>
              <div>
                <RefreshIcon fontSize="large"/>
                <div>
                <b style={this.navItemTextStyle}>Refetch reports</b>
                </div>
              </div>
          </Button>
        </div>
        <div>
          <Button variant="text" onClick={() => { this.refetchStrategies();}}>
              <div>
                <RefreshIcon fontSize="large"/>
                <div>
                <b style={this.navItemTextStyle}>Refetch strategies</b>
                </div>
              </div>
          </Button>
        </div>
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
