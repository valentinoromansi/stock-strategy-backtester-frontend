import React, { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../../state/reducers';
import "apercu-font";

import { Strategy } from "../../models/strategy";
import styles from '../../styles/global.module.sass'
import { Box, Divider, Menu, TextField, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import { AttributeType } from "types/attribute-type";
import { Position } from "types/position";

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

import { deepCopy } from "../../utils/utils";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


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
	ruleIndex: number | null,
	mainAttributeIndex: AttributeId | null,
	subAttributeIndex: AttributeId | null,
	isEnterTradeRule: boolean | null,
	isStoplossRule: boolean | null
}
 
class StrategyDesignerRuleList extends Component<PropsType, StateType> {

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
						<MenuItem value={value}>
							<Typography>{prefix + '' + value}</Typography>
						</MenuItem>
					))
				}
			</Select>
		)
	}

	attributeSelectElement(attributeIdentifier: AttributeIdentifier, currentValue: AttributeType): any {
		const attributeInRow = !attributeIdentifier.isEnterTradeRule && !attributeIdentifier.isStoplossRule
		let newStrategy = this.props.strategyDesignerStrategy
		const mainAttributeVarName = attributeInRow ? mainAttributeVarNameMap[attributeIdentifier.mainAttributeIndex] : null
		const subAttributeVarName = subAttributeVarNameMap[attributeIdentifier.subAttributeIndex]
		const onChange = (value) => {
			if(attributeIdentifier.isEnterTradeRule)
				newStrategy.enterValueExRule[subAttributeVarName] = value
			else if(attributeIdentifier.isStoplossRule)
				newStrategy.stopLossValueExRule[subAttributeVarName] = value
			else
				newStrategy.strategyConRules[attributeIdentifier.ruleIndex][mainAttributeVarName][subAttributeVarName] = value
			actions.setStrategyDesignerStrategy(newStrategy)
		}
		const prefix = () => {
			if(attributeIdentifier.isEnterTradeRule)
				return newStrategy.enterValueExRule?.id.toString() + '.'
			else if(attributeIdentifier.isStoplossRule)
				return newStrategy.stopLossValueExRule?.id.toString() + '.'
			return newStrategy.strategyConRules[attributeIdentifier.ruleIndex][mainAttributeVarName].id?.toString() + '.'
		} 
		return (
			this.selectElement(attributeIdentifier, currentValue, prefix(), AttributeType, onChange)
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
			if(attributeIdentifier.isEnterTradeRule)
				newStrategy.enterValueExRule.percent = value
			else if(attributeIdentifier.isStoplossRule)
				newStrategy.stopLossValueExRule.percent = value
			else
				newStrategy.strategyConRules[attributeIdentifier.ruleIndex][mainAttributeVarName].percent = value			
			actions.setStrategyDesignerStrategy(newStrategy)
		}		
		return (
			<Box sx={{alignSelf: "center"}}>
				<OutlinedInput					
					onChange={(e) => { onChange(e.target.value) }}
					value={percent == 0 ? '' : percent}
					endAdornment={
						<InputAdornment className={styles.strategyDesignerSidebarListItemRuleValuePercentSymbol} position="end">
							<Typography>%</Typography>
						</InputAdornment>}
				/>
					
			</Box>
		)
	}
	
	attributeElement(attributeIdentifier: AttributeIdentifier): any {
		const mainAttributeVarName = mainAttributeVarNameMap[attributeIdentifier.mainAttributeIndex]
		const attributeInRow = !attributeIdentifier.isEnterTradeRule && !attributeIdentifier.isStoplossRule
		const rule = () : ValueExtractionRule => {
			if(attributeInRow)
				return this.props.strategyDesignerStrategy.strategyConRules[attributeIdentifier.ruleIndex][mainAttributeVarName]
			else if(attributeIdentifier.isEnterTradeRule)
				return this.props.strategyDesignerStrategy.enterValueExRule
				else if(attributeIdentifier.isStoplossRule)
			return this.props.strategyDesignerStrategy.stopLossValueExRule
		} 
		const percent = rule()?.percent
		const getAttributeIdentifier = (subAttributeIndex: AttributeId) : AttributeIdentifier  => { 
			return { 
				ruleIndex: attributeIdentifier.ruleIndex, 
				mainAttributeIndex: attributeIdentifier.mainAttributeIndex, 
				subAttributeIndex: subAttributeIndex,
				isEnterTradeRule: attributeIdentifier.isEnterTradeRule, 
				isStoplossRule: attributeIdentifier.isStoplossRule
			}}
		return (
			<div className={styles.strategyDesignerSidebarListItemRuleValueWrapper}>				
				{ /* Simple attribute */}
				{
					!rule()?.isRelative &&
					<div className={styles.strategyDesignerSidebarListItemRuleValue}>
						{ (rule()?.attribute1) && this.attributeSelectElement(getAttributeIdentifier(AttributeId.ATTRIBUTE1), rule()?.attribute1) }
					</div>
				}
				{ /* Relative attribute */ }
				{
					rule()?.isRelative &&
					<React.Fragment>
						{ /* Attributes */}
						<div className={styles.strategyDesignerSidebarListItemRuleValueRelative}>
							{ (rule()?.attribute1) && this.attributeSelectElement(getAttributeIdentifier(AttributeId.ATTRIBUTE1), rule()?.attribute1) }
							{ (rule()?.attribute2) && this.attributeSelectElement(getAttributeIdentifier(AttributeId.ATTRIBUTE2), rule()?.attribute2) }
						</div>
						{ /* Vertical divider */}						
						<Divider variant='middle' sx={{ paddingTop: '2px', marginBottom: '2px' }} orientation="vertical" flexItem />  
						{ /* Percentage */}
						{ this.percentageElement(percent, { ruleIndex: attributeIdentifier.ruleIndex, mainAttributeIndex: attributeIdentifier.mainAttributeIndex, subAttributeIndex: null, isEnterTradeRule: attributeIdentifier.isEnterTradeRule, isStoplossRule: attributeIdentifier.isStoplossRule}) }
					
					</React.Fragment>
				}		
			</div>
		)
	}



	rightClickMenuElement() {
		const attributeInRow = !this.state.rcAttributeIdentifier.isEnterTradeRule && !this.state.rcAttributeIdentifier.isStoplossRule 
		const ruleIndex = attributeInRow ? this.state.rcAttributeIdentifier?.ruleIndex : null
		const mainAttributeVarName = attributeInRow ? mainAttributeVarNameMap[this.state.rcAttributeIdentifier?.mainAttributeIndex] : null
		// Change id for attribute and save to redux state
		const setId = (id: number) => {
			let strategyDesignerStrategy = this.props.strategyDesignerStrategy
			if(attributeInRow)
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].id = id
			else if(this.state.rcAttributeIdentifier.isEnterTradeRule)
				strategyDesignerStrategy.enterValueExRule.id = id
			else if(this.state.rcAttributeIdentifier.isStoplossRule)
				strategyDesignerStrategy.stopLossValueExRule.id = id
			actions.setStrategyDesignerStrategy(strategyDesignerStrategy)
		}
		// For changing attribute slice id
		const onChangeVsId = (newAttributeSliceIdStr: string) => {
			const newAttributeSliceId = Number(newAttributeSliceIdStr)
			if(newAttributeSliceIdStr == '') {
				setId(0)
				return
			}
			if(isNaN(newAttributeSliceId) || (newAttributeSliceId <= 0 && newAttributeSliceIdStr.length == 1) || newAttributeSliceId > 99)
				return
			setId(newAttributeSliceId)
		}		
		const idToDisplay = () : number => {
			if(attributeInRow)
				return this.props.strategyDesignerStrategy?.strategyConRules?.[ruleIndex]?.[mainAttributeVarName]?.id
			else if(this.state.rcAttributeIdentifier.isEnterTradeRule)
				return this.props.strategyDesignerStrategy.enterValueExRule.id
			else if(this.state.rcAttributeIdentifier.isStoplossRule)
				return this.props.strategyDesignerStrategy.stopLossValueExRule.id
		}
		// For changing attribute type - simple/complex
		let toogleAttributeTypeElement = (ruleIndex: number, mainAttributeVarName: string) => {
			const isRelative = () => {
				if(attributeInRow)
					return this.props.strategyDesignerStrategy.strategyConRules?.[ruleIndex]?.[mainAttributeVarName]?.isRelative
				else if(this.state.rcAttributeIdentifier.isEnterTradeRule)
					return this.props.strategyDesignerStrategy.enterValueExRule.isRelative
				else if(this.state.rcAttributeIdentifier.isStoplossRule)
					return this.props.strategyDesignerStrategy.stopLossValueExRule.isRelative
			}
			let onToogleClick = (isRelative: boolean) => {
				let strategyDesignerStrategy = this.props.strategyDesignerStrategy
				if(attributeInRow) {
					strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].isRelative = isRelative
					strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].attribute2 = isRelative ? AttributeType.OPEN : null
					strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].percent = isRelative ? 0 : null
				}
				else if(this.state.rcAttributeIdentifier.isEnterTradeRule) {
					strategyDesignerStrategy.enterValueExRule.isRelative = isRelative
					strategyDesignerStrategy.enterValueExRule.attribute2 = isRelative ? AttributeType.OPEN : null
					strategyDesignerStrategy.enterValueExRule.percent = isRelative ? 0 : null
				}
				else if(this.state.rcAttributeIdentifier.isStoplossRule) {
					strategyDesignerStrategy.stopLossValueExRule.isRelative = isRelative
					strategyDesignerStrategy.stopLossValueExRule.attribute2 = isRelative ? AttributeType.OPEN : null
					strategyDesignerStrategy.stopLossValueExRule.percent = isRelative ? 0 : null
				}
				this.setState({rcMenuAnchorElement: null})
				actions.setStrategyDesignerStrategy(strategyDesignerStrategy)
			}		
			return(
				<ToggleButtonGroup
    			color="primary"
    			value={isRelative()}
    			exclusive    			
    			aria-label="Platform"
				>
    			<ToggleButton onClick={(e) => { onToogleClick(false)}} value={false}>Simple</ToggleButton>
    			<ToggleButton onClick={(e) => { onToogleClick(true)}} value={true}>Relative</ToggleButton>
    		</ToggleButtonGroup>
			)	
		}
		// on delete
		let onDelete = (ruleIndex: number) => {
			if(!attributeInRow)
				return
			let newStrategy = deepCopy(this.props.strategyDesignerStrategy)
			newStrategy.strategyConRules.splice(ruleIndex, 1)
			actions.setStrategyDesignerStrategy(newStrategy)
			this.setState({rcMenuAnchorElement: null})
		}
		return(
			<Menu id="menu" anchorEl={this.state.rcMenuAnchorElement} MenuListProps={{'aria-labelledby': 'basic-button'}} 
				open={this.state.rcMenuAnchorElement != null && this.state.canOpenRcMenu}
				onClose={() => {this.setState({rcMenuAnchorElement: null})}}>
					<Box sx={{ padding: "4px", gap: "8px", flexDirection: "column", display: "flex"}}>
				<TextField
					style={{ width: "100%"}}
					value={isNaN(idToDisplay()) ? '' : idToDisplay()}
					label="Vertical slice id"
					onChange={(e) => { onChangeVsId(e.target.value) }}
        		/>
				<div>
					{toogleAttributeTypeElement(ruleIndex, mainAttributeVarName)}
				</div>
				{
					attributeInRow &&
					<Button onClick={(e) => { onDelete(ruleIndex) }} variant="outlined" color="error"> DELETE </Button>
				}
				</Box>
		   	</Menu>
		)
	}






	addNewRuleButton() {
		const onClick = () => {
			let newStrategy: Strategy = deepCopy(this.props.strategyDesignerStrategy)
			newStrategy.strategyConRules.push(new ConditionalRule({
				valueExtractionRule1: new ValueExtractionRule({
					attribute1: AttributeType.OPEN,
					id: 0,
					isRelative: false
				}),
				position: Position.ABOVE,
				valueExtractionRule2: new ValueExtractionRule({
					attribute1: AttributeType.OPEN,
					id: 0,
					isRelative: false
				})
			}))
			actions.setStrategyDesignerStrategy(newStrategy)
			this.setState({rcMenuAnchorElement: null})
		}

		return(
				<Button 
					sx={{width: "auto", padding: "10px 20px" }} 
					variant="contained" 
					endIcon={<AddCircleOutlineIcon fontSize="large"/>} 
					onClick={() => onClick()}
				>
					add rule
				</Button>

		)
	}



	onNameChange(e: any) {
		const strategy = this.props.strategyDesignerStrategy
		strategy.name = e.target.value
		actions.setStrategyDesignerStrategy(strategy)
	};



  render() {

    return (
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px'}}>
				{/* Rules list */}
				{
					this.props.strategyDesignerStrategy?.strategyConRules?.map((rule: ConditionalRule, i) => (
						<div className={styles.strategyDesignerSidebarListItem}>
							{/* simple/relative attribute 1 */}
							{ this.attributeElement({ ruleIndex: i, mainAttributeIndex: AttributeId.ATTRIBUTE1, subAttributeIndex: null, isEnterTradeRule: null, isStoplossRule: null}) }
							{/* Rule condition */}
							{ this.positionSelectElement(rule.position, i) }
							{/* simple/relative attribute 2 */}
							{ this.attributeElement({ ruleIndex: i, mainAttributeIndex: AttributeId.ATTRIBUTE2, subAttributeIndex: null, isEnterTradeRule: null, isStoplossRule: null}) }
						</div>
        	))
        }
				{/* Add new rule */}
				<Box sx={{display: 'flex', justifyContent: 'start', paddingTop: '4px', paddingBottom: '4px'}}>
					{this.addNewRuleButton()}
				</Box>
				<Divider variant='middle' sx={{ marginTop: '12px', marginBottom: '12px'}} orientation="horizontal" />  		

				{/* Attribute select for entering trade or stoploss */}
				<Box className={styles.strategyDesignerSidebarListItemEnterStoplossAttributes}>
					<Box style={{display: "flex", flexDirection: 'column', width: '25%'}}>
						<Typography>Enter trade rule</Typography>
						{this.attributeElement({ ruleIndex: null, mainAttributeIndex: null, subAttributeIndex: null, isEnterTradeRule: true, isStoplossRule: null})}
					</Box>
					<Divider variant='middle' orientation="vertical" sx={{height: 'auto', margin: 0, marginTop: "4px"}} />  		
					<Box style={{display: "flex", flexDirection: 'column', width: '25%'}}>
						<Typography>Stop-loss rule</Typography>
						{this.attributeElement({ ruleIndex: null, mainAttributeIndex: null, subAttributeIndex: null, isEnterTradeRule: false, isStoplossRule: true})}
					</Box>
				</Box>
				{/* Sidebar rule right click menu */}
				{ this.props.strategyDesignerStrategy && this.state.rcAttributeIdentifier && this.rightClickMenuElement() }
			</Box>
		);
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyDesignerStrategy: state.strategyDesignerStrategy
  };
};

export default connect(mapStateToProps)(StrategyDesignerRuleList);
