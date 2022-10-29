import React, { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import "apercu-font";
import { Strategy } from "models/strategy";
import { TradeResult } from "types/trade-result";
import { BacktestResult, TradeDateAndValues } from "models/backtest-result";
import * as actions from "../state/actions";



type PropsType = {
	selectedBacktestResult: BacktestResult
}


type StateType = {
	selectedBacktestResult: BacktestResult
}

class StrategyTradesBars extends Component<PropsType, StateType> {
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

	divRef: any

  constructor(props: PropsType) {
    super(props);
		this.divRef = React.createRef()
		this.handleMouseClick = this.handleMouseClick.bind(this)
		this.state = { selectedBacktestResult: props.selectedBacktestResult }
  }

	componentDidUpdate(prevProps: PropsType) {
		if(prevProps.selectedBacktestResult !== this.props.selectedBacktestResult) {
			this.setState({selectedBacktestResult: this.props.selectedBacktestResult});
		}
	}

	/**
	 * localMouseX - mouse x cordinate in px inside element
	 * mouseXPercentFrac -  mouse x cordinate in %fraction between element starting x position and element ending x position
	 */
	handleMouseClick(e: any) {
		const localMouseX = e.clientX - e.target.offsetLeft 
		const mouseXPercentFrac = localMouseX / this.divRef.current.offsetWidth
		const barWidthPercentFrac = 1 / this.state.selectedBacktestResult.tradeDateAndValues?.length
		const selectedBarIndex = Math.floor((mouseXPercentFrac / barWidthPercentFrac))
		actions.setSelectedTrade(this.state.selectedBacktestResult.tradeDateAndValues[selectedBarIndex])
	}
	
	getBarChartFillColor(tradeDateAndValues: TradeDateAndValues): string {
		if(tradeDateAndValues.tradeResult === TradeResult.PROFIT)
			return this.profitColor
		else if(tradeDateAndValues.tradeResult === TradeResult.LOSS)
			return this.lossColor
		return this.indecisiveColor
	}

	/**
	 * return css property list of linear-gradient properties each consisting of 50 colors so blur can be avoided
	 */
	getLinearGradient(tradeDateAndValues: TradeDateAndValues[]) {
		if(!tradeDateAndValues)
			return ''
		// Separate list into list of list with max 50 members
		const chunkedTradeResultTypes: TradeDateAndValues[][] = []
		const chunkSize = 50
		for (let i = 0; i < tradeDateAndValues.length; i += chunkSize) {
			chunkedTradeResultTypes.push(tradeDateAndValues.slice(i, i + chunkSize))
		}
		
		// Construct linear-gradient property string 
		const barWidthPercent = 100 / tradeDateAndValues.length
		let fromPercent = 0
		let toPercent = barWidthPercent
		const linearGradient50Max = (tradeResultTypes: TradeDateAndValues[]): string => {
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
		const linearGradientProperty = this.getLinearGradient(this.state.selectedBacktestResult?.tradeDateAndValues)

    return (
			<div>
				<div
					ref={this.divRef} 
					onMouseDown={this.handleMouseClick}
					style={{
						width: '100%', 
						height: '20px', 
						background: linearGradientProperty
					}}
					>
				</div>
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
		selectedBacktestResult: state.selectedBacktestResult
  };
};

export default connect(mapStateToProps)(StrategyTradesBars);
