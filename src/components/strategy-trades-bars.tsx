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


  render() {
		
		const tradeResultTypes = Array(80)
		for (let i = 0; i < tradeResultTypes.length; i++) {
			tradeResultTypes[i] = TradeResult.PROFIT
		}
		tradeResultTypes[25] = TradeResult.LOSS
		
		console.log(tradeResultTypes)
		const barWidthPercent = 100 / tradeResultTypes.length

		console.log(barWidthPercent)

		//'linear-gradient(90deg, red 0.12%, red 0.12%, green 0.12%, green 20%, red 20%, green 30%, red 30%)'
		//let background = 'linear-gradient(90deg'
		const backgroundValue: string = tradeResultTypes.reduce(
			(prev, curr, currIndex) => {
				const fromPercent = barWidthPercent * currIndex
				const toPercent =  barWidthPercent * (currIndex + 1)
				const color = this.getBarChartFillColor(curr)
				return prev + `, ${color} ${fromPercent}%, ${color} ${toPercent}%`
			},
			'linear-gradient(90deg'
		) + ')'

		console.log(backgroundValue)


    return (
			<div>
				<div style={{
					width: '100%', 
					height: '20px', 
					background: `linear-gradient(90deg,
						lime 0%, lime 1%, 
						red 1%, red 2%, 
						lime 2%, lime 3%, 
						red 3%, red 4%, 
						lime 4%, lime 5%, 
						red 5%, red 6%, 
						lime 6%, lime 7%, 
						red 7%, red 8%, 
						lime 8%, lime 9%, 
						red 9%, red 10%, 
						lime 10%, lime 11%,
						red 11%, red 12%, 
						lime 12%, lime 13%, 
						red 13%, red 14%, 
						lime 14%, lime 15%, 
						red 15%, red 16%, 
						lime 16%, lime 17%, 
						red 17%, red 18%, 
						lime 18%, lime 19%, 
						red 19%, red 20%, 
						lime 20%, lime 21%, 
						red 21%, red 22%, 
						lime 22%, lime 23%, 
						red 23%, red 24%, 
						lime 24%, lime 25%, 
						red 25%, red 26%, 
						lime 26%, lime 27%, 
						red 27%, red 28%, 
						lime 28%, lime 29%, 
						red 29%, red 30%,
						transparent 30%, transparent 100%
						),
						linear-gradient(90deg,
						lime 30%, lime 31%, 
						red 31%, red 32%, 
						lime 32%, lime 33%, 
						red 33%, red 34%, 
						lime 34%, lime 35%, 
						red 35%, red 36%, 
						lime 36%, lime 37%, 
						red 37%, red 38%, 
						lime 38%, lime 39%, 
						red 39%, red 40%, 
						lime 40%, lime 41%, 
						red 41%, red 42%, 
						lime 42%, lime 43%, 
						red 43%, red 44%, 
						lime 44%, lime 45%, 
						red 45%, red 46%, 
						lime 46%, lime 47%, 
						red 47%, red 48%, 
						lime 48%, lime 49%, 
						red 49%, red 50%, 
						lime 50%, lime 51%,
						red 51%, red 52%, 
						lime 52%, lime 53%, 
						red 53%, red 54%, 
						lime 54%, lime 55%, 
						red 55%, red 56%, 
						lime 56%, lime 57%, 
						red 57%, red 58%, 
						lime 58%, lime 59%, 
						red 59%, red 60%, 
						lime 60%, lime 61%, 
						red 61%, red 62%, 
						lime 62%, lime 63%, 
						red 63%, red 64%,
						red 64%, red 65%, 
						lime 65%, lime 66%, 
						red 66%, red 67%, 
						lime 67%, lime 68%, 
						red 68%, red 69%, 
						lime 69%, lime 70%,
						transparent 70%, transparent 100%
						)`
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
