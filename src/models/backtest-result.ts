import { TradeResult } from "../types/trade-result"

interface TradeDateAndValues {
  tradeResult: TradeResult,
  enterDate: Date,
  enterValue: number,
  stopLossHitDate: Date,
  stopLossValue: number,
  profitHitDate: Date,
  profitValue: number
}

export class BacktestResult {
  constructor(init?: Partial<BacktestResult>) {
    Object.assign(this, init)
  }
  stockName: string = ''
  interval: string = ''
  entryDatesOfProfitTrades: Date[] = []
  entryDatesOfLossTrades: Date[] = []
  rewardToRisk: number = 0
  timesProfited: number = 0
  timesLost: number = 0
  timesIndecisive: number = 0
  winRate: number = 0
  plRatio: number = 0
  plFactor: number = 0
  tradeDateAndValues: TradeDateAndValues[] = []
}