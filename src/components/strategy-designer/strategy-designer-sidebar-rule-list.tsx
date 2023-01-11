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

import * as actions from "../../state/actions";


type PropsType = {
	strategyDesignerStrategy: Strategy
}

type StateType = {
	rcMenuAnchorElement: any,
	hoveredAttributeIdentifier: AttributeIdentifier | null,
	rcAttributeIdentifier: AttributeIdentifier | null,
	canOpenRcMenu: boolean
}

enum AttributeId {
	ATTRIBUTE1 = 1,
	ATTRIBUTE2 = 2
}

const mainAttributeVarNameMap = {
	[AttributeId.ATTRIBUTE1]: 'valueExtractionRule1',
	[AttributeId.ATTRIBUTE2]: 'valueExtractionRule2'
}

const subAttributeVarNameMap = {
	[AttributeId.ATTRIBUTE1]: 'attribute1',
	[AttributeId.ATTRIBUTE2]: 'attribute2'
}

type AttributeIdentifier = {
	ruleIndex: number,
	mainAttributeIndex: AttributeId,
	subAttributeIndex: AttributeId | null
}
 
class StrategyDesignerSidebarRuleList extends Component<PropsType, StateType> {

  	constructor(props: PropsType) {
    	super(props);
			this.state = {
				rcMenuAnchorElement: null,
				hoveredAttributeIdentifier: null,
				rcAttributeIdentifier: null,
				canOpenRcMenu: true
			}
			// Disabling default right click and setting flags for opening menu component
			document.addEventListener("contextmenu", (event: MouseEvent) => {
				event.preventDefault();
				if(this.state.hoveredAttributeIdentifier) 
					this.setState({rcAttributeIdentifier: this.state.hoveredAttributeIdentifier, rcMenuAnchorElement: event.target})
			});
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
				onOpen={(e) =>  { this.setState({ canOpenRcMenu: false}) }}
				onClose={(e) =>  { this.setState({ canOpenRcMenu: true, rcMenuAnchorElement: null}) }}
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
		const mainAttributeVarName = mainAttributeVarNameMap[attributeIdentifier.mainAttributeIndex]
		const subAttributeVarName = subAttributeVarNameMap[attributeIdentifier.subAttributeIndex]
		let newStrategy = this.props.strategyDesignerStrategy
		const onChange = (value) => {
			newStrategy.strategyConRules[attributeIdentifier.ruleIndex][mainAttributeVarName][subAttributeVarName] = value
			actions.setStrategyDesignerStrategy(newStrategy)
		}
		const prefix = newStrategy.strategyConRules[attributeIdentifier.ruleIndex][mainAttributeVarName].id?.toString() + '.'
		return (
			this.selectElement(attributeIdentifier, currentValue, prefix, AttributeType, onChange)
		)
	}
	
	positionSelectElement(currentValue: Position, ruleIndex: number): any {
		const onChange = (value) => {
			let newStrategy = this.props.strategyDesignerStrategy
			newStrategy.strategyConRules[ruleIndex].position = value
			actions.setStrategyDesignerStrategy(newStrategy)
		}
		return (
			this.selectElement(null, currentValue, '', Position, onChange)
		)
	}

	percentageElement(percent: number, attributeIdentifier: AttributeIdentifier) {
		const onChange = (valueStr: string) => {
			const isNum = !isNaN(Number(valueStr))
			if(valueStr.length > 2 || !isNum)
				return
			const value = Number(valueStr)					
			let newStrategy = this.props.strategyDesignerStrategy
			const mainAttributeVarName = mainAttributeVarNameMap[attributeIdentifier.mainAttributeIndex]
			newStrategy.strategyConRules[attributeIdentifier.ruleIndex][mainAttributeVarName].percent = value
			actions.setStrategyDesignerStrategy(newStrategy)
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
	
	attributeElement(ruleIndex: number, mainAttributeIndex: AttributeId): any {
		const mainAttributeVarName = mainAttributeVarNameMap[mainAttributeIndex]
		const rule = this.props.strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName]
		const percent = rule?.percent
		const getAttributeIdentifier = (subAttributeIndex: AttributeId) : AttributeIdentifier  => { 
			return { 
				ruleIndex: ruleIndex, 
				mainAttributeIndex: mainAttributeIndex, 
				subAttributeIndex: subAttributeIndex
			}}
		return (
			<div className={styles.strategyDesignerSidebarListItemRuleValueWrapper}>				
				{ /* Simple attribute */}
				{
					!rule.isRelative &&
					<div className={styles.strategyDesignerSidebarListItemRuleValue}>
						{ (rule?.attribute1) && this.attributeSelectElement(getAttributeIdentifier(AttributeId.ATTRIBUTE1), rule?.attribute1) }
					</div>
				}
				{ /* Relative attribute */ }
				{
					rule.isRelative &&
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



	rightClickMenuElement() {
		const ruleIndex = this.state.rcAttributeIdentifier?.ruleIndex
		const mainAttributeVarName = mainAttributeVarNameMap[this.state.rcAttributeIdentifier?.mainAttributeIndex]
		// For changing attribute slice id
		const onChangeVsId = (newAttributeSliceIdStr: string) => {
			let strategyDesignerStrategy = this.props.strategyDesignerStrategy
			const newAttributeSliceId = Number(newAttributeSliceIdStr)
			if(newAttributeSliceIdStr == '') {
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].id = 0
				actions.setStrategyDesignerStrategy(strategyDesignerStrategy)
				return
			}
			if(isNaN(newAttributeSliceId) || (newAttributeSliceId <= 0 && newAttributeSliceIdStr.length == 1) || newAttributeSliceId > 99)
				return
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].id = newAttributeSliceId
				actions.setStrategyDesignerStrategy(strategyDesignerStrategy)
		}		
		const attributeSliceId = this.props.strategyDesignerStrategy?.strategyConRules?.[ruleIndex]?.[mainAttributeVarName]?.id
		// For changing attribute type - simple/complex
		let toogleAttributeTypeElement = (ruleIndex: number, mainAttributeVarName: string) => {
			const isRelative = this.props.strategyDesignerStrategy.strategyConRules?.[ruleIndex]?.[mainAttributeVarName]?.isRelative
			let onToogleClick = (isRelative: boolean) => {
				let strategyDesignerStrategy = this.props.strategyDesignerStrategy
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].isRelative = isRelative
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].attribute2 = isRelative ? AttributeType.OPEN : null
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].percent = isRelative ? 0 : null
				this.setState({rcMenuAnchorElement: null})
				actions.setStrategyDesignerStrategy(strategyDesignerStrategy)
			}		
			return(
				<ToggleButtonGroup
    			color="primary"
    			value={isRelative}
    			exclusive    			
    			aria-label="Platform"
				>
    			<ToggleButton onClick={(e) => { onToogleClick(false)}} value={false}>Simple</ToggleButton>
    			<ToggleButton onClick={(e) => { onToogleClick(true)}} value={true}>Relative</ToggleButton>
    		</ToggleButtonGroup>
			)	
		}
		return(
			<Menu id="menu" anchorEl={this.state.rcMenuAnchorElement} MenuListProps={{'aria-labelledby': 'basic-button'}}
				open={this.state.rcMenuAnchorElement != null && this.state.canOpenRcMenu}
				onClose={() => {this.setState({rcMenuAnchorElement: null})}}>
				<TextField
					style={{padding: "2px", width: "100%"}}
					value={isNaN(attributeSliceId) ? '' : attributeSliceId}
					id="filled-basic"
					label="Vertical slice id"
					variant="filled"
					onChange={(e) => { onChangeVsId(e.target.value) }}
        />
				<div style={{padding: "2px"}}>
					{toogleAttributeTypeElement(ruleIndex, mainAttributeVarName)}
				</div>
				<MenuItem onClick={(e: any) => { this.setState({rcMenuAnchorElement: null})} }>Cancel</MenuItem>
		   	</Menu>
		)
	}



  render() {

    return (
			<div>
				{
					this.props.strategyDesignerStrategy?.strategyConRules.map((rule: ConditionalRule, i) => (
						<div className={styles.strategyDesignerSidebarListItem}>
							{/* simple/relative attribute 1 */}
							{ this.attributeElement(i, AttributeId.ATTRIBUTE1) }
							{/* Rule condition */}
							{ this.positionSelectElement(rule.position, i) }
							{/* simple/relative attribute 2 */}
							{ this.attributeElement(i, AttributeId.ATTRIBUTE2) }
						</div>
        	))
        }
				{/* Sidebar rule right click menu */}
				{ this.props.strategyDesignerStrategy && this.rightClickMenuElement() }
			</div>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyDesignerStrategy: state.strategyDesignerStrategy
  };
};

export default connect(mapStateToProps)(StrategyDesignerSidebarRuleList);
