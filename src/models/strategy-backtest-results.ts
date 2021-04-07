import { BacktestResult } from "./backtest-result"


export class StrategyBacktestResults {
  constructor(init?: Partial<StrategyBacktestResults>) {
    Object.assign(this, init)
  }
  strategyName: string = ''
  backtestResults: BacktestResult[] = []
}
