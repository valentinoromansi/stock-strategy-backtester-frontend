import { BacktestResult } from '../models/backtest-result';
import { Strategy } from '../models/strategy';
import { StrategyReport } from '../models/strategy-report';
import { VerticalSlice } from '../models/vertical-slice';
import * as types from './types';

export type StateType = {
  selectedStockVerticalSlices: VerticalSlice[],
  stockVerticalSlicesFecthing: boolean,
  selectedBacktestResult: BacktestResult,
  strategyReports: StrategyReport[],
  strategyReportsFecthing: boolean,
  strategies: Strategy[],
  selectedStrategy: Strategy | null,
  strategiesFecthing: boolean,
}

// Initial (starting) state
export const initialState: StateType = {
  stockVerticalSlicesFecthing: true,
  selectedStockVerticalSlices: [
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
  selectedBacktestResult: null,
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
      return { ...state, selectedStockVerticalSlices: action.payload };
    case types.FETCHING_STOCK:
      return { ...state, stockVerticalSlicesFecthing: action.payload };
    case types.SET_SELECTED_BACKTEST_RESULT:
      return { ...state, selectedBacktestResult: action.payload };
    default:
      return state;
  }
};