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

type StateType = {
	indicatorsActive: boolean
}

class Graph extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
		this.state = ({indicatorsActive: false})
		this.setPageScroll = this.setPageScroll.bind(this)
		this.tradeLineValue = this.tradeLineValue.bind(this)
  }

	setPageScroll(enabled: boolean) {
		document.querySelector('html').style.overflow = (enabled) ? 'visible' : 'hidden'
	}

	tradeLineValue(vs: VerticalSlice): number {
		let val: number = 0
		this.props.selectedBacktestResult?.tradeDateAndValues?.every(trade => {
			const tradeEndDate = new Date(trade.profitHitDate || trade.stopLossHitDate)
			if(vs.date >= new Date(trade.enterDate) && vs.date <= tradeEndDate) { // wHY IS THER ENOT A SINGLE RESULT
				val = trade.enterValue
				return false
			}
			return true			
		});
		return val
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

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		const margin = { left: 70, right: 70, top: 10, bottom: 30 };

		const height = this.props.height;

		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const yGrid = { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 }
		const xGrid = { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 }

		const { selectedBacktestResult: backtest } = this.props
		const profitDates: Date[] = this.props.selectedBacktestResult?.entryDatesOfProfitTrades?.map(strDate => new Date(strDate))
		const lostDates: Date[] = this.props.selectedBacktestResult?.entryDatesOfLossTrades?.map(strDate => new Date(strDate)) 
    
    return (
			<div>
				<h1 style={{fontSize: '16px', paddingLeft: margin.left / 2, paddingTop : margin.top, color: 'rgb(158, 158, 158)'}}>
				{	
					backtest &&
					backtest.stockName + ' - ' + backtest.interval + ' - ' + backtest.rewardToRisk  + ':1' 
				}
				</h1>
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
								{/* Anotations for won/lost trades */} 
								{
									profitDates &&
									<Annotate with={LabelAnnotation} 
										when={(d: VerticalSlice) => profitDates.some((date: Date) => date.getTime() === d.date.getTime())} 
										usingProps={{
											fontSize: 14,
											opacity: 1,
											text: "🔼",
											y: ({ yScale }) => yScale.range()[0],
										}}/>
								}
								{
									lostDates &&
									<Annotate with={LabelAnnotation} 
										when={(d: VerticalSlice) => lostDates.some((date: Date) => date.getTime() === d.date.getTime())} 
										usingProps={{
											fontSize: 14,
											opacity: 1,
											text: "🔺",
											y: ({ yScale }) => yScale.range()[0],
										}}/>
								}
								{/* enter line */}
							<LineSeries
								yAccessor={(d: VerticalSlice) => this.tradeLineValue(d)} 
								strokeOpacity={1}
								stroke="white"
								/>
								{/* stop loss line 
							<LineSeries
								yAccessor={(d: VerticalSlice) => (d.date > new Date('2022-02-24T03:24:00') )? 1.25 : 0} 
								defined={(id: number) => id === 1.25} 
								strokeOpacity={1}
								stroke="red"
								/>*/}
								{/* take profit line
							<LineSeries
								yAccessor={(d: VerticalSlice) => (d.date > new Date('2022-02-24T03:24:00') )? 1.25 : 0} 
								defined={(id: number) => id === 1.25} 
								strokeOpacity={1}
								stroke="green"
								/> */}

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
