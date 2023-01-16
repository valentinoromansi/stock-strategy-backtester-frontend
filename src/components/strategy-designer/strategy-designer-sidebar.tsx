import React, { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { IconButton, TextField } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import { AttributeType } from "types/attribute-type";
import { Position } from "types/position";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';						
import { ConditionalRule } from "models/conditional-rule";
import { ValueExtractionRule } from "models/value-extraction-rule";

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';


import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import StrategyDesignerRuleList from './strategy-designer-rule-list';
import { createTheme, ThemeProvider } from '@mui/material/styles';



type PropsType = {
	strategyDesignerStrategy: Strategy
}

type StateType = {
	sidebarVisible: boolean
}

enum AttributeId {
	ATTRIBUTE1 = 1,
	ATTRIBUTE2 = 2
}

type AttributeIdentifier = {
	ruleIndex: number,
	mainAttributeIndex: AttributeId,
	subAttributeIndex: AttributeId | null,
	isEnterTradeRule: boolean,
	isStopLossRule: boolean
}
 
class StrategyDesignerSidebar extends Component<PropsType, StateType> {

  	constructor(props: PropsType) {
    	super(props);
			this.state = {
				sidebarVisible: true
			}
	}

	

	toogleSidebar() {
		this.setState({sidebarVisible: !this.state.sidebarVisible})
	}



  render() {

    return (
			<div>
				<StrategyDesignerRuleList></StrategyDesignerRuleList>
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyDesignerStrategy: state.strategyDesignerStrategy
  };
};

export default connect(mapStateToProps)(StrategyDesignerSidebar);
