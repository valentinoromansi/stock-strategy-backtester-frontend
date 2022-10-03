import { BacktestResult } from "./backtest-result"


export class StrategyReport {
  constructor(init?: Partial<StrategyReport>) {
    Object.assign(this, init)
  }
  strategyName: string = ''
  backtestResults: BacktestResult[] = []
}
