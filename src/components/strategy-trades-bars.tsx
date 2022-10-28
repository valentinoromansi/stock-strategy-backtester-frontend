import { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import "apercu-font";
import { Strategy } from "models/strategy";
import { TradeResult } from "types/trade-result";


type PropsType = {
	tradeResultTypes: TradeResult[]
}


type StateType = {
}

class StrategyTradesBars extends Component<PropsType, StateType> {
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

  constructor(props: PropsType) {
    super(props);
  }
	
	getBarChartFillColor(tradeResult: TradeResult): string {
		if(tradeResult === TradeResult.PROFIT)
			return this.profitColor
		else if(tradeResult === TradeResult.LOSS)
			return this.lossColor
		return this.indecisiveColor
	}



	/**
	 * return css property list of linear-gradient properties each consisting of 50 colors so blur can be avoided
	 */
	getLinearGradient(tradeResultTypes: TradeResult[]) {		
		// Separate list into list of list with max 50 members
		const chunkedTradeResultTypes: TradeResult[][] = []
		const chunkSize = 50
		for (let i = 0; i < tradeResultTypes.length; i += chunkSize) {
			chunkedTradeResultTypes.push(tradeResultTypes.slice(i, i + chunkSize))
		}
		console.log('chunkedTradeResultTypes: ')
		console.log(chunkedTradeResultTypes)
		
		// Construct linear-gradient property string 
		const barWidthPercent = 100 / tradeResultTypes.length
		let fromPercent = 0
		let toPercent = barWidthPercent
		const linearGradient50Max = (tradeResultTypes: TradeResult[]): string => {
			return tradeResultTypes.reduce(
				(prev, curr, currIndex) => {
					const color = this.getBarChartFillColor(curr)
					if(fromPercent != 0 || currIndex != 0){
						fromPercent = toPercent
						toPercent += barWidthPercent
					}
					return prev + `, ${color} ${fromPercent}%, ${color} ${toPercent}%`
				},
				'linear-gradient(90deg'
			) + `, transparent ${toPercent}%, transparent 100%)`
		}
		let finalPropString = ''
		chunkedTradeResultTypes.forEach((item, i) => {
			finalPropString += linearGradient50Max(item)
			finalPropString += (i === (chunkedTradeResultTypes.length - 1)) ? '' : ', '
		});
		return finalPropString
	}


  render() {
		
		const tradeResultTypes = Array(250)
		for (let i = 0; i < tradeResultTypes.length; i++)	{		
			tradeResultTypes[i] = (i % 2 === 0) ? TradeResult.PROFIT : TradeResult.LOSS
			tradeResultTypes[i] = (i % 5 === 0) ? TradeResult.INDECISIVE : tradeResultTypes[i]
		}
		
		const linearGradientProperty = this.getLinearGradient(tradeResultTypes)
		console.log(linearGradientProperty)


    return (
			<div>
				<div style={{
					width: '100%', 
					height: '20px', 
					background: linearGradientProperty
					}}>
				</div>
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy
  };
};

export default connect(mapStateToProps)(StrategyTradesBars);
