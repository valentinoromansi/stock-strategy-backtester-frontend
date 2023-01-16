import React, { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { Box, IconButton, Input, Menu, Paper, TextField } from "@mui/material";
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
import StrategyDesignerSidebarRuleList from "./strategy-designer-sidebar-rule-list";
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

  
    

  isStrategyFormValid(): { valid: boolean, errorMsg: string }{
    return { valid: false, errorMsg: null }
  }
	  
	onRefreshStrategy() {
		actions.addNotification(new Notification('success', `Strategy "${this.state.selectedStrategy.name}" refreshed.`))
		this.setState({selectedStrategy: this.props.selectedStrategy})
		actions.setStrategyDesignerStrategy(this.props.selectedStrategy)
	}
	
	onSaveStrategy() {
    const validity: { valid: boolean, errorMsg: string } = this.isStrategyFormValid()
    if(!validity.valid) {
	  	actions.addNotification(new Notification('error', `Strategy "${this.state.selectedStrategy.name}" form is not valid. Message="${validity.errorMsg}"`))
      return;
    }
		saveStrategy(this.props.strategyDesignerStrategy)
	}

	onDeleteStrategy() {
		deleteStrategy(this.props.selectedStrategy?.name)
	}

  onNameChange(e: any) {
		const strategy = this.props.strategyDesignerStrategy
		strategy.name = e.target.value
		actions.setStrategyDesignerStrategy(strategy)
	};


  TopStrategyActions() {
    const jsonButton = <Button className={styles.strategyDesignerSidebarjsonButton} variant="text"> <b>JSON</b> </Button>
    return (
      <React.Fragment>
        <Popup trigger={jsonButton} position="right center" modal>
    		  <pre style={{maxHeight: "95vh"}}>
				  	{
				  		JSON.stringify(this.props.strategyDesignerStrategy, null, "\t")
				  	}
				  </pre>
  			</Popup>
        <IconButton onClick={() => { this.onSaveStrategy()}} color="primary">
					<SaveIcon fontSize="large"/>
      	</IconButton>
				<IconButton onClick={() => { this.onRefreshStrategy()}} color="primary">
					<RestorePageIcon fontSize="large"/>
      	</IconButton>
				<IconButton onClick={() => { this.onDeleteStrategy()}} color="primary">
				  <DeleteForeverIcon fontSize="large"/>
      	</IconButton>
      </React.Fragment>
    )
  }
	


  render() {

    return (
		<Paper sx={{ minWidth: "400px", maxWidth: "770px", overflow: 'hidden', boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)", padding: '8px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Strategy name and top action buttons(json, save, refresh, delete) */}
      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'right', paddingTop: '8px'}}>
      <TextField 
					style={{width: '100%'}} label="Strategy name" variant="outlined" 
					value={this.props.strategyDesignerStrategy?.name}
          placeholder='Strategy name'
					onChange={(e) => { this.onNameChange(e) }}
				/>
        <this.TopStrategyActions></this.TopStrategyActions>
      </Box>

      {/* Rules list */}	
      <Box>
        <StrategyDesignerSidebarRuleList></StrategyDesignerSidebarRuleList>
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
