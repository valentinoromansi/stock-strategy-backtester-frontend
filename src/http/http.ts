import { StrategyReport } from "../models/strategy-report"
import colors from "colors"
import { Strategy } from "../models/strategy"

const URL_GET_STRATEGY_REPORTS: string = 'http://localhost:4000/get-strategy-reports'
const URL_GET_STRATEGIES: string = 'http://localhost:4000/get-strategies'
const HEADERS: HeadersInit = {'Content-Type': 'application/json'}

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