import React, { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { IconButton, Input, Menu, TextField } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '@mui/material/Button';
import { AttributeType } from "types/attribute-type";
import { Position } from "types/position";
import { setSelectedStrategy } from "state/actions";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';						
import { ConditionalRule } from "models/conditional-rule";
import { ValueExtractionRule } from "models/value-extraction-rule";

import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { isEnumMember } from "typescript";

import SaveIcon from '@mui/icons-material/Save';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { relative } from "path";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import StrategyDesignerSidebar from './strategy-designer-sidebar';

import * as actions from "../../state/actions";
import { deleteStrategy, saveStrategy } from "http/http";


type PropsType = {
  selectedStrategy: Strategy,
  strategyDesignerStrategy: Strategy
}

type StateType = {
	selectedStrategy: Strategy
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
 
class StrategyDesigner extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

  	constructor(props: PropsType) {
    	super(props);
		this.state = {
			selectedStrategy: props.selectedStrategy, // copy this by value so props.selectedStrategy stays unchanged
		}
		this.onRefreshStrategy = this.onRefreshStrategy.bind(this)
		this.onSaveStrategy = this.onSaveStrategy.bind(this)
		this.onDeleteStrategy = this.onDeleteStrategy.bind(this)
	}

	componentDidMount() {
    	this.setState({selectedStrategy: this.props.selectedStrategy})
  	}  

	componentWillReceiveProps(nextProps: PropsType) {
    	this.setState({selectedStrategy: nextProps.selectedStrategy})
  	}


	  
	onRefreshStrategy() {
		this.setState({selectedStrategy: this.props.selectedStrategy})
		actions.setStrategyDesignerStrategy(this.props.selectedStrategy)
	}
	
	onSaveStrategy() {
		saveStrategy(this.props.strategyDesignerStrategy)
	}

	onDeleteStrategy() {
		deleteStrategy(this.props.selectedStrategy?.name)
	}
	


  render() {
		const jsonButton = <Button className={styles.strategyDesignerSidebarjsonButton} variant="text"> <b>JSON</b> </Button>

    return (
			<div className={styles.strategyDesignerWrapper}>				
				{/* Top right buttons */}				
				<div className={styles.strategyDesignerActionButtonsWrapper}>
					<IconButton className={styles.strategyDesignerActionButton} onClick={() => { this.onSaveStrategy()}} color="primary">
						<SaveIcon/>
      				</IconButton>
					<IconButton className={styles.strategyDesignerActionButton} onClick={() => { this.onRefreshStrategy()}} color="primary">
						<RestorePageIcon/>
      				</IconButton>
					<IconButton className={styles.strategyDesignerActionButton} onClick={() => { this.onDeleteStrategy()}} color="primary">
						<DeleteForeverIcon/>
      				</IconButton>
				</div>
				{/* Left strategy rules sidebar */}
				<StrategyDesignerSidebar></StrategyDesignerSidebar>
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy,
	strategyDesignerStrategy: state.strategyDesignerStrategy
  };
};

export default connect(mapStateToProps)(StrategyDesigner);
