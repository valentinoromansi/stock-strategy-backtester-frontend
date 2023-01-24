import React, { Component } from "react";
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
	ruleIndex?: number | null,
	mainAttributeIndex?: AttributeId,
	subAttributeIndex?: AttributeId,
	isEnterTradeRule?: boolean,
	isStoplossRule?: boolean
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
			this.AttributeElement = this.AttributeElement.bind(this)
			this.PositionSelectElement = this.PositionSelectElement.bind(this)
			this.AttributeSelectElement = this.AttributeSelectElement.bind(this)
			this.PercentageElement = this.PercentageElement.bind(this)
			this.RightClickMenu = this.RightClickMenu.bind(this)
			this.ToogleAttributeTypeElement = this.ToogleAttributeTypeElement.bind(this)
			this.addNewRule = this.addNewRule.bind(this)
			this.configureRightClick()
		}
		

		// Disable default right click and set flags for right click when mouse is hovering attribute element
		configureRightClick() {
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
					Object.values(enumType).map((value, i) => (
						<MenuItem key={i} value={value}>
							<Typography>{prefix + '' + value}</Typography>
						</MenuItem>
					))
				}
			</Select>
		)
	}

	AttributeSelectElement(props: {attributeIdentifier: AttributeIdentifier, currentValue: AttributeType}): any {
		const { attributeIdentifier, currentValue } = props
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
	
	PositionSelectElement(props: { currentValue: Position, ruleIndex: number }): any {
		const { currentValue, ruleIndex } = props
		const onChange = (value) => {
			let newStrategy = this.props.strategyDesignerStrategy
			newStrategy.strategyConRules[ruleIndex].position = value
			actions.setStrategyDesignerStrategy(newStrategy)
		}
		return (
			this.selectElement(null, currentValue, '', Position, onChange)
		)
	}

	PercentageElement(props: {percent: number, attributeIdentifier: AttributeIdentifier}): JSX.Element {
		const { percent, attributeIdentifier } = props
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
					value={percent === 0 ? '' : percent}
					endAdornment={
						<InputAdornment className={styles.strategyDesignerSidebarListItemRuleValuePercentSymbol} position="end">
							<Typography>%</Typography>
						</InputAdornment>}
				/>
					
			</Box>
		)
	}
	
	AttributeElement(props: { attributeIdentifier: AttributeIdentifier }): any {
		const { attributeIdentifier } = props
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
						{ (rule()?.attribute1) && 
							<this.AttributeSelectElement attributeIdentifier={getAttributeIdentifier(AttributeId.ATTRIBUTE1)} currentValue={rule()?.attribute1}/> 
						}
					</div>
				}
				{ /* Relative attribute */ }
				{
					rule()?.isRelative &&
					<React.Fragment>
						{ /* Attributes */}
						<div className={styles.strategyDesignerSidebarListItemRuleValueRelative}>
							{ (rule()?.attribute1) && 
								<this.AttributeSelectElement attributeIdentifier={getAttributeIdentifier(AttributeId.ATTRIBUTE1)} currentValue={rule()?.attribute1}/> 
							}
							{ (rule()?.attribute2) && 
								<this.AttributeSelectElement attributeIdentifier={getAttributeIdentifier(AttributeId.ATTRIBUTE2)} currentValue={rule()?.attribute2}/> 
							}
						</div>
						{ /* Vertical divider */}						
						<Divider variant='middle' sx={{ paddingTop: '2px', marginBottom: '2px' }} orientation="vertical" flexItem />  
						{ /* Percentage */}
						<this.PercentageElement
							percent={percent}
							attributeIdentifier={attributeIdentifier}
						/>					
					</React.Fragment>
				}		
			</div>
		)
	}






	ToogleAttributeTypeElement(props: {ruleIndex: number, mainAttributeVarName: string, attributeInRow: boolean, strategyDesignerStrategy: Strategy, rcAttributeIdentifier: AttributeIdentifier }) : JSX.Element {
		const { ruleIndex, mainAttributeVarName, attributeInRow, strategyDesignerStrategy, rcAttributeIdentifier } = props
		const isRelative = () => {
			if(attributeInRow)
				return strategyDesignerStrategy.strategyConRules?.[ruleIndex]?.[mainAttributeVarName]?.isRelative
			else if(rcAttributeIdentifier.isEnterTradeRule)
				return strategyDesignerStrategy.enterValueExRule.isRelative
			else if(rcAttributeIdentifier.isStoplossRule)
				return strategyDesignerStrategy.stopLossValueExRule.isRelative
		}
		let onToogleClick = (isRelative: boolean) => {
			if(attributeInRow) {
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].isRelative = isRelative
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].attribute2 = isRelative ? AttributeType.OPEN : null
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].percent = isRelative ? 0 : null
			}
			else if(rcAttributeIdentifier.isEnterTradeRule) {
				strategyDesignerStrategy.enterValueExRule.isRelative = isRelative
				strategyDesignerStrategy.enterValueExRule.attribute2 = isRelative ? AttributeType.OPEN : null
				strategyDesignerStrategy.enterValueExRule.percent = isRelative ? 0 : null
			}
			else if(rcAttributeIdentifier.isStoplossRule) {
				strategyDesignerStrategy.stopLossValueExRule.isRelative = isRelative
				strategyDesignerStrategy.stopLossValueExRule.attribute2 = isRelative ? AttributeType.OPEN : null
				strategyDesignerStrategy.stopLossValueExRule.percent = isRelative ? 0 : null
			}
			this.setState({rcMenuAnchorElement: null})
			actions.setStrategyDesignerStrategy(strategyDesignerStrategy)
		}		
		return(
			<ToggleButtonGroup color="primary" value={isRelative()}	exclusive	aria-label="Platform">
				<ToggleButton onClick={(e) => { onToogleClick(false)}} value={false}>Simple</ToggleButton>
				<ToggleButton onClick={(e) => { onToogleClick(true)}} value={true}>Relative</ToggleButton>
			</ToggleButtonGroup>
		)	
	}


	RightClickMenu() : JSX.Element  {
		const strategyDesignerStrategy = this.props.strategyDesignerStrategy
		const rcAttributeIdentifier = this.state.rcAttributeIdentifier

		const attributeInRow = !rcAttributeIdentifier.isEnterTradeRule && !rcAttributeIdentifier.isStoplossRule 
		const ruleIndex = attributeInRow ? rcAttributeIdentifier?.ruleIndex : null
		const mainAttributeVarName = attributeInRow ? mainAttributeVarNameMap[rcAttributeIdentifier?.mainAttributeIndex] : null

		// Change id for attribute and save to redux state
		const setId = (id: number) => {
			if(attributeInRow)
				strategyDesignerStrategy.strategyConRules[ruleIndex][mainAttributeVarName].id = id
			else if(rcAttributeIdentifier.isEnterTradeRule)
				strategyDesignerStrategy.enterValueExRule.id = id
			else if(rcAttributeIdentifier.isStoplossRule)
				strategyDesignerStrategy.stopLossValueExRule.id = id
			actions.setStrategyDesignerStrategy(strategyDesignerStrategy)
		}
		// For changing attribute slice id
		const onChangeVsId = (newAttributeSliceIdStr: string) => {
			const newAttributeSliceId = Number(newAttributeSliceIdStr)
			if(newAttributeSliceIdStr === '') {
				setId(0)
				return
			}
			if(isNaN(newAttributeSliceId) || (newAttributeSliceId <= 0 && newAttributeSliceIdStr.length === 1) || newAttributeSliceId > 99)
				return
			setId(newAttributeSliceId)
		}		
		const idToDisplay = () : number => {
			if(attributeInRow)
				return strategyDesignerStrategy?.strategyConRules?.[ruleIndex]?.[mainAttributeVarName]?.id
			else if(rcAttributeIdentifier.isEnterTradeRule)
				return strategyDesignerStrategy.enterValueExRule.id
			else if(rcAttributeIdentifier.isStoplossRule)
				return strategyDesignerStrategy.stopLossValueExRule.id
		}
		// on delete
		let onDelete = (ruleIndex: number) => {
			if(!attributeInRow)
				return
			let newStrategy = deepCopy(strategyDesignerStrategy)
			newStrategy.strategyConRules.splice(ruleIndex, 1)
			actions.setStrategyDesignerStrategy(newStrategy)
			this.setState({rcMenuAnchorElement: null})
		}
		return(
			<Menu id="menu" anchorEl={this.state.rcMenuAnchorElement} MenuListProps={{'aria-labelledby': 'basic-button'}} 
				open={this.state.rcMenuAnchorElement != null && this.state.canOpenRcMenu}
				onClose={() => {this.setState({rcMenuAnchorElement: null})}}>
					<Box sx={{ padding: "4px", gap: "8px", flexDirection: "column", display: "flex"}}>
					<TextField style={{ width: "100%"}} value={isNaN(idToDisplay()) ? '' : idToDisplay()} label="Vertical slice id" onChange={(e) => { onChangeVsId(e.target.value) }} />
					<div>
						<this.ToogleAttributeTypeElement
							ruleIndex={ruleIndex}
							mainAttributeVarName={mainAttributeVarName}
							attributeInRow={attributeInRow}
							strategyDesignerStrategy={strategyDesignerStrategy}
							rcAttributeIdentifier={rcAttributeIdentifier}
						/>
					</div>
				{
					attributeInRow &&
					<Button onClick={(e) => { onDelete(ruleIndex) }} variant="outlined" color="error"> DELETE </Button>
				}
				</Box>
		   	</Menu>
		)
	}







	initialRule = new ConditionalRule({
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
	})

	addNewRule() {
		let newStrategy: Strategy = deepCopy(this.props.strategyDesignerStrategy)
		newStrategy.strategyConRules.push(deepCopy(this.initialRule))
		actions.setStrategyDesignerStrategy(newStrategy)
		this.setState({rcMenuAnchorElement: null})
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
						<div className={styles.strategyDesignerSidebarListItem} key={i}>
							{/* simple/relative attribute 1 */}
							<this.AttributeElement attributeIdentifier={{ ruleIndex: i, mainAttributeIndex: AttributeId.ATTRIBUTE1}}/>
							{/* Rule condition */}
							<this.PositionSelectElement currentValue={rule.position} ruleIndex={i} />
							{/* simple/relative attribute 2 */}
							<this.AttributeElement attributeIdentifier={{ ruleIndex: i, mainAttributeIndex: AttributeId.ATTRIBUTE2}}/>
						</div>
        	))
        }

				{/* Add new rule */}
				<Box sx={{display: 'flex', justifyContent: 'start', paddingTop: '4px', paddingBottom: '4px'}}>
					<Button sx={{padding: "10px 20px" }} variant="contained" endIcon={<AddCircleOutlineIcon fontSize="large"/>} onClick={this.addNewRule}>add rule</Button>
				</Box>
				<Divider variant='middle' sx={{ marginTop: '12px', marginBottom: '12px'}} orientation="horizontal" />  		

				{/* Attribute select for entering trade or stoploss */}
				<Box className={styles.strategyDesignerSidebarListItemEnterStoplossAttributes}>
					<Box style={{display: "flex", flexDirection: 'column', width: '25%'}}>
						<Typography>Enter trade rule</Typography>
						<this.AttributeElement attributeIdentifier={{ isEnterTradeRule: true }}/>
					</Box>
					<Divider variant='middle' orientation="vertical" sx={{height: 'auto', margin: 0, marginTop: "4px"}} />  		
					<Box style={{display: "flex", flexDirection: 'column', width: '25%'}}>
						<Typography>Stop-loss rule</Typography>
						<this.AttributeElement attributeIdentifier={{ isEnterTradeRule: false, isStoplossRule: true}}/>
					</Box>
				</Box>

				{/* Right click rule menu */}
				{ this.props.strategyDesignerStrategy && this.state.rcAttributeIdentifier && 
					<this.RightClickMenu/> 
				}
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
