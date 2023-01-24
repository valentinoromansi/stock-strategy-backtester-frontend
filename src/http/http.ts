import { StrategyReport } from "../models/strategy-report"
import colors from "colors"
import { Strategy } from "../models/strategy"
import * as actions from "../state/actions";
import { Notification } from "models/notification";
import * as storage from "browser-storage/browser-storage";
import { UserCredentials } from "types/user-credentials";

const BASE_URL: string = process?.env?.REACT_APP_SERVICE_BASE_URL
const URL_GET_STOCK: string = BASE_URL + 'get-stock'
const URL_GET_STRATEGY_REPORTS: string = BASE_URL + 'get-strategy-reports'
const URL_GET_STRATEGIES: string = BASE_URL + 'get-strategies'
const URL_SAVE_STRATEGY: string = BASE_URL + 'save-strategy'
const URL_DELETE_STRATEGY: string = BASE_URL + 'delete-strategy'
const URL_UPDATE_STRATEGY_REPORTS: string = BASE_URL + 'update-strategy-reports'
const URL_AUTHENTICATE: string = BASE_URL + 'authenticate'

const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${storage.getItem('session', 'access_token')}`
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

/**
 * status = null means status was not received so it must be info notification created only when fetching 
 */
const showNotification = (status: number, message: {success?: string, error?: string, info?: string}): any => {
  if(!status)
    return actions.addNotification(new Notification('info', message.info))
  if(status === 200)
    return actions.addNotification(new Notification('success', message.success))
  return actions.addNotification(new Notification('error', message.error))
}


export let getStock = (interval: string, symbol: string) : Promise<[]> => {
  const fetchingNotification = actions.addNotification(new Notification('info', "Fetching stock data...", true))
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
        actions.removeNotification(fetchingNotification.id)
        showNotification(response.status, {success: 'Stock fetched', error: 'Stock could not be fetched'})
        for(const o of data)
          o.date = new Date(o.date)
        resolve(data)        
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STOCK} thrown error: ` + err))
      actions.removeNotification(fetchingNotification.id)
      resolve(null)
    })
  })
}

export let getStrategyReports = () : Promise<StrategyReport[]> => {
  const fetchingNotification = actions.addNotification(new Notification('info', "Fetching strategy reports...", true))
  return new Promise(async (resolve) => {
    return fetch(URL_GET_STRATEGY_REPORTS, {
      method: 'GET',
      headers: getHeaders()
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {        
        console.log(colors.green(`Fetch ${URL_GET_STRATEGY_REPORTS} done.`))
        const data: StrategyReport[] = response.data ?? []
        actions.removeNotification(fetchingNotification.id)
        showNotification(response.status, { success: 'Strategy reports fetched', error: 'Strategy reports could not be fetched' })
        resolve(data)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STRATEGY_REPORTS} thrown error: ` + err))
      actions.removeNotification(fetchingNotification.id)
      actions.addNotification(new Notification('error', 'Strategy reports could not be fetched!'))
      resolve([])
    })
  })
}

export let getStrategies = () : Promise<Strategy[]> => {
  const fetchingNotification = actions.addNotification(new Notification('info', "Fetching strategies...", true))
  return new Promise(async (resolve) => {
    return fetch(URL_GET_STRATEGIES, {
      method: 'GET',
      headers: getHeaders()
    })
    .then(response => {    
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Fetch ${URL_GET_STRATEGIES} done.`))
        const data: Strategy[]  = response.data ?? []
        actions.removeNotification(fetchingNotification.id)
        showNotification(response.status, { success: 'Strategies fetched', error: 'Strategies could not be fetched' })
        resolve(data)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Fetch ${URL_GET_STRATEGIES} thrown error: ` + err))
      actions.removeNotification(fetchingNotification.id)
      actions.addNotification(new Notification('error', 'Strategies could not be fetched!'))
      resolve([])
    })
  })
}

// HANDLE RESPONSE PROPERLY
// HANDLE RESPONSE PROPERLY
// HANDLE RESPONSE PROPERLY
export let saveStrategy = (strategy: Strategy) : Promise<boolean> => {
  const fetchingNotification = actions.addNotification(new Notification('info', "Saving strategy...", true))
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
        actions.removeNotification(fetchingNotification.id)
        showNotification(response.status, { success: 'Strategy saved', error: 'Strategy could not be saved' })
        resolve(data)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Saving strategy over ${URL_SAVE_STRATEGY} thrown error: ` + err))
      actions.removeNotification(fetchingNotification.id)
      actions.addNotification(new Notification('error', `Strategy "${strategy.name}" could not be saved.`))
      resolve(false)
    })
  })
}


export let deleteStrategy = (name: string) : Promise<boolean> => {
  const fetchingNotification = actions.addNotification(new Notification('info', "Deleting strategy...", true))
  return new Promise(async (resolve) => {
    return fetch(URL_DELETE_STRATEGY, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({name: name})
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Fetch ${URL_GET_STRATEGIES} done.`))
        const isDeleted: boolean = response.status === 200 ?? false
        actions.removeNotification(fetchingNotification.id)
        showNotification(response.status, { success: 'Strategy deleted', error: 'Strategy could not be deleted' })
        resolve(isDeleted)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Deleting strategy ${name} over ${URL_DELETE_STRATEGY} thrown error: ` + err))
      actions.removeNotification(fetchingNotification.id)
      actions.addNotification(new Notification('error', `Strategy "${name}" could not be deleted!`))
      resolve(false)
    })
  })
}



export let regenerateStrategyReports = () : Promise<StrategyReport[]> => {
  const fetchingNotification = actions.addNotification(new Notification('info', "Regenerating strategy reports...", true))
  return new Promise(async (resolve) => {
    return fetch(URL_UPDATE_STRATEGY_REPORTS, {
      method: 'POST',
      headers: getHeaders()
    })
    .then(response => {
      response.json().then((response: ServiceResponse) => {
        console.log(colors.green(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} done.`))
        const data: StrategyReport[] = response.data ?? []
        actions.removeNotification(fetchingNotification.id)
        showNotification(response.status, { success: 'Strategy reports regenerated', error: 'Strategy reports could not be regenerated' })
        resolve(data)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Update and Fetch ${URL_UPDATE_STRATEGY_REPORTS} thrown error: ` + err))
      actions.removeNotification(fetchingNotification.id)
      actions.addNotification(new Notification('error', 'Strategy reports could not be regenerated!'))
      resolve([])
    })
  })
}




// Authenticates user credentials and saves received jwt access token in local storage for future service calls
export let authenticateCredentials = (credentials: UserCredentials) : Promise<string> => {
  const fetchingNotification = actions.addNotification(new Notification('info', "Authentication started...", true))
  return new Promise(async (resolve) => {
    return fetch(URL_AUTHENTICATE, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    })
    .then(response => {
      response.json().then((response: ServiceResponse)=> {
        actions.removeNotification(fetchingNotification.id)
        showNotification(response.status, { success: `User ${credentials.username} authenticated.`, error: `User ${credentials.username} could not be authenticated.` })
        const token: string = response.data
        resolve(token)
      })
    })
    .catch((err) => {
      console.log(colors.red(`Authenticating over ${URL_AUTHENTICATE} thrown error:` + err))
      actions.removeNotification(fetchingNotification.id)
      actions.addNotification(new Notification('error', `User could not be authenticated!`))
      resolve(null)
    })
  })
}