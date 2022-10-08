import { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import "apercu-font";


type PropsType = {
  //selectedStrategyReport: StrategyReport
}

type StateType = {
}


class Graph extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
  }

  render() {
    
    return (
      <div>
      </div>
    );
  }
}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    //selectedStrategyReport: state.selectedStrategyReport
  };
};

export default connect(mapStateToProps)(Graph);
