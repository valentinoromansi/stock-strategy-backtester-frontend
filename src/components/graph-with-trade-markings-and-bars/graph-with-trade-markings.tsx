import "apercu-font";
import React, { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';

import { Chart, ChartCanvas } from "react-stockcharts";
import { Annotate, LabelAnnotation } from "react-stockcharts/lib/annotation";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { CrossHairCursor } from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { CandlestickSeries, LineSeries } from "react-stockcharts/lib/series";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { BacktestResult, TradeDateAndValues } from "../../models/backtest-result";
import { Strategy } from "../../models/strategy";
import { VerticalSlice } from "../../models/vertical-slice";
import { LineType } from "../../types/line-type";

import { Box, Paper, Typography } from "@mui/material";
import { SpinnerComponent } from "react-element-spinner";
import StrategyTradesBars from "./strategy-trades-bars";

type PropsType = {
	selectedStrategy: Strategy,
	selectedBacktestResult: BacktestResult,
  width: number,
	height: number,
  data: any,
	stockVerticalSlicesFecthing: boolean,
	selectedTrade: TradeDateAndValues
}

type StateType = {
}

class GraphWithTradeMarkings extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'
	readonly barChartInitFill: string = 'rgb(26, 32, 39)'
	readonly candleNumToDisplay = 100

  constructor(props: PropsType) {
    super(props);
		this.setPageScroll = this.setPageScroll.bind(this)
		this.tradeLineEndYValue = this.tradeLineEndYValue.bind(this)
		this.TradeLines = this.TradeLines.bind(this)
  }

	
	getBarChartFillColor(trade: TradeDateAndValues): string {
		if(!trade.profitHitDate && !trade.stopLossHitDate)
			return this.indecisiveColor
		return trade.profitHitDate ? this.profitColor : this.lossColor
	}

	setPageScroll(enabled: boolean) {
		document.querySelector('html').style.overflow = (enabled) ? 'visible' : 'hidden'
	}

	// return Y value of a trade line depending on its type
	tradeLineEndYValue(vs: VerticalSlice, lineType: LineType): number {
		console.log(lineType)
		let val: number = 0
		this.props.selectedBacktestResult?.tradeDateAndValues?.every(trade => {
			const tradeEndDate = new Date(trade.profitHitDate || trade.stopLossHitDate)
			if(vs.date >= new Date(trade.enterDate) && vs.date <= tradeEndDate) {
				if(lineType === LineType.ENTER) val = trade.enterValue
				else if(lineType === LineType.PROFIT) val = trade.profitValue
				else if(lineType === LineType.STOP_LOSS) val = trade.stopLossValue
				return false
			}
			return true			
		});
		return val
	}

	TradeLines(props: { lineType: LineType, color: string }): any {
		return (
			<LineSeries yAccessor={(vs: VerticalSlice) => this.tradeLineEndYValue(vs, props.lineType)} defined={(id: number) => id !== 0} strokeOpacity={1} stroke={props.color}/>
		)
	}


	TradeAnnotations(props: { dates: Date[], color: string } ): any {
		return(
			<React.Fragment>
				{
					props.dates &&
					<Annotate with={LabelAnnotation} 
						when={(d: VerticalSlice) => props.dates.some((date: Date) => date.getTime() === d.date.getTime())} 
						usingProps={{ fontSize: 14,	opacity: 1,	text: "▲", fill: props.color,	y: ({ yScale }) => yScale.range()[0] }}/>
				}
			</React.Fragment>
		)
	}


  render() {
		const { tradeDateAndValues, stockName, interval, rewardToRisk } = this.props?.selectedBacktestResult || { tradeDateAndValues: [] }
		const { width, height } = this.props;

		// size limits - if size is to small react-stockcharts component throws error
		if(!width || !height || width < 50 || height < 50)
			return <React.Fragment/>

		// ChartCanvas component breaks when data consits of less then 
		const dataForRender = this.props.data?.length >= 2 ? this.props.data : new Array(2).fill({date: new Date(), "open": 0, "high": 0, "low": 0, "close": 0, "volume": 0})
		
		// returned 'data' is same as 'this.props.data' but has addtional 'idx' property that is used when rendering
		const { data,	xScale, xAccessor, displayXAccessor } = discontinuousTimeScaleProvider.inputDateAccessor((d: VerticalSlice) => d.date)(dataForRender);
		
		// xExtents - slices between start and end will be rendered, xAccessor returns index of given verticalSlice
		const sliceToFocusIndex: number = data.findIndex(slice => slice.date.getTime() === new Date(this.props.selectedTrade?.enterDate).getTime()) || 0
		const start = xAccessor(data[Math.max(sliceToFocusIndex - this.candleNumToDisplay / 2, 0)]);
		const end = xAccessor(data[Math.min(sliceToFocusIndex + this.candleNumToDisplay / 2, data.length - 1)]);
		const xExtents = [start, end];

		const yGrid = { innerTickSize: -1 * width, tickStrokeOpacity: 0.1 }
		const xGrid = { innerTickSize: -1 * height, tickStrokeOpacity: 0.1 }

		const profitEntryDates: Date[] = tradeDateAndValues?.filter(trade => trade.profitHitDate).map(trade => new Date(trade.enterDate))
		const lossEntryDates: Date[] = tradeDateAndValues?.filter(trade => trade.stopLossHitDate).map(trade => new Date(trade.enterDate))
		const indecisiveEntryDates: Date[] = tradeDateAndValues?.filter(trade => (!trade.profitHitDate && !trade.stopLossHitDate)).map(trade => new Date(trade.enterDate))

		const contentVisible = this.props.data?.length > 1

    return (
			<Paper sx={{ boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)", p: '12px', textAlign: 'left', display: 'flex', flexDirection:'column', gap: '12px' }}>   
				<SpinnerComponent loading={this.props.stockVerticalSlicesFecthing} position="centered" />
				<Typography fontSize='large'>
				{	
					this.props.selectedBacktestResult &&
					stockName + ' - ' + interval + ' - ' + rewardToRisk  + ':1' 
				}
				</Typography>
				{/* Strategy trades bar */}
				<StrategyTradesBars/>
				{/* Stock graph */}
				<Box onMouseOver={() => this.setPageScroll(false)} onMouseOut={() => this.setPageScroll(true)}>				
				{
					contentVisible &&				
					<ChartCanvas
						width={width}
						height={height}
						ratio={1}
						mouseMoveEvent={true}
						panEvent={true}
						zoomEvent={true}
						clamp={false}
						type='svg'
						data={data}
						xScale={xScale}
						xExtents={xExtents}
						xAccessor={xAccessor}
						displayXAccessor={displayXAccessor}
						seriesName= {"s"}
					>
							<Chart id={1} yExtents={(d: VerticalSlice) => [d.high, d.low]}>
								{/* Date axis */}
								<XAxis axisAt="bottom"
									orient="bottom"
									zoomEnabled={true}
									{...xGrid} />
								{/* price axis */}
								<YAxis axisAt="right"
									orient="right"
									ticks={5}
									zoomEnabled={true}
									{...yGrid}
								/>
								{/* Candles */}
								<CandlestickSeries />
								{/* Top left attributes */}
								<OHLCTooltip origin={[-40, 0]}/>
								{/* Anotations for enter date of won/lost trades */}
								<this.TradeAnnotations dates={profitEntryDates} color={this.profitColor} />
								<this.TradeAnnotations dates={lossEntryDates} color={this.lossColor} />
								<this.TradeAnnotations dates={indecisiveEntryDates} color={this.indecisiveColor} />								
								{/* enter trade, take profit, stop loss lines */}
								<this.TradeLines lineType={LineType.ENTER} color={this.enterTradeColor} />
								<this.TradeLines lineType={LineType.PROFIT} color={this.profitColor} />
								<this.TradeLines lineType={LineType.STOP_LOSS} color={this.lossColor} />
						</Chart>
						<CrossHairCursor />
					</ChartCanvas>
				}
				</Box>
			</Paper>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy,
		selectedBacktestResult: state.selectedBacktestResult,
		data: state.selectedStockVerticalSlices,
		stockVerticalSlicesFecthing: state.stockVerticalSlicesFecthing,
		selectedTrade: state.selectedTrade
  };
};

export default connect(mapStateToProps)(GraphWithTradeMarkings);
