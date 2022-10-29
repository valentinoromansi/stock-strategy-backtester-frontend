import * as types from './types';
import { store } from '../state/store'
import * as http from "../http/http";
import { StrategyReport } from '../models/strategy-report';
import { Strategy } from '../models/strategy';
import { BacktestResult, TradeDateAndValues } from '../models/backtest-result';
import { TradeResult } from 'types/trade-result';


export function getStock(interval: string, symbol: string) {
  store.dispatch({type: types.FETCHING_STOCK, payload: true})
    http.getStock(interval, symbol).then((data: any) => {
      store.dispatch({type: types.SET_SELECTED_STOCK, payload: data})
      store.dispatch({type: types.FETCHING_STOCK, payload: false})
  })
}

export function getStrategyReports() {
  store.dispatch({type: types.FETCHING_STRATEGY_REPORTS, payload: true})
    http.getStrategyReports().then((data: StrategyReport[]) => {
      store.dispatch({type: types.UPDATE_STRATEGY_REPORTS, payload: data})
      store.dispatch({type: types.FETCHING_STRATEGY_REPORTS, payload: false})
  })
}

export function setSelectedBacktestResult(backtestResult: BacktestResult) {
  store.dispatch({type: types.SET_SELECTED_BACKTEST_RESULT, payload: backtestResult})
}

export function updateStrategyReports() {
  store.dispatch({type: types.FETCHING_STRATEGY_REPORTS, payload: true})
    http.updateStrategyReports().then((data: StrategyReport[]) => {
      store.dispatch({type: types.UPDATE_STRATEGY_REPORTS, payload: data})
      store.dispatch({type: types.FETCHING_STRATEGY_REPORTS, payload: false})
  })
}

export function getStrategies() {
  store.dispatch({type: types.FETCHING_STRATEGIES, payload: true})
    http.getStrategies().then((data: Strategy[]) => {
      store.dispatch({type: types.UPDATE_STRATEGIES, payload: data})
      if(data.length > 0) // ! remove this when strategies list component gets done
        store.dispatch({type: types.SET_SELECTED_STRATEGY, payload: data[0]})
      store.dispatch({type: types.FETCHING_STRATEGIES, payload: false})
  })
}

export function setSelectedStrategy(strategy: Strategy) {
  store.dispatch({type: types.SET_SELECTED_STRATEGY, payload: strategy})
}

export function setSelectedTrade(trade: TradeDateAndValues) {
  store.dispatch({type: types.SET_SELECTED_TRADE, payload: trade})
}