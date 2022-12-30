import { Component } from "react";
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


type PropsType = {
  selectedStrategy: Strategy
}

type StateType = {
	selectedStrategy: Strategy,
	sidebarVisible: boolean
}

class StrategyDesigner extends Component<PropsType, StateType> {
	readonly enterTradeColor: string  = 'white'
	readonly profitColor: string = '#00ff00'
	readonly lossColor: string = '#ff0000'
	readonly indecisiveColor: string = '#3e3e3e'

  constructor(props: PropsType) {
    super(props);
		this.state = {
			selectedStrategy: props.selectedStrategy,
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

	attributeSelectElement(currentVal: AttributeType, ruleIndex: number, topLvlAttributeNum: 1 | 2, lowLvlAttributeNum: 1 | 2): any {
		const changeAttribute = (value) => {
			let newSelectedStrategy = this.state.selectedStrategy
			const topLvlAttribute = (topLvlAttributeNum == 1) ? "valueExtractionRule1" : "valueExtractionRule2"
			const lowLvlAttribute = (lowLvlAttributeNum == 1) ? "attribute1" : "attribute2"
			newSelectedStrategy.strategyConRules[ruleIndex][topLvlAttribute][lowLvlAttribute] = value
			this.setState({selectedStrategy: newSelectedStrategy})
		}
		return (
			<Select 
			className={styles.strategyDesignerSidebarSelectAttribute} 
			onChange={(e: SelectChangeEvent) => { changeAttribute(e.target.value) }} 
			value={currentVal}>
				{
					Object.values(AttributeType).map((value) => (
						<MenuItem value={value}>{value}</MenuItem>
					))
				}
  		</Select>
		)
	}

	positionSelectElement(currentVal: Position, ruleIndex: number): any {
		const changePosition = (value) => {
			let newSelectedStrategy = this.state.selectedStrategy
			newSelectedStrategy.strategyConRules[ruleIndex].position = value
			this.setState({selectedStrategy: newSelectedStrategy})
		}
		return (
			<Select 
				className={styles.strategyDesignerSidebarSelectPosition} 
				onChange={(e: SelectChangeEvent) => { changePosition(e.target.value) }} 
				value={currentVal}>
				{
					Object.values(Position).map((value) => (
						<MenuItem value={value}>{value}</MenuItem>
					))
				}
  		</Select>
		)
	}

	ruleValueElement(rule: ValueExtractionRule, ruleIndex: number, topLvlAttributeNum: 1 | 2): any {
		const isRelative: boolean = rule?.percent > 0
		const percent = (rule?.percent) ? rule?.percent * 100 + '%': ''
		return ( 
			<div className={styles.strategyDesignerSidebarListItemRuleValueWrapper}>
				{/* value */}
				<div className={styles.strategyDesignerSidebarListItemRuleValue}>
					{
						(rule?.attribute1) && this.attributeSelectElement(rule?.attribute1, ruleIndex, topLvlAttributeNum, 1)
					}
					{
						(rule?.attribute2) && this.attributeSelectElement(rule?.attribute2, ruleIndex, topLvlAttributeNum, 2)
					}
				</div>				
				{/* vertical divider */}
				{
					isRelative &&
					<div className={styles.strategyDesignerSidebarListItemRuleValueDivider}></div>					
				}
				{/* percentage */}
				{
					isRelative &&					
					<div className={styles.strategyDesignerSidebarListItemRuleValuePercent}>
						<OutlinedInput
						  id="sandbox"
							value={percent}
							endAdornment={<InputAdornment position="end">kg</InputAdornment>}/>
					</div>
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
								{/* Rule value 1 */}
								{
									this.ruleValueElement(rule?.valueExtractionRule1, i, 1)
								}
								{/* Rule condition */}
								{
									this.positionSelectElement(rule.position, i)
								}
								{/* Rule value 2 */}
								{
									this.ruleValueElement(rule?.valueExtractionRule2, i, 2)
								}
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
