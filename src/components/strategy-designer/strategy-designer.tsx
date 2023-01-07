import React, { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { IconButton, Menu } from "@mui/material";
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
	sidebarVisible: boolean,
	menuAnchorElement: any,
	hoveredAttributeIdentifier: AttributeIdentifier | null,
	rcAttributeIdentifier: AttributeIdentifier | null,
	canOpenMenu: boolean
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
 
class StrategyDesigner extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

  	constructor(props: PropsType) {
    	super(props);
		this.state = {
			selectedStrategy: props.selectedStrategy, // copy this by value so props.selectedStrategy stays unchanged
			sidebarVisible: true,
			menuAnchorElement: null,
			hoveredAttributeIdentifier: null,
			rcAttributeIdentifier: null,
			canOpenMenu: true
		}
		this.onRefreshStrategy = this.onRefreshStrategy.bind(this)
		this.onSaveStrategy = this.onSaveStrategy.bind(this)
		this.onDeleteStrategy = this.onDeleteStrategy.bind(this)
		document.addEventListener("contextmenu", (event: MouseEvent) => {
			event.preventDefault();
			if(this.state.hoveredAttributeIdentifier) {
				this.setState({rcAttributeIdentifier: this.state.hoveredAttributeIdentifier})
				this.setState({menuAnchorElement: event.target})
				console.log(this.state)
			}
		});
	}

	componentDidMount() {
    	this.setState({selectedStrategy: this.props.selectedStrategy})
  	}  

	componentWillReceiveProps(nextProps: PropsType) {
    	this.setState({selectedStrategy: nextProps.selectedStrategy})
  	}


	  
	onRefreshStrategy() {
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
	

	selectElement(attributeIdentifier: AttributeIdentifier | null, currentValue: AttributeType | Position, prefix: string, enumType: typeof AttributeType | typeof Position, onChange: (value: string) => void) {
		let selectClass = '' 
		switch(enumType) {
			case AttributeType: selectClass = styles.strategyDesignerSidebarSelectAttribute; break
			case Position: selectClass = styles.strategyDesignerSidebarSelectPosition; break
		}
		return (
			<Select
				className={selectClass} 
				onChange={(e: SelectChangeEvent) => { onChange(e.target.value) }} 
				//onOpen={(e) => { this.setState({ menuAnchorElement: null}) }}
				value={currentValue}
				onMouseOver={(e) =>  { this.setState({ hoveredAttributeIdentifier: attributeIdentifier}) }}
				onMouseLeave={(e) =>  { this.setState({ hoveredAttributeIdentifier: null}) }}
				onOpen={(e) =>  { this.setState({ canOpenMenu: false}) }}
				onClose={(e) =>  { this.setState({ canOpenMenu: true, menuAnchorElement: null}) }}
			>
				{
					Object.values(enumType).map((value) => (
						<MenuItem value={value}>{prefix + '' + value}</MenuItem>
					))
				}
			</Select>
		)
	}

	attributeSelectElement(attributeIdentifier: AttributeIdentifier, currentValue: AttributeType): any {
		let newSelectedStrategy = this.state.selectedStrategy
		const topLvlAttribute = (attributeIdentifier.mainAttributeIndex == AttributeId.ATTRIBUTE1) ? "valueExtractionRule1" : "valueExtractionRule2"
		const lowLvlAttribute = (attributeIdentifier.subAttributeIndex == AttributeId.ATTRIBUTE1) ? "attribute1" : "attribute2"
		const onChange = (value) => {
			newSelectedStrategy.strategyConRules[attributeIdentifier.ruleIndex][topLvlAttribute][lowLvlAttribute] = value
			this.setState({selectedStrategy: newSelectedStrategy})
		}
		const prefix = newSelectedStrategy.strategyConRules[attributeIdentifier.ruleIndex][topLvlAttribute].id?.toString() + '.'
		return (
			this.selectElement(attributeIdentifier, currentValue, prefix, AttributeType, onChange)
		)
	}
	
	positionSelectElement(currentValue: Position, ruleIndex: number): any {
		const onChange = (value) => {
			let newSelectedStrategy = this.state.selectedStrategy
			newSelectedStrategy.strategyConRules[ruleIndex].position = value
			this.setState({selectedStrategy: newSelectedStrategy})
		}
		return (
			this.selectElement(null, currentValue, '', Position, onChange)
		)
	}


	percentageElement(percent: number, attributeIdentifier: AttributeIdentifier) {
		const onChange = (valueStr: string) => {
			const isWholeANum = !isNaN(Number(valueStr))
			const isLastANum = (valueStr.length > 0 && !isNaN(Number(valueStr.charAt(valueStr.length - 1))))
			if(valueStr.length > 2 || valueStr.length > 0 && (!isWholeANum || !isLastANum))
				return
			const value = Number(valueStr)					
			let newSelectedStrategy = this.state.selectedStrategy
			const topLvlAttribute = (attributeIdentifier.mainAttributeIndex == AttributeId.ATTRIBUTE1) ? "valueExtractionRule1" : "valueExtractionRule2"
			newSelectedStrategy.strategyConRules[attributeIdentifier.ruleIndex][topLvlAttribute].percent = value
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
						</InputAdornment>}
				/>
					
			</div>
		)
	}
	
	attributeElement(rule: ValueExtractionRule, ruleIndex: number, mainAttributeIndex: AttributeId): any {
		const isRelative: boolean = rule?.attribute1 != null && rule?.attribute2 != null
		const percent = rule?.percent
		const getAttributeIdentifier = (subAttributeIndex: AttributeId) : AttributeIdentifier  => { return { ruleIndex: ruleIndex, mainAttributeIndex: mainAttributeIndex, subAttributeIndex: subAttributeIndex}}
		return (
			<div className={styles.strategyDesignerSidebarListItemRuleValueWrapper}>				
				{ /* Simple attribute */}
				{
					!isRelative &&
					<div className={styles.strategyDesignerSidebarListItemRuleValue}>
						{ (rule?.attribute1) && this.attributeSelectElement(getAttributeIdentifier(AttributeId.ATTRIBUTE1), rule?.attribute1) }
					</div>
				}
				{ /* Relative attribute */ }
				{
					isRelative &&
					<React.Fragment>
						{ /* Attributes */}
						<div className={styles.strategyDesignerSidebarListItemRuleValueRelative}>
							{ (rule?.attribute1) && this.attributeSelectElement(getAttributeIdentifier(AttributeId.ATTRIBUTE1), rule?.attribute1) }
							{ (rule?.attribute2) && this.attributeSelectElement(getAttributeIdentifier(AttributeId.ATTRIBUTE2), rule?.attribute2) }
						</div>
						{ /* Vertical divider */}
						<div className={styles.strategyDesignerSidebarListItemRuleValueDivider}></div>
						{ /* Percentage */}
						{ this.percentageElement(percent, { ruleIndex: ruleIndex, mainAttributeIndex: mainAttributeIndex, subAttributeIndex: null}) }
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
				<Menu id="menu" anchorEl={this.state.menuAnchorElement} MenuListProps={{'aria-labelledby': 'basic-button'}}
					open={this.state.menuAnchorElement != null && this.state.canOpenMenu}
					onClose={() => {this.setState({menuAnchorElement: null})}}>
			 		<MenuItem onClick={(e: any) => { alert(JSON.stringify(this.state.rcAttributeIdentifier))}}>Change VS id</MenuItem>
			 		<MenuItem onClick={(e: any) => { this.setState({menuAnchorElement: null})} }>Cancel</MenuItem>
		   		</Menu>
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
