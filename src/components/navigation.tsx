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


  render() {
    return (
      <div className={styles.navWrapper}>
        <div>
          <Button variant="text" onClick={() => { this.updateStrategyReports()}}>
              <div>
                <UpdateIcon className={styles.navIcon}/>
                <div>
                  <b className={styles.navItemTextStyle}>Regenerate reports</b>
                </div>
              </div>
          </Button>
        </div>
        <div>
          <Button variant="text" onClick={() => { this.refetchStrategyReports();}}>
              <div>
                <RefreshIcon className={styles.navIcon}/>
                <div>
                <b className={styles.navItemTextStyle}>Refetch reports</b>
                </div>
              </div>
          </Button>
        </div>
        <div>
          <Button variant="text" onClick={() => { this.refetchStrategies();}}>
              <div>
                <RefreshIcon className={styles.navIcon}/>
                <div>
                <b className={styles.navItemTextStyle}>Refetch strategies</b>
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
