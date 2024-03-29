import React, { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";
import { TradeResult } from "types/trade-result";
import { BacktestResult, TradeDateAndValues } from "models/backtest-result";
import * as actions from "../../state/actions";
import Box from "@mui/material/Box/Box";



type PropsType = {
	selectedBacktestResult: BacktestResult
}
type StateType = {
	linearGradientBase: string,
	linearGradientHiglight: string
}

class StrategyTradesBars extends Component<PropsType, StateType> {
	readonly profitColor: string = '#02de02'
	readonly lossColor: string = '#e60000'
	readonly indecisiveColor: string = '#2e2e2e'
	readonly profitHighlightColor: string = '#00ff00'
	readonly lossHighlightColor: string = '#ff0000'
	readonly indecisiveHighlightColor: string = '#3e3e3e'

	divRef: any

  constructor(props: PropsType) {
    super(props);
		this.divRef = React.createRef()
		this.handleMouseClick = this.handleMouseClick.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.resetBarHighlight = this.resetBarHighlight.bind(this)
		this.state = { 
			linearGradientBase: '',
			linearGradientHiglight: 'linear-gradient(90deg, transparent 0%, transparent 100%)'
		}
  }

  componentDidMount(): void {
	  this.setState({linearGradientBase: this.getLinearGradientBase(this.props.selectedBacktestResult.tradeDateAndValues)});
  }

	componentDidUpdate(prevProps: PropsType) {
		if(prevProps.selectedBacktestResult !== this.props.selectedBacktestResult) {
			this.setState({linearGradientBase: this.getLinearGradientBase(this.props.selectedBacktestResult.tradeDateAndValues)});
			this.resetBarHighlight()
		}
	}

	resetBarHighlight() {
		this.setState({linearGradientHiglight: 'linear-gradient(90deg, transparent 0%, transparent 100%)'});
	}


	getBarHoverData(e: any): { localMouseX: number, mouseXPercentFrac: number, barWidthPercentFrac: number, hoveredBarIndex: number } {
		const localMouseX = e.clientX - e.target.offsetLeft 
		const mouseXPercentFrac = localMouseX / this.divRef.current.offsetWidth
		const barWidthPercentFrac = 1 / this.props.selectedBacktestResult.tradeDateAndValues?.length
		const hoveredBarIndex = Math.floor((mouseXPercentFrac / barWidthPercentFrac))
		return {
			localMouseX: localMouseX,
			mouseXPercentFrac: mouseXPercentFrac,
			barWidthPercentFrac: barWidthPercentFrac,
			hoveredBarIndex: hoveredBarIndex
		}
	}

	/**
	 * localMouseX - mouse x cordinate in px inside element
	 * mouseXPercentFrac -  mouse x cordinate in %fraction between element starting x position and element ending x position
	 */
	handleMouseClick(e: any) {
		const { hoveredBarIndex } = this.getBarHoverData(e)
		actions.setSelectedTrade(this.props.selectedBacktestResult.tradeDateAndValues[hoveredBarIndex])
	}

	// linear-gradient(90deg, transparent 93.9086%, blue 93.9086%, blue 94.4162%, transparent  94.4162%),
	handleMouseMove(e: any) {
		const { barWidthPercentFrac, hoveredBarIndex } = this.getBarHoverData(e)

		const startBarPosPercent = (barWidthPercentFrac * 100) * hoveredBarIndex
		const endBarPosPercent = (barWidthPercentFrac * 100) * (hoveredBarIndex + 1) 
		const highlightColor = this.getBarHighlightColor(this.props.selectedBacktestResult.tradeDateAndValues[hoveredBarIndex])

		const linearGradientHiglight = `linear-gradient(
			90deg, 
			transparent ${startBarPosPercent}%, 
			${highlightColor} ${startBarPosPercent}%,
			${highlightColor} ${endBarPosPercent}%, 
			transparent  ${endBarPosPercent}%
		)`
		this.setState({linearGradientHiglight: linearGradientHiglight})
	}

	getBarHighlightColor(trade: TradeDateAndValues) {
    if(trade?.tradeResult === TradeResult.PROFIT)
			return this.profitHighlightColor
		else if(trade?.tradeResult === TradeResult.LOSS)
			return this.lossHighlightColor
		return this.indecisiveHighlightColor
	}
	
	getBarChartFillColor(tradeDateAndValues: TradeDateAndValues): string {
		if(tradeDateAndValues?.tradeResult === TradeResult.PROFIT)
			return this.profitColor
		else if(tradeDateAndValues?.tradeResult === TradeResult.LOSS)
			return this.lossColor
		return this.indecisiveColor
	}

	// linear-gradient(90deg, transparent 93.9086%, blue 93.9086%, blue 94.4162%, transparent  94.4162%),
	/**
	 * return css property list of linear-gradient properties each consisting of 50 colors so blur can be avoided
	 */
	getLinearGradientBase(tradeDateAndValues: TradeDateAndValues[]) {
		if(!tradeDateAndValues)
			return ''
		// Separate list into list of list with max 50 members - this is a hack since without separation it can't be sharply rendered
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
					if(fromPercent !== 0 || currIndex !== 0){
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
		const linearGradientProperty = this.state.linearGradientHiglight + ', ' + this.state.linearGradientBase

    return (
				<Box
					ref={this.divRef}
					onMouseLeave={this.resetBarHighlight}
					onMouseMove={this.handleMouseMove}
					onMouseDown={this.handleMouseClick}
					style={{
						width: '100%', 
						height: '20px', 
						background: linearGradientProperty
					}}
					>
				</Box>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
		selectedBacktestResult: state.selectedBacktestResult
  };
};

export default connect(mapStateToProps)(StrategyTradesBars);
