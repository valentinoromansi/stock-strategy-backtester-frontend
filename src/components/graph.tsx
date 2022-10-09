import { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import "apercu-font";

import { format } from "d3-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import { BarSeries,	CandlestickSeries} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { CrossHairCursor} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";


type PropsType = {
  //selectedStrategyReport: StrategyReport
  type: any,
  width: any,
  ratio: any,
  mouseMoveEvent: any,
  panEvent: any,
  zoomEvent: any,
  clamp: any,
  data: any
}

type StateType = {
}


class Graph extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    console.log("REACT STOCKCHARTS:::")
  }

  render() {
    const { type, width, ratio } = this.props;
		const { mouseMoveEvent, panEvent, zoomEvent } = this.props;
		const { clamp } = this.props;

		const { data: initialData } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		const margin = { left: 70, right: 70, top: 20, bottom: 30 };

		const height = 400;

		const gridHeight = height - margin.top - margin.bottom;
		const gridWidth = width - margin.left - margin.right;

		const showGrid = true;
		const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 } : {};
		const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 } : {};
    
    return (
			<ChartCanvas height={height}
				ratio={ratio}
				width={width}
				margin={{ left: 70, right: 70, top: 10, bottom: 30 }}
				mouseMoveEvent={mouseMoveEvent}
				panEvent={panEvent}
				zoomEvent={zoomEvent}
				clamp={clamp}
				type={type}
				data={data}
				xScale={xScale}
				xExtents={xExtents}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
			>
				{/* Chart */}
				<Chart id={1} yExtents={d => [d.high, d.low]}>
					{/* Date axis */}
					<XAxis axisAt="bottom"
						orient="bottom"
						zoomEnabled={zoomEvent}
						{...xGrid} />
					{/* price axis */}
					<YAxis axisAt="right"
						orient="right"
						ticks={5}
						zoomEnabled={zoomEvent}
						{...yGrid}
					/>

					<CandlestickSeries />
					{/* Top left attributes */}
					<OHLCTooltip origin={[-40, 0]}/>
				</Chart>
				{/* Volume */}
				<Chart id={2}
					yExtents={d => d.volume}
					height={150} origin={(w, h) => [0, h - 150]}
				>
					{/* volume axis */}
					<YAxis
						axisAt="left"
						orient="left"
						ticks={5}
						tickFormat={format(".2s")}
						zoomEnabled={zoomEvent}
					/>

					<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#FF0000"} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    //selectedStrategyReport: state.selectedStrategyReport
		type: "svg",
		mouseMoveEvent: true,
		panEvent: true,
		zoomEvent: true,
		clamp: false,
		width: 1200,
  	ratio: 1,
		data: [ { date: new Date("2010-01-03T23:00:00.000Z"), "open": 25.436282332605284, "high": 25.835021381744056, "low": 25.411360259406774, "close": 25.710416, "volume": 38409100, "split": "", "dividend": "", "absoluteChange": "", "percentChange": "" },
		{ date: new Date("2010-01-03T23:05:00.000Z"), "open": 25.436282332605284, "high": 25.835021381744056, "low": 25.411360259406774, "close": 25.710416, "volume": 3840910, "split": "", "dividend": "", "absoluteChange": "", "percentChange": "" },
		{ date: new Date("2010-01-03T23:10:00.000Z"), "open": 25.436282332605284, "high": 25.835021381744056, "low": 25.411360259406774, "close": 25.710416, "volume": 3840910, "split": "", "dividend": "", "absoluteChange": "", "percentChange": "" }]
  };
};

export default connect(mapStateToProps)(Graph);
