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

const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage?.getItem('access_token')}`
  }
}

/*
** Use this interface for every http response and handle status=200 for valid response and others for invalid
*/
interface ServiceResponse{
  status?: number
  message?: string
  data?: any
}

const showNotification = (status: number, successMsg: string, errorlMsg: string): any => {
  if(status === 200)
    return actions.addNotification(new Notification('success', successMsg))
  return actions.addNotification(new Notification('error', errorlMsg))
}


export let getStock = (interval: string, symbol: string) : Promise<[]> => {
  return new Promise(async (resolve) => {
    return fetch(URL_GET_STOCK, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ "interval": interval, "symbol": symbol })
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Fetch ${URL_GET_STOCK} done.`))
        const data = response.data ?? []
        showNotification(response.status, 'Stock fetched', 'Stock could not be fetched')
        for(const o of data)
          o.date = new Date(o.date)
        resolve(data)        
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
      headers: getHeaders()
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {        
        console.log(colors.green(`Fetch ${URL_GET_STRATEGY_REPORTS} done.`))
        const data: StrategyReport[] = response.data ?? []
        showNotification(response.status, 'Strategy reports fetched', 'Strategy reports could not be fetched')
        resolve(data)
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
      headers: getHeaders()
    })
    .then(response => {    
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Fetch ${URL_GET_STRATEGIES} done.`))
        const data: Strategy[]  = response.data ?? []
        showNotification(response.status, 'Strategies fetched', 'Strategies could not be fetched')
        resolve(data)
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
      headers: getHeaders(),
      body: JSON.stringify(strategy)
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Fetch ${URL_GET_STRATEGIES} done.`))
        const data: boolean = response.data ?? false
        showNotification(response.status, 'Strategy saved', 'Strategy could not be saved')
        resolve(data)
      })
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
      headers: getHeaders(),
      body: JSON.stringify({name: name})
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Fetch ${URL_GET_STRATEGIES} done.`))
        const data: boolean = response.data ?? false
        showNotification(response.status, 'Strategy deleted', 'Strategy could not be deleted')
        resolve(data)
      })
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
      headers: getHeaders()
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} done.`))
        const data: StrategyReport[] = response.data ?? []
        showNotification(response.status, 'Strategy reports regenerated', 'Strategy reports could not be regenerated')
        resolve(data)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} thrown error: ` + err))
      actions.addNotification(new Notification('error', 'Strategy reports could not be regenerated!'))
      resolve([])
    })
  })
}




export interface UserCredentials {
  user: string,
  password: string
}

// Authenticates user credentials and saves received jwt access token in local storage for future service calls
export let authentication = (credentials: UserCredentials) : Promise<string> => {
  return new Promise(async (resolve) => {
    return fetch(URL_AUTHENTICATE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    })
    .then(response => {
      response.json().then((response: ServiceResponse)=> {
        showNotification(response.status, `User ${credentials.user} authenticated.`, `User ${credentials.user} could not be authenticated.`)
        const token: string = response.data
        resolve(token)
      })
    })
    .catch((err) => {
      console.log(colors.red(`User ${URL_UPDATE_STRATEGY_REPORTS} could not be authenticated.` + err))
      resolve(null)
    })
  })
}