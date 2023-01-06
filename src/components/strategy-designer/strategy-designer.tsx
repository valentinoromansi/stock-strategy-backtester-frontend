import React, { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { IconButton } from "@mui/material";
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

class StrategyDesigner extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

  	constructor(props: PropsType) {
    	super(props);
		this.state = {
			selectedStrategy: props.selectedStrategy, // copy this by value so props.selectedStrategy stays unchanged
			sidebarVisible: true
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
	  console.log(this.props.selectedStrategy)
	  this.setState({selectedStrategy: this.props.selectedStrategy})
	}
	
	onSaveStrategy() {
		alert("save")
	}

	onDeleteStrategy() {
		alert("delete")
	}


	toogleSidebar() {
		this.setState({sidebarVisible: !this.state.sidebarVisible})
	}
	

	selectElement(currentValue: AttributeType | Position, enumType: typeof AttributeType | typeof Position, onChange: (value: string) => void) {
		let selectClass = '' 
		switch(enumType) {
			case AttributeType: selectClass = styles.strategyDesignerSidebarSelectAttribute; break
			case Position: selectClass = styles.strategyDesignerSidebarSelectPosition; break
		}
		return (
			<Select 
				className={selectClass} 
				onChange={(e: SelectChangeEvent) => { onChange(e.target.value) }} 
				value={currentValue}>
				{
					Object.values(enumType).map((value) => (
						<MenuItem value={value}>{value}</MenuItem>
					))
				}
			</Select>
		)
	}

	attributeSelectElement(currentValue: AttributeType, ruleIndex: number, mainAttributeIndex: AttributeId, subAttributeIndex: AttributeId): any {
		const onChange = (value) => {
			let newSelectedStrategy = this.state.selectedStrategy
			const topLvlAttribute = (mainAttributeIndex == AttributeId.ATTRIBUTE1) ? "valueExtractionRule1" : "valueExtractionRule2"
			const lowLvlAttribute = (subAttributeIndex == AttributeId.ATTRIBUTE1) ? "attribute1" : "attribute2"
			newSelectedStrategy.strategyConRules[ruleIndex][topLvlAttribute][lowLvlAttribute] = value
			this.setState({selectedStrategy: newSelectedStrategy})
		}
		return (
			this.selectElement(currentValue, AttributeType, onChange)
		)
	}
	
	positionSelectElement(currentValue: Position, ruleIndex: number): any {
		const onChange = (value) => {
			let newSelectedStrategy = this.state.selectedStrategy
			newSelectedStrategy.strategyConRules[ruleIndex].position = value
			this.setState({selectedStrategy: newSelectedStrategy})
		}
		return (
			this.selectElement(currentValue, Position, onChange)
		)
	}


	percentageElement(percent: number, ruleIndex: number, mainAttributeIndex: AttributeId) {
		const onChange = (valueStr: string) => {
			const isWholeANum = !isNaN(Number(valueStr))
			const isLastANum = (valueStr.length > 0 && !isNaN(Number(valueStr.charAt(valueStr.length - 1))))
			if(valueStr.length > 2 || valueStr.length > 0 && (!isWholeANum || !isLastANum))
				return
			const value = Number(valueStr)					
			console.log(value)
			let newSelectedStrategy = this.state.selectedStrategy
			const topLvlAttribute = (mainAttributeIndex == AttributeId.ATTRIBUTE1) ? "valueExtractionRule1" : "valueExtractionRule2"
			newSelectedStrategy.strategyConRules[ruleIndex][topLvlAttribute].percent = value
			this.setState({selectedStrategy: newSelectedStrategy})
		}		
		return (
			<div className={styles.strategyDesignerSidebarListItemRuleValuePercentWrapper}>
				<OutlinedInput className={styles.strategyDesignerSidebarListItemRuleValuePercent}
					onChange={(e) => { onChange(e.target.value) }}
					value={percent == 0 ? '' : percent}
					endAdornment={
						<InputAdornment className={styles.strategyDesignerSidebarListItemRuleValuePercentSymbol} position="end">
							%
						</InputAdornment>}/>
			</div>
		)
	}
	
	attributeElement(rule: ValueExtractionRule, ruleIndex: number, mainAttributeIndex: AttributeId): any {
		const isRelative: boolean = rule?.attribute1 != null && rule?.attribute2 != null
		const percent = rule?.percent
		return (
			<div className={styles.strategyDesignerSidebarListItemRuleValueWrapper}>
				{ /* Simple attribute */}
				{
					!isRelative &&
					<div className={styles.strategyDesignerSidebarListItemRuleValue}>
						{ (rule?.attribute1) && this.attributeSelectElement(rule?.attribute1, ruleIndex, mainAttributeIndex, AttributeId.ATTRIBUTE1) }
					</div>
				}
				{ /* Relative attribute */ }
				{
					isRelative &&
					<React.Fragment>
						{ /* Attributes */}
						<div className={styles.strategyDesignerSidebarListItemRuleValueRelative}>
							{ (rule?.attribute1) && this.attributeSelectElement(rule?.attribute1, ruleIndex, mainAttributeIndex, AttributeId.ATTRIBUTE1) }
							{ (rule?.attribute2) && this.attributeSelectElement(rule?.attribute2, ruleIndex, mainAttributeIndex, AttributeId.ATTRIBUTE2) }
						</div>
						{ /* Vertical divider */}
						<div className={styles.strategyDesignerSidebarListItemRuleValueDivider}></div>
						{ /* Percentage */}
						{ this.percentageElement(percent, ruleIndex, mainAttributeIndex) }
					</React.Fragment>
				}				
			</div>
		)
	}


 
  render() {
		const sidebarClass = this.state.sidebarVisible ? styles.strategyDesignerSidebarVisible : styles.strategyDesignerSidebarHidden
		const sidebarToggleButtonClass = this.state.sidebarVisible ? styles.strategyDesignerSidebarToogleButtonVisible : styles.strategyDesignerSidebarToogleButtonHidden
		const toogleIcon = this.state.sidebarVisible ? <ArrowBackIosNewIcon/> : <ArrowForwardIosIcon/>
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
				<div className={sidebarClass}>
					{/* top buttons */}
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
					{
						this.state.selectedStrategy?.strategyConRules.map((rule: ConditionalRule, i) => (
							<div className={styles.strategyDesignerSidebarListItem}>
								{/* simple/relative attribute 1 */}
								{ this.attributeElement(rule?.valueExtractionRule1, i, AttributeId.ATTRIBUTE1) }
								{/* Rule condition */}
								{ this.positionSelectElement(rule.position, i) }
								{/* simple/relative attribute 2 */}
								{ this.attributeElement(rule?.valueExtractionRule2, i, AttributeId.ATTRIBUTE2) }
							</div>
        	    		))
        			}
				</div>
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
