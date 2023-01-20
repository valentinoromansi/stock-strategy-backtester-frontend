import { StrategyReport } from "../models/strategy-report"
import colors from "colors"
import { Strategy } from "../models/strategy"
import * as actions from "../state/actions";
import { Notification } from "components/notifications-stack";

const URL_GET_STOCK: string = 'http://localhost:4000/get-stock'
const URL_GET_STRATEGY_REPORTS: string = 'http://localhost:4000/get-strategy-reports'
const URL_GET_STRATEGIES: string = 'http://localhost:4000/get-strategies'
const URL_SAVE_STRATEGY: string = 'http://localhost:4000/save-strategy'
const URL_DELETE_STRATEGY: string = 'http://localhost:4000/delete-strategy'
const URL_UPDATE_STRATEGY_REPORTS: string = 'http://localhost:4000/update-strategy-reports'
const URL_AUTHENTICATE: string = 'http://localhost:4000/authenticate'
const HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiSXZpY2EiLCJpYXQiOjE2NzQwODc2MTZ9.GWmsd1NT1oBswd7qyAnWo4BeZPu3cFr2PHdHxVG7FEs'
}

/*
** Use this interface for every http response and handle status=200 for valid response and others for invalid
*/
interface ServiceResponse{
  status?: number
  message?: string
  data?: any
}

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
        actions.addNotification(new Notification('success', 'Strategy reports fetched.'))
        resolve(reports)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STRATEGY_REPORTS} thrown error: ` + err))
      actions.addNotification(new Notification('error', 'Strategy reports could not be fetched!'))
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
        actions.addNotification(new Notification('success', 'Strategies fetched.'))
        resolve(strategies)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STRATEGIES} thrown error: ` + err))
      actions.addNotification(new Notification('error', 'Strategies could not be fetched!'))
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
        actions.addNotification(new Notification('success', `Strategy "${strategy.name}" saved.`))
        resolve(true)
      }
      resolve(false)
    })
    .catch((err) => {
      console.log(colors.red(`Saving strategy over ${URL_SAVE_STRATEGY} thrown error: ` + err))
      actions.addNotification(new Notification('error', `Strategy "${strategy.name}" could not be saved.`))
      resolve(false)
    })
  })
}


export let deleteStrategy = (name: string) : Promise<boolean> => {
  return new Promise(async (resolve) => {
    return fetch(URL_DELETE_STRATEGY, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({name: name})
    })
    .then(response => {
      console.log(response)
      if(response) {
        console.log(colors.green(`Deleting strategy ${name} over ${URL_DELETE_STRATEGY} done.`))
        actions.addNotification(new Notification('success', `Strategy "${name}" deleted.`))
        resolve(true)
      }
      resolve(false)
    })
    .catch((err) => {
      console.log(colors.red(`Deleting strategy ${name} over ${URL_DELETE_STRATEGY} thrown error: ` + err))
      actions.addNotification(new Notification('error', `Strategy "${name}" could not be deleted!`))
      resolve(false)
    })
  })
}



export let regenerateStrategyReports = () : Promise<StrategyReport[]> => {
  return new Promise(async (resolve) => {
    return fetch(URL_UPDATE_STRATEGY_REPORTS, {
      method: 'POST',
      headers: HEADERS
    })
    .then(response => {
      response.json().then(jsonObj => {
        let reports: StrategyReport[] = jsonObj
        console.log(colors.green(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} done.`))
        actions.addNotification(new Notification('success', 'Regenerating strategy reports finished.'))
        resolve(reports)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} thrown error: ` + err))
      actions.addNotification(new Notification('error', 'Strategy reports could not be regenerated!'))
      resolve([])
    })
  })
}


export interface AuthenticationResponse {
  message: string,
  accessToken: string
}

export interface UserCredentials {
  user: string,
  password: string
}

export let authentication = (credentials: UserCredentials) : Promise<AuthenticationResponse> => {
  return new Promise(async (resolve) => {
    return fetch(URL_AUTHENTICATE, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(credentials)
    })
    .then(response => {
      response.json().then((authRes: AuthenticationResponse) => {        
        console.log(colors.bgBlue(authRes.accessToken))
        resolve(authRes)
      })
    })
    .catch((err) => {
      console.log(colors.red(`User ${URL_UPDATE_STRATEGY_REPORTS} could not be authenticated.` + err))
      resolve(null)
    })
  })
}