import * as types from './types';
import { store } from '../state/store'
import * as http from "../http/http";
import { strategyMock } from "../mocks/mocks";



export function getBacktestData() {
  store.dispatch({type: types.BACKTEST_DATA_LOADING, payload: true})
    http.getBacktestData(strategyMock).then(data => {
      store.dispatch({type: types.UPDATE_BACKTEST_DATA, payload: data})
      store.dispatch({type: types.BACKTEST_DATA_LOADING, payload: false})
  })
}