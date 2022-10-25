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
import { Annotate, LabelAnnotation } from "react-stockcharts/lib/annotation";
import { VerticalSlice } from "../models/vertical-slice";
import { Strategy } from "../models/strategy";
import { BacktestResult, TradeDateAndValues } from "../models/backtest-result";
import { LineType } from "../types/line-type";
import ReactApexChart from "react-apexcharts"

import styles from '../styles/global.module.sass'


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

type BarChartDataType = [{data: {x: string, y: number, fillColor: string}[]}]

type StateType = {
	indicatorsActive: boolean,
	selectedBacktestResultId: number,
	barChartData: BarChartDataType,
	options: any
}

class Graph extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'
	readonly barChartInitFill: string = 'rgb(26, 32, 39)'

  constructor(props: PropsType) {
    super(props);
		this.setPageScroll = this.setPageScroll.bind(this)
		this.tradeLineValue = this.tradeLineValue.bind(this)
		this.dataPointSelection = this.dataPointSelection.bind(this)
		this.state = ({
			indicatorsActive: false, 
			selectedBacktestResultId: 0, 
			barChartData: [{data: [{x: '', y: 1, fillColor: this.barChartInitFill}]}],
			options: {
				plotOptions: {
					bar: {
						columnWidth: '99%'
					}
				},
				chart: {
					parentHeightOffset: 0,
					events: {
						dataPointSelection: this.dataPointSelection
					}
				},
				tooltip: {
					enabled: false
				},
				xaxis: {					
					floating: true
				},
				yaxis: {					
					show: false,
				},
				grid: {
					padding: {
						top: 0,
						right: 0,
						bottom: 0,
						left: 0
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
							fillColor: this.getBarChartFillColor(trade)
						}
					})
				}]
			})
		}
	}
	
	getBarChartFillColor(trade: TradeDateAndValues): string {
		if(!trade.profitHitDate && !trade.stopLossHitDate)
			return this.indecisiveColor
		return trade.profitHitDate ? this.profitColor : this.lossColor
	}

	setPageScroll(enabled: boolean) {
		document.querySelector('html').style.overflow = (enabled) ? 'visible' : 'hidden'
	}

	tradeLineValue(vs: VerticalSlice, lineType: LineType): number {
		let val: number = 0
		this.props.selectedBacktestResult?.tradeDateAndValues?.every(trade => {
			const tradeEndDate = new Date(trade.profitHitDate || trade.stopLossHitDate)
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
		const { tradeDateAndValues, stockName, interval, rewardToRisk } = this.props?.selectedBacktestResult || { tradeDateAndValues: [] }
		const { type, width, ratio, mouseMoveEnabled, panEnabled, zoomEnabled, clamp, height } = this.props;

		// ChartCanvas component breaks when data consits of less then 
		const dataForRender = 
			this.props.data?.length >= 2 ? 
			this.props.data :
			new Array(2).fill({date: new Date(), "open": 0, "high": 0, "low": 0, "close": 0, "volume": 0})
			
		
		// returned 'data' is same as 'this.props.data' but has addtional 'idx' property that is used when rendering
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = discontinuousTimeScaleProvider.inputDateAccessor((d: VerticalSlice) => d.date)(dataForRender);
		
		// xExtents - slices between start and end will be rendered, xAccessor returns index of given verticalSlice
		const selectedTrade = tradeDateAndValues[this.state.selectedBacktestResultId]
		const sliceToFocusId: number = data.findIndex(slice => slice.date.getTime() === new Date(selectedTrade?.enterDate).getTime()) || 0
		const start = xAccessor(data[Math.max(sliceToFocusId - 30, 0)]);
		const end = xAccessor(data[Math.min(sliceToFocusId + 30, data.length - 1)]);
		const xExtents = [start, end];

		const yGrid = { innerTickSize: -1 * width, tickStrokeOpacity: 0.1 }
		const xGrid = { innerTickSize: -1 * height, tickStrokeOpacity: 0.1 }

		const profitEntryDates: Date[] = tradeDateAndValues?.filter(trade => trade.profitHitDate).map(trade => new Date(trade.enterDate))
		const lossEntryDates: Date[] = tradeDateAndValues?.filter(trade => trade.stopLossHitDate).map(trade => new Date(trade.enterDate))

		// 0-200 trades will be scaled and displayed as 10%-100% width - Values over 200 are clamped at 100%
		const [maxTradeNumBeforeClamp, minWidth, maxWidth] = [200, 10, 100]
		const percentFraction = Math.min(tradeDateAndValues.length / maxTradeNumBeforeClamp, 1)
		const tradeBarsWidth =  minWidth + ((maxWidth - minWidth) * percentFraction) + '%'

		const contentVisible = this.props.data?.length > 1
		// Set max-height to unreachable 101vh(hack for height transition effect for parent element of unknown height - depends on child elements)
		const wrapperMaxHeight = contentVisible ? '101vh' : 0
		const wrapperPadding = contentVisible ? '1.6rem' : 0

    return (
			<div className={styles.graphStyle} style={{padding: wrapperPadding, maxHeight: wrapperMaxHeight}}>
				<div className={styles.graphSelectedReportText}>
					<h1>
					{	
						this.props.selectedBacktestResult &&
						stockName + ' - ' + interval + ' - ' + rewardToRisk  + ':1' 
					}
					</h1>
				</div>
				{/* Bar chart */}
				<ReactApexChart options={this.state.options} series={this.state.barChartData} type="bar" width={tradeBarsWidth} height={45}/>
				{/* Stock graph */}
				<div onMouseOver={() => this.setPageScroll(false)} onMouseOut={() => this.setPageScroll(true)}>				
				{
					contentVisible &&				
					<ChartCanvas
						width={width}
						height={height}
						ratio={ratio}
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
											text: "▲",
											fill: this.profitColor,
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
											text: "▲",
											fill: this.lossColor,
											y: ({ yScale }) => yScale.range()[0],
										}}/>
								}
								{/* enter line */}
							<LineSeries
								yAccessor={(d: VerticalSlice) => this.tradeLineValue(d, LineType.ENTER)}
								defined={(id: number) => id !== 0}
								strokeOpacity={1}
								stroke={this.enterTradeColor}
								/>
								{/* take profit line */}
							<LineSeries
								yAccessor={(d: VerticalSlice) => this.tradeLineValue(d, LineType.PROFIT)}
								defined={(id: number) => id !== 0}
								strokeOpacity={1}
								stroke={this.profitColor}
								/>
								{/* stop loss line */}
							<LineSeries
								yAccessor={(d: VerticalSlice) => this.tradeLineValue(d, LineType.STOP_LOSS)}
								defined={(id: number) => id !== 0}
								strokeOpacity={1}
								stroke={this.lossColor}
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
							<BarSeries yAccessor={(d: VerticalSlice) => d.volume} fill={(d: VerticalSlice) => d.close > d.open ? this.profitColor : this.lossColor} />	
						</Chart>
						}
						<CrossHairCursor />
					</ChartCanvas>
				}
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
