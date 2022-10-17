import { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import "apercu-font";

import { format } from "d3-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import { BarSeries,	CandlestickSeries, LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { CrossHairCursor} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import { Annotate, LabelAnnotation } from "react-stockcharts/lib/annotation";
import { VerticalSlice } from "../models/vertical-slice";
import { Strategy } from "../models/strategy";
import { BacktestResult } from "../models/backtest-result";
import { number } from "prop-types";
import { LineType } from "../types/line-type";
import ReactApexChart from "react-apexcharts"

type PropsType = {
  selectedStrategy: Strategy,
	selectedBacktestResult: BacktestResult,
  type: string,
  width: number,
	height: number,
  ratio: number,
  mouseMoveEnabled: boolean,
  panEnabled: boolean,
  zoomEnabled: boolean,
  clamp: boolean,
  data: any
}
/*
[{
				data: [{
					x: '',
					y: 1,
					fillColor: '#00FF00'
*/
type BarChartDataType = [{data: {x: string, y: number, fillColor: string}[]}]

type StateType = {
	indicatorsActive: boolean,
	selectedBacktestResultId: number,
	barChartData: BarChartDataType,
	options: any
}

class Graph extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
		this.setPageScroll = this.setPageScroll.bind(this)
		this.tradeLineValue = this.tradeLineValue.bind(this)
		this.dataPointSelection = this.dataPointSelection.bind(this)
		this.state = ({
			indicatorsActive: false, 
			selectedBacktestResultId: 0, 
			barChartData: [{data: [{x: '', y: 1, fillColor: 'rgb(26, 32, 39)'}]}],
			options: {
				plotOptions: {
					bar: {
						columnWidth: '98%',
						dataLabels: {
							maxItems: 0
						}
					}
				},
				chart: {
					events: {
						dataPointSelection: this.dataPointSelection
					}
				}
			}
		})
  }

	componentDidUpdate(prevProps) {
		if (prevProps.selectedBacktestResult !== this.props.selectedBacktestResult) {
			this.setState({
				barChartData: [{
					data: this.props.selectedBacktestResult.tradeDateAndValues.map(trade => { 
						return { 
							x: '', 
							y: 1, 
							fillColor: trade.profitHitDate ? '#00FF00' : '#FF0000'
						}
					})
				}]
			})
		}
	}

	setPageScroll(enabled: boolean) {
		document.querySelector('html').style.overflow = (enabled) ? 'visible' : 'hidden'
	}

	tradeLineValue(vs: VerticalSlice, lineType: LineType): number {
		let val: number = 0
		this.props.selectedBacktestResult?.tradeDateAndValues?.every(trade => {
			const tradeEndDate = new Date(trade.profitHitDate || trade.stopLossHitDate)
			// console.log(vs.date + ' >= ' + new Date(trade.enterDate)) 				//?? 2022-04-13T13:30:00.000Z
			//if([13, 14].includes(vs.date.getDate()) && [13, 14].includes(new Date(trade.enterDate).getDate()) && [3, 4].includes(vs.date.getMonth()) && [3, 4].includes(new Date(trade.enterDate).getMonth()))
			//	console.log(vs.date + ' >= ' + new Date(trade.enterDate) + ' ' + (vs.date >= new Date(trade.enterDate)))
			if(vs.date >= new Date(trade.enterDate) && vs.date <= tradeEndDate){
				if(lineType === LineType.ENTER) val = trade.enterValue
				else if(lineType === LineType.PROFIT) val = trade.profitValue
				else if(lineType === LineType.STOP_LOSS) val = trade.stopLossValue
				return false
			}
			return true			
		});
		return val
	}

	dataPointSelection(e: any, chart: any, options: any) { // { seriesIndex, dataPointIndex, config
		this.setState({selectedBacktestResultId: options?.dataPointIndex})
	}

  render() {
    const { type, width, ratio } = this.props;
		const { mouseMoveEnabled, panEnabled, zoomEnabled } = this.props;
		const { clamp } = this.props;

		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = discontinuousTimeScaleProvider.inputDateAccessor((d: VerticalSlice) => d.date)(this.props.data);

		// xAccessor returns index of given verticalSlice
		// use this.state.selectedBacktestResultId to find vertical sliceslice
		const selectedTrade = this.props.selectedBacktestResult?.tradeDateAndValues[this.state.selectedBacktestResultId]
		//const vertSliceToFocusId: number = this.props.data.map((vs, i) => { return {vs, i}}).filter(({vs, i}) => vs.date === selectedTrade?.enterDate)[0]?.i | 0
		const vertSliceToFocusId: number = this.props.data
		.map((vs, i) => { console.log('Index: ' + i); return {vs: vs, id: i}})
		.filter(({vs, id}) => {
			console.log(vs.date.getTime() + ' === ' + new Date(selectedTrade?.enterDate).getTime() + ' ' + (vs.date.getTime() === new Date(selectedTrade?.enterDate).getTime())); 
			return vs.date.getTime() === new Date(selectedTrade?.enterDate).getTime()
		})[0]?.id || 0

		console.log(selectedTrade)
		console.log(vertSliceToFocusId)
		//const focusedSliceId = 10
		const start = xAccessor(data[Math.max(vertSliceToFocusId - 30, 0)]);
		const end = xAccessor(data[Math.min(vertSliceToFocusId + 30, data.length - 1)]);
		const xExtents = [start, end];
		console.log(start + ' ' + end + ' ' + data.length)


		const margin = { left: 70, right: 70, top: 10, bottom: 30 };

		const height = this.props.height;

		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const yGrid = { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 }
		const xGrid = { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 }

		const { selectedBacktestResult: backtest } = this.props

		const profitEntryDates: Date[] = this.props.selectedBacktestResult?.tradeDateAndValues?.filter(trade => trade.profitHitDate).map(trade => new Date(trade.enterDate))
		const lossEntryDates: Date[] = this.props.selectedBacktestResult?.tradeDateAndValues?.filter(trade => trade.stopLossHitDate).map(trade => new Date(trade.enterDate))
    
    return (
			<div>
				{
					this.state.selectedBacktestResultId &&
					'selected: ' + this.state.selectedBacktestResultId
				}
				<h1 style={{fontSize: '16px', paddingLeft: margin.left / 2, paddingTop : margin.top, color: 'rgb(158, 158, 158)'}}>
				{	
					backtest &&
					backtest.stockName + ' - ' + backtest.interval + ' - ' + backtest.rewardToRisk  + ':1' 
				}
				</h1>
				<ReactApexChart options={this.state.options} series={this.state.barChartData} type="bar" height={150} width={'100%'}/>
				<div onMouseOver={() => this.setPageScroll(false)} onMouseOut={() => this.setPageScroll(true)}>
					<ChartCanvas
						height={height}
						ratio={ratio}
						width={width}
						margin={margin}
						mouseMoveEvent={mouseMoveEnabled}
						panEvent={panEnabled}
						zoomEvent={zoomEnabled}
						clamp={clamp}
						type={type}
						data={data}
						xScale={xScale}
						xExtents={xExtents}
						xAccessor={xAccessor}
						displayXAccessor={displayXAccessor}
					>
							<Chart id={1} yExtents={(d: VerticalSlice) => [d.high, d.low]}>
								{/* Date axis */}
								<XAxis axisAt="bottom"
									orient="bottom"
									zoomEnabled={zoomEnabled}
									{...xGrid} />
								{/* price axis */}
								<YAxis axisAt="right"
									orient="right"
									ticks={5}
									zoomEnabled={zoomEnabled}
									{...yGrid}
								/>
								{/* Candles */}
								<CandlestickSeries />
								{/* Top left attributes */}
								<OHLCTooltip origin={[-40, 0]}/>
								{/* Anotations for enter date of won/lost trades */} 
								{
									profitEntryDates &&
									<Annotate with={LabelAnnotation} 
										when={(d: VerticalSlice) => profitEntryDates.some((date: Date) => date.getTime() === d.date.getTime())} 
										usingProps={{
											fontSize: 14,
											opacity: 1,
											text: "🔼",
											y: ({ yScale }) => yScale.range()[0],
										}}/>
								}
								{
									lossEntryDates &&
									<Annotate with={LabelAnnotation} 
										when={(d: VerticalSlice) => lossEntryDates.some((date: Date) => date.getTime() === d.date.getTime())} 
										usingProps={{
											fontSize: 14,
											opacity: 1,
											text: "🔺",
											y: ({ yScale }) => yScale.range()[0],
										}}/>
								}
								{/* enter line */}
							<LineSeries
								yAccessor={(d: VerticalSlice) => this.tradeLineValue(d, LineType.ENTER)}
								defined={(id: number) => id !== 0}
								strokeOpacity={1}
								stroke="white"
								/>
								{/* take profit line */}
							<LineSeries
								yAccessor={(d: VerticalSlice) => this.tradeLineValue(d, LineType.PROFIT)}
								defined={(id: number) => id !== 0}
								strokeOpacity={1}
								stroke="green"
								/>
								{/* stop loss line */}
							<LineSeries
								yAccessor={(d: VerticalSlice) => this.tradeLineValue(d, LineType.STOP_LOSS)}
								defined={(id: number) => id !== 0}
								strokeOpacity={1}
								stroke="red"
								/>

						</Chart>

						{/* Volume */}
						{
						this.state.indicatorsActive &&
						<Chart id={2} yExtents={(d: VerticalSlice) => d.volume} height={70} origin={(w: number, h: number) => [0, h - 70]}>
							{/* volume axis */}
							<YAxis
								axisAt="left"
								orient="left"
								ticks={5}
								tickFormat={format(".2s")}
								zoomEnabled={zoomEnabled}
								/>
							{/* volume candles */}
							<BarSeries yAccessor={(d: VerticalSlice) => d.volume} fill={(d: VerticalSlice) => d.close > d.open ? "#6BA583" : "#FF0000"} />	
						</Chart>
						}


						<CrossHairCursor />
					</ChartCanvas>
				</div>
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy,
		selectedBacktestResult: state.selectedBacktestResult,
		type: "svg",
		mouseMoveEnabled: true,
		panEnabled: true,
		zoomEnabled: true,
		clamp: false,
  	ratio: 1,
		data: state.selectedStockVerticalSlices
  };
};

export default connect(mapStateToProps)(Graph);
