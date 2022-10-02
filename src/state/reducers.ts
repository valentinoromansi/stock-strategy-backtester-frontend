import { StrategyBacktestResults } from '../models/strategy-backtest-results';
import * as types from './types';

type StateType = {
  strategyBacktestResults?: StrategyBacktestResults | null,
  backtestDataLoading?: boolean
}

// Initial (starting) state
export const initialState: StateType = {
  strategyBacktestResults: null,
  backtestDataLoading: true
};

// Our root reducer starts with the initial state
// and must return a representation of the next state
export const rootReducer = (state = initialState, action: {type: any, payload: any}): StateType => {
  switch (action.type) {
    case types.UPDATE_BACKTEST_DATA:
      return { ...state, strategyBacktestResults: action.payload };
    case types.BACKTEST_DATA_LOADING:
      return { ...state, backtestDataLoading: action.payload };
    default:
      return state;
  }
};