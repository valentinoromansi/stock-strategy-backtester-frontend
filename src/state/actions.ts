import * as types from './types';
import { store } from '../state/store'
import * as http from "../http/http";
import { StrategyReport } from '../models/strategy-report';
import { Strategy } from '../models/strategy';
import { BacktestResult, TradeDateAndValues } from '../models/backtest-result';
import { TradeResult } from 'types/trade-result';
import { deepCopy } from 'utils/utils';
import { Notification } from 'components/notifications-stack';

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
      http.regenerateStrategyReports().then((data: StrategyReport[]) => {
        store.dispatch({type: types.UPDATE_STRATEGY_REPORTS, payload: data})
        store.dispatch({type: types.FETCHING_STRATEGY_REPORTS, payload: false})
        store.dispatch({type: types.SET_SELECTED_BACKTEST_RESULT, payload: null})
    })  
}

export function updateStrategies(data: Strategy[]) {
  store.dispatch({type: types.UPDATE_STRATEGIES, payload: data})
}

export function getStrategies() {
  store.dispatch({type: types.FETCHING_STRATEGIES, payload: true})
    http.getStrategies().then((data: Strategy[]) => {
      updateStrategies(data)
      if(data.length > 0) // ! remove this when strategies list component gets done
        store.dispatch({type: types.SET_SELECTED_STRATEGY, payload: data[0]})
      store.dispatch({type: types.FETCHING_STRATEGIES, payload: false})
  })
}


export function setSelectedStrategy(strategy: Strategy) {
  store.dispatch({type: types.SET_SELECTED_STRATEGY, payload: strategy})
}

export function setStrategyDesignerStrategy(strategy: Strategy) {
  const strategyDeepCopy = deepCopy(strategy)
  store.dispatch({type: types.SET_STRATEGY_DESIGNER_STRATEGY, payload: strategyDeepCopy})
}

export function setSelectedTrade(trade: TradeDateAndValues) {
  store.dispatch({type: types.SET_SELECTED_TRADE, payload: trade})
}

export function setStrategyEditorActive(state: boolean) {
  store.dispatch({type: types.SET_STRATEGY_EDITOR_ACTIVE, payload: state})
}

export function addNotification(notification: Notification) {
  const notifications = store.getState().notifications
  notification.id = (notifications?.[notifications.length - 1]?.id ?? 0) + 1
  store.dispatch({type: types.ADD_NOTIFICATION, payload: notification})
}

export function removeNotification(id: number) {
  store.dispatch({type: types.REMOVE_NOTIFICATION, payload: id})
}

export function setAuthenticationFlag(authenticated: boolean) {
  store.dispatch({type: types.SET_AUTHENTICATION_FLAG, payload: authenticated})
}