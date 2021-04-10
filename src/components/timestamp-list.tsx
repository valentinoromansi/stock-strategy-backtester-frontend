import React, { Component } from "react";
import { Button, Table, Tabs } from "antd";
import { StrategyBacktestResults } from "../models/strategy-backtest-results";
import { columns } from "../constants/constants";
import Modal from "antd/lib/modal/Modal";

type PropsType = {
  timestamps: Date[]
  title: string
}
type StateType = {
  visible: boolean
}


export default class TimestampList extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      visible: false
    }    
  }

  closePopup() {
    this.setState({ visible: false }) 
  }

  render() {
    const timestampsElements = this.props?.timestamps.map((ts) => <p style={{ margin: '0px' }}>{ts}</p>)
    return (
      <div>
        <Button onClick={() => { this.setState({ visible: true }) }}>Open entry time</Button>
        <Modal title={this.props.title} visible={this.state.visible} onOk={ () => this.closePopup() } onCancel={ () => this.closePopup() }>
          {timestampsElements}
        </Modal>
      </div>
    );
  }
}
