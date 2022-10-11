import { Strategy } from '../models/strategy';
import { StrategyReport } from '../models/strategy-report';
import * as types from './types';

export type StateType = {
  stockFecthing: boolean,
  selectedStock: any,
  strategyReports: StrategyReport[],
  strategyReportsFecthing: boolean,
  strategies: Strategy[],
  strategiesFecthing: boolean,
  selectedStrategy: Strategy | null,
}

// Initial (starting) state
export const initialState: StateType = {
  stockFecthing: true,
  selectedStock: [
    { 
      date: new Date("2010-01-03T23:00:00.000Z"),
      "open": 25.436282332605284, 
      "high": 25.835021381744056, 
      "low": 25.411360259406774, 
      "close": 25.710416, 
      "volume": 38409100
      },
  { 
    date: new Date("2010-01-03T23:05:00.000Z"), 
    "open": 25.436282332605284, 
    "high": 25.835021381744056, 
    "low": 25.411360259406774, 
    "close": 25.710416, 
    "volume": 3840910
  },
  { 
    date: new Date("2010-01-03T23:10:00.000Z"), 
    "open": 25.436282332605284, 
    "high": 25.835021381744056, 
    "low": 25.411360259406774, 
    "close": 25.710416, 
    "volume": 3840910
  }
],
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
    case types.SET_SELECTED_STOCK:
      return { ...state, selectedStock: action.payload };
    case types.FETCHING_STOCK:
      return { ...state, stockFecthing: action.payload };
    default:
      return state;
  }
};