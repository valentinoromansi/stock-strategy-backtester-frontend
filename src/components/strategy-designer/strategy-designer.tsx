import React, { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { Box, Divider, IconButton, Input, Menu, Paper, TextField } from "@mui/material";
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
import StrategyDesignerRuleList from "./strategy-designer-rule-list";
import { Notification } from "components/notifications-stack";


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
    this.TopStrategyActions = this.TopStrategyActions.bind(this)
	}

	componentDidMount() {
    	this.setState({selectedStrategy: this.props.selectedStrategy})
  	}  

	componentWillReceiveProps(nextProps: PropsType) {
    	this.setState({selectedStrategy: nextProps.selectedStrategy})
  	}

  
    

  isStrategyFormValid(): { valid: boolean, errorMsg?: string }{
    const strategy = this.props.strategyDesignerStrategy
	console.log(strategy)
    if(!strategy.name || strategy.name?.length === 0)
      return { valid: false, errorMsg: "Strategy must have a name to be saved!" }
    else if(strategy.name.length > 30)
      return { valid: false, errorMsg: "Strategy name can not be over 30 characters!" }
    else if(strategy.strategyConRules.length === 0)
      return { valid: false, errorMsg: "There must be at least 1 strategy rule!" }
    for (let i=0; i < strategy.strategyConRules.length; ++i ) {
      const rule: ConditionalRule = strategy.strategyConRules[i]
      console.log(rule)
      if(rule.valueExtractionRule1?.isRelative && !(rule.valueExtractionRule1?.percent > 0 && rule.valueExtractionRule1?.percent < 99))
        return { valid: false, errorMsg: `Rule[${i}].valueExtractionRule1 is relative annd must have valid % value!` }
      if(rule.valueExtractionRule2?.isRelative && !(rule.valueExtractionRule2?.percent > 0 && rule.valueExtractionRule2?.percent < 99))
        return { valid: false, errorMsg: `Rule[${i}].valueExtractionRule2 is relative annd must have valid % value!` }
    }
    return { valid: true}
  }
	  
	onRefreshStrategy() {
		if(!this.state.selectedStrategy)
			return
		actions.addNotification(new Notification('success', `Strategy "${this.state.selectedStrategy?.name}" refreshed.`))
		this.setState({selectedStrategy: this.props.selectedStrategy})
		actions.setStrategyDesignerStrategy(this.props.selectedStrategy)
	}
	
	onSaveStrategy() {
    const validity: { valid: boolean, errorMsg?: string } = this.isStrategyFormValid()
    if(!validity.valid) {
	  	actions.addNotification(new Notification('error', `Strategy "${this.state.selectedStrategy?.name}" form is not valid. Message="${validity.errorMsg}"`))
      return;
    }
		saveStrategy(this.props.strategyDesignerStrategy)
	}

	onDeleteStrategy() {
		console.log("?????????????????X")
		deleteStrategy(this.props.selectedStrategy?.name)
	}

  onNameChange(e: any) {
		const strategy = this.props.strategyDesignerStrategy
		strategy.name = e.target.value
		actions.setStrategyDesignerStrategy(strategy)
	};


  TopStrategyActions() {
    const jsonButton = <Button sx={{color: 'white', alignSelf: 'center', padding:'10px'}} className={styles.strategyDesignerSidebarjsonButton} variant="text"> <b>JSON</b> </Button>
    return (
      <Box sx={{display: 'flex', gap: '6px'}}>
        <Popup trigger={jsonButton} position="right center" modal>
    		  <pre style={{maxHeight: "95vh"}}>
				  	{
				  		JSON.stringify(this.props.strategyDesignerStrategy, null, "\t")
				  	}
				  </pre>
  			</Popup>
        <IconButton sx={{borderRadius: '4px', color: 'white', alignSelf: 'center', padding:'6px'}} onClick={() => { this.onSaveStrategy()}} color="primary">
					<SaveIcon fontSize="large"/>
      	</IconButton>
				<IconButton sx={{borderRadius: '4px', color: 'white', alignSelf: 'center', padding:'6px'}} onClick={() => { this.onRefreshStrategy()}} color="primary">
					<RestorePageIcon fontSize="large"/>
      	</IconButton>
				<IconButton sx={{borderRadius: '4px', color: 'white', alignSelf: 'center', padding:'6px'}} onClick={() => { this.onDeleteStrategy()}} color="primary">
				  <DeleteForeverIcon fontSize="large"/>
      	</IconButton>
      </Box>
    )
  }
	


  render() {

    return (
		<Paper sx={{ minWidth: "400px", maxWidth: "770px", overflow: 'hidden', p: '12px', boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)", textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Strategy name and top action buttons(json, save, refresh, delete) */}
      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'right', paddingTop: '8px', gap: '60px'}}>
        <TextField
          inputProps={{
            maxLength: 30
          }}
			  	style={{width: '100%'}} label="Strategy name" variant="outlined" 
			  	value={this.props.strategyDesignerStrategy?.name}
          placeholder='Strategy name'
			  	onChange={(e) => { this.onNameChange(e) }}
			  />
        <this.TopStrategyActions></this.TopStrategyActions>
      </Box>

      <Divider variant='middle' sx={{ marginTop: '12px', marginBottom: '12px'}} orientation="horizontal" />  		

      {/* Rules list */}
      <Box>
        <StrategyDesignerRuleList></StrategyDesignerRuleList>
      </Box>
		</Paper>
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
