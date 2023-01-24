import { Notification } from "models/notification";
import { BacktestResult, TradeDateAndValues } from '../models/backtest-result';
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
  strategyDesignerStrategy: Strategy | null,
  strategiesFecthing: boolean,
  selectedTrade: TradeDateAndValues | null,
  strategyDesignerActive: boolean,
  notifications: Notification[],
  authenticated: boolean,
  authenticationFetching: boolean
}

// Initial (starting) state
export const initialState: StateType = {
  stockVerticalSlicesFecthing: true,
  selectedStockVerticalSlices: [],
  selectedBacktestResult: null,
  strategyReports: [],
  strategyReportsFecthing: true,
  strategies: [],
  strategiesFecthing: true,
  selectedStrategy: null, // used to hold value of selected strategy with all children properties
  strategyDesignerStrategy: null, // strategy that should be used for strategy edit, can always revert to 'selectedStrategy' which is its initial state
  selectedTrade: null,
  strategyDesignerActive: false,
  notifications: [],
  authenticated: false,
  authenticationFetching: false
};

// Our root reducer starts with the initial state
// and must return a representation of the next state
export const rootReducer = (state = initialState, action: {type: any, payload: any}): StateType => {
  switch (action.type) {
    case types.SET_AUTHENTICATION_FLAG:
      return { ...state, authenticated: action.payload };
    case types.FETCHING_AUTHENTICATION:
      return { ...state, authenticationFetching: action.payload };
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
    case types.SET_STRATEGY_DESIGNER_STRATEGY:
      return { ...state, strategyDesignerStrategy: action.payload };
    case types.SET_SELECTED_STOCK:
      return { ...state, selectedStockVerticalSlices: action.payload };
    case types.FETCHING_STOCK:
      return { ...state, stockVerticalSlicesFecthing: action.payload };
    case types.SET_SELECTED_BACKTEST_RESULT:
      return { ...state, selectedBacktestResult: action.payload };
    case types.SET_SELECTED_TRADE:
      return { ...state, selectedTrade: action.payload };
    case types.SET_STRATEGY_EDITOR_ACTIVE:
      return { ...state, strategyDesignerActive: action.payload };
    case types.ADD_NOTIFICATION:
      state.notifications.push(action.payload)
      return { ...state, notifications: [...state.notifications]}
    case types.REMOVE_NOTIFICATION:
      const idToRemove = action.payload
      const notifications = state.notifications.filter(n => n.id !== idToRemove)
      return { ...state, notifications: notifications }
    default:
      return state;
  }
};