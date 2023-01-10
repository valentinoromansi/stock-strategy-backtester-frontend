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

import StrategyDesignerSidebarRuleList from './strategy-designer-sidebar-rule-list'


type PropsType = {
  selectedStrategy: Strategy
}

type StateType = {
	selectedStrategy: Strategy,
	sidebarVisible: boolean
}

enum AttributeId {
	ATTRIBUTE1 = 1,
	ATTRIBUTE2 = 2
}

type AttributeIdentifier = {
	ruleIndex: number,
	mainAttributeIndex: AttributeId,
	subAttributeIndex: AttributeId | null
}
 
class StrategyDesignerSidebar extends Component<PropsType, StateType> {

  	constructor(props: PropsType) {
    	super(props);
			this.state = {
				selectedStrategy: props.selectedStrategy, // copy this by value so props.selectedStrategy stays unchanged
				sidebarVisible: true
			}
	}

	componentDidMount() {
    	this.setState({selectedStrategy: this.props.selectedStrategy})
  	}  

	componentWillReceiveProps(nextProps: PropsType) {
    	this.setState({selectedStrategy: nextProps.selectedStrategy})
  	}

	

	toogleSidebar() {
		this.setState({sidebarVisible: !this.state.sidebarVisible})
	}



  render() {
		const sidebarClass = this.state.sidebarVisible ? styles.strategyDesignerSidebarVisible : styles.strategyDesignerSidebarHidden
		const sidebarToggleButtonClass = this.state.sidebarVisible ? styles.strategyDesignerSidebarToogleButtonVisible : styles.strategyDesignerSidebarToogleButtonHidden
		const toogleIcon = this.state.sidebarVisible ? <ArrowBackIosNewIcon/> : <ArrowForwardIosIcon/>
		const jsonButton = <Button className={styles.strategyDesignerSidebarjsonButton} variant="text"> <b>JSON</b> </Button>	

    return (
			<div className={sidebarClass}>
					{/* top buttons - json and show/hide sidebar */}
					<div className={styles.strategyDesignerSidebartopButtons}>
						<Popup trigger={jsonButton} position="right center" modal>
    						<pre style={{maxHeight: "95vh"}}>
								{
									JSON.stringify(this.props.selectedStrategy, null, "\t")
								}
							</pre>
  					</Popup>
						<IconButton className={sidebarToggleButtonClass} onClick={() => { this.toogleSidebar()}} color="primary">
        			{ toogleIcon }
      			</IconButton>
					</div>
					{/* strategy rules */}
					<StrategyDesignerSidebarRuleList></StrategyDesignerSidebarRuleList>
				</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    selectedStrategy: state.selectedStrategy
  };
};

export default connect(mapStateToProps)(StrategyDesignerSidebar);
