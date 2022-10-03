import { AttributeType } from "../types/attribute-type"

/**
 * Represents rule to get value of vertical slice attribute with id relative to given slice
 * @param id - Tells to which vertical slice relative to given vertical slice does this rule for extracting value belongs to
 * @param type2 - null means that rule applies to value of type1
 * @param type2 - not null means that rule applies to value which is percentage between 2 slice attributes(type1, type2)
 * 1.) only type1: 
 *      - objects value is value of slice attribute[type1]
 * 2.) type1, type2, percent:
 *      - objects value is value of slice attributes[type1,type2] including percent
 * 
 * Example 1:
 *   RelativeAttributeData {
      id: 1
      type1: AttributeType.OPEN
      type2: null
      percent: null
      period: null
    }
  - Value = value of attribute='open' of slice moved from given slice by 1
* Example 2:
 *   RelativeAttributeData {
      id: 1
      type1: AttributeType.OPEN
      type2: AttributeType.CLOSE
      percent: 0.5
      period: null
    }
  - Value = value at 50% between attributes 'open' and 'close' of slice moved from given slice by 1
 * 
 */
export class ValueExtractionRule {
  id: number
  attribute1: AttributeType
  attribute2: AttributeType
  percent: number
  period: number // used only for indicators(EMA9 -> period = 9)

  constructor(init?: Partial<ValueExtractionRule>) {
    Object.assign(this, init)
  }

  static copy(rule: ValueExtractionRule): ValueExtractionRule {
    return new ValueExtractionRule({
      id: rule.id,
      attribute1: rule.attribute1,
      attribute2: rule.attribute2,
      percent: rule.percent,
      period: rule.period,
    })
  }

  description(): string {
    if (this.attribute1 && !this.attribute2 && !this.percent) return "slice[" + this.id + "]." + this.attribute1
    else if (this.attribute1 && this.attribute2 && this.percent)
      return "slice[" + this.id + "].(" + this.percent * 100 + "% of " + this.attribute1 + "-" + this.attribute2 + ")"
    else return "RelativeSliceValueExtractionRule description could not be described"
  }
}
