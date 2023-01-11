import { StrategyReport } from "../models/strategy-report"
import colors from "colors"
import { Strategy } from "../models/strategy"

const URL_GET_STOCK: string = 'http://localhost:4000/get-stock'
const URL_GET_STRATEGY_REPORTS: string = 'http://localhost:4000/get-strategy-reports'
const URL_GET_STRATEGIES: string = 'http://localhost:4000/get-strategies'
const URL_SAVE_STRATEGY: string = 'http://localhost:4000/save-strategy'
const URL_UPDATE_STRATEGY_REPORTS: string = 'http://localhost:4000/update-strategy-reports'
const HEADERS: HeadersInit = {'Content-Type': 'application/json'}

export let getStock = (interval: string, symbol: string) : Promise<[]> => {
  return new Promise(async (resolve) => {
    return fetch(URL_GET_STOCK, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ "interval": interval, "symbol": symbol })
    })
    .then(response => {
      response.json().then(jsonObj => {
        console.log(colors.green(`Fetch ${URL_GET_STOCK} done.`))
        for(const o of jsonObj)
          o.date = new Date(o.date)
        resolve(jsonObj)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STOCK} thrown error: ` + err))
      resolve(null)
    })
  })
}

export let getStrategyReports = () : Promise<StrategyReport[]> => {
  return new Promise(async (resolve) => {
    return fetch(URL_GET_STRATEGY_REPORTS, {
      method: 'GET',
      headers: HEADERS
    })
    .then(response => {
      response.json().then(jsonObj => {
        let reports: StrategyReport[] = jsonObj
        console.log(colors.green(`Fetch ${URL_GET_STRATEGY_REPORTS} done.`))
        resolve(reports)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STRATEGY_REPORTS} thrown error: ` + err))
      resolve([])
    })
  })
}

export let getStrategies = () : Promise<Strategy[]> => {
  return new Promise(async (resolve) => {
    return fetch(URL_GET_STRATEGIES, {
      method: 'GET',
      headers: HEADERS
    })
    .then(response => {      
      response.json().then(jsonObj => {
        let strategies: Strategy[] = jsonObj
        console.log(colors.green(`Fetch ${URL_GET_STRATEGIES} done.`))
        resolve(strategies)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STRATEGIES} thrown error: ` + err))
      resolve([])
    })
  })
}

// HANDLE RESPONSE PROPERLY
// HANDLE RESPONSE PROPERLY
// HANDLE RESPONSE PROPERLY
export let saveStrategy = (strategy: Strategy) : Promise<boolean> => {
  return new Promise(async (resolve) => {
    return fetch(URL_SAVE_STRATEGY, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(strategy)
    })
    .then(response => {
      console.log(response)
      if(response) {
        console.log(colors.green(`Saving strategy over ${URL_SAVE_STRATEGY} done.`))
        resolve(true)
      }
      resolve(false)
    })
    .catch((err) => {
      console.log(colors.red(`Saving strategy over ${URL_SAVE_STRATEGY} thrown error: ` + err))
      resolve(false)
    })
  })
}

export let updateStrategyReports = () : Promise<StrategyReport[]> => {
  return new Promise(async (resolve) => {
    return fetch(URL_UPDATE_STRATEGY_REPORTS, {
      method: 'POST',
      headers: HEADERS
    })
    .then(response => {
      response.json().then(jsonObj => {
        let reports: StrategyReport[] = jsonObj
        console.log(colors.green(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} done.`))
        resolve(reports)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} thrown error: ` + err))
      resolve([])
    })
  })
}