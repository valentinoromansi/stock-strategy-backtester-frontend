
const URL_BACKTEST: string = 'http://localhost:4000/backtest'
const HEADERS: HeadersInit = {'Content-Type': 'application/json'}

export let getBacktestData = (strategy: any) : Promise<any> => {    
  return fetch(URL_BACKTEST, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(strategy)
  })
  .then(response => response.json())
  .catch((err) => console.log("ERRRRRRRRRRRRRRRRROR:" + err))
}