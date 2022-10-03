import { ValueExtractionRule } from "./value-extraction-rule"
import { Position } from "../types/position"

/*
* Defines relation between attribute values from 2 different slices
* Example 1:
  {
	"relativeAttributeData1":
		"id": 0,
		"type1": AttributeType.CLOSE,
	"position": Position.BELOW,
	"relativeAttributeData2":
		"id": "2",
		"type2": "EMA9",
}
  - Rule checks if value CLOSE of slice moved by 0 from given slice is BELOW value of clice EMA9 moved by 2 from given slice
*/
export class ConditionalRule {
  valueExtractionRule1: ValueExtractionRule
  position: Position
  valueExtractionRule2: ValueExtractionRule

  constructor(init?: Partial<ConditionalRule>) {
    Object.assign(this, init)
  }

  static copy(strategyRule: ConditionalRule): ConditionalRule {
    return new ConditionalRule({
      valueExtractionRule1: ValueExtractionRule.copy(strategyRule.valueExtractionRule1),
      position: strategyRule.position,
      valueExtractionRule2: ValueExtractionRule.copy(strategyRule.valueExtractionRule2),
    })
  }

  description(): string {
    return `${this.valueExtractionRule1.description()} ${this.position} ${this.valueExtractionRule2.description()}`
  }
}
