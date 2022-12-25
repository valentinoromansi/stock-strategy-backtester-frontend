import { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";


type PropsType = {
  selectedStrategy: Strategy
}

type StateType = {
}

class StrategyDesigner extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

  constructor(props: PropsType) {
    super(props);
  }


  render() {
    return (
			<div> {this.props.selectedStrategy?.name} 
			{
			//<SpinnerComponent loading={this.props.stockVerticalSlicesFecthing} position="centered" />
			}				
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy
  };
};

export default connect(mapStateToProps)(StrategyDesigner);
