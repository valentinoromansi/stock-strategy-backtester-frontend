import { Strategy } from '../models/strategy';
import { StrategyReport } from '../models/strategy-report';
import * as types from './types';

export type StateType = {
  strategyReports: StrategyReport[],
  strategyReportsFecthing: boolean,
  strategies: Strategy[],
  strategiesFecthing: boolean,
  selectedStrategy: Strategy | null,
}

// Initial (starting) state
export const initialState: StateType = {
  strategyReports: [],
  strategyReportsFecthing: true,
  strategies: [],
  strategiesFecthing: true,
  selectedStrategy: null,
};

// Our root reducer starts with the initial state
// and must return a representation of the next state
export const rootReducer = (state = initialState, action: {type: any, payload: any}): StateType => {
  switch (action.type) {
    case types.UPDATE_STRATEGY_REPORTS:
      return { ...state, strategyReports: action.payload };
    case types.FETCHING_STRATEGY_REPORTS:
      return { ...state, strategyReportsFecthing: action.payload };
    case types.UPDATE_STRATEGIES:
      return { ...state, strategies: action.payload };
    case types.FETCHING_STRATEGIES:
      return { ...state, strategiesFecthing: action.payload };
    case types.SET_SELECTED_STRATEGY:
      return { ...state, selectedStrategy: action.payload };
    default:
      return state;
  }
};