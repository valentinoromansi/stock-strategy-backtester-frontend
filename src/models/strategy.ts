import { ValueExtractionRule } from "./value-extraction-rule"
import { ConditionalRule } from "./conditional-rule"

/**
 * Strategy defines rules for:
 *    1. strategy validity - @strategyConRules
 *    2. entering trade - @enterValueExRule
 *    3. exiting trade  - trade can exit when 'take profit' value is hit or when 'stop loss' is hit
 *      - 'take profit' value is calculated using @enterValueExRule , @stopLossValueExRule and @riskToRewardList (enter + (enter - stopLoss) * riskToReward )
 *      - 'stop loss' - @stopLossValueExRule
 * @strategyConRules    - list of rules between 2 slices that must be respected for strategy to be valid
 * @enterValueExRule    - rule for extracting value on which trade should be entered(when stock price goes over/below it), slice id must be known in advance
 * @stopLossValueExRule - rule for extracting value on which on which hit loss is hit(when stock price goes over/below it)
 * @riskToRewardList    - list of risk to reward values that determines what will be the values of stop loss and exit
 */
export class Strategy {
  name: string
  strategyConRules: ConditionalRule[]
  enterValueExRule: ValueExtractionRule
  stopLossValueExRule: ValueExtractionRule
  riskToRewardList: number[]

  constructor(init?: Partial<Strategy>) {
    Object.assign(this, init)
  }

  static copy(strategy: Strategy): Strategy {
    return new Strategy({
      name: strategy.name,
      enterValueExRule: strategy.enterValueExRule ? ValueExtractionRule.copy(strategy.enterValueExRule) : null,
      stopLossValueExRule: strategy.stopLossValueExRule ? ValueExtractionRule.copy(strategy.stopLossValueExRule) : null,
      riskToRewardList: strategy.riskToRewardList,
      strategyConRules: strategy.strategyConRules
        ? strategy.strategyConRules.map((rule) => ConditionalRule.copy(rule))
        : null,
    })
  }

  description(): string {
    return `enter: ${this.enterValueExRule?.description()}\n 
            stop loss: ${this.stopLossValueExRule?.description()}\n 
            rules: ${this.strategyConRules?.map((rule) => "\n\t" + rule.description())}\n`
  }
}
