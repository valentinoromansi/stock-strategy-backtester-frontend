import * as types from './types';
import { store } from '../state/store'
import * as http from "../http/http";
import { StrategyReport } from '../models/strategy-report';
import { Strategy } from '../models/strategy';



export function getStrategyReport() {
  store.dispatch({type: types.FETCHING_STRATEGY_REPORTS, payload: true})
    http.getStrategyReports().then((data: StrategyReport[]) => {
      store.dispatch({type: types.UPDATE_STRATEGY_REPORTS, payload: data})
      store.dispatch({type: types.FETCHING_STRATEGY_REPORTS, payload: false})
  })
}

export function getStrategies() {
  store.dispatch({type: types.FETCHING_STRATEGIES, payload: true})
    http.getStrategies().then((data: Strategy[]) => {
      store.dispatch({type: types.UPDATE_STRATEGIES, payload: data})
      store.dispatch({type: types.FETCHING_STRATEGIES, payload: false})
      if(data.length > 0) // ! remove this when strategies list component gets done
        store.dispatch({type: types.SET_SELECTED_STRATEGY, payload: data[0]})
  })
}

export function setSelectedStrategy(strategy: Strategy) {
  store.dispatch({type: types.SET_SELECTED_STRATEGY, payload: strategy})
}