import React, { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import { Strategy } from "../models/strategy";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as actions from "../state/actions";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import EditIcon from '@mui/icons-material/Edit';
import { CSSProperties } from "react";
import { SpinnerComponent } from 'react-element-spinner';
import "apercu-font";
import styles from '../styles/global.module.sass'
import { deepCopy } from "utils/utils";


type PropsType = {
  strategies: Strategy[],
  strategiesFecthing: boolean,
  selectedStrategy: Strategy
}

type StateType = {
}


class StrategyList extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
  }

  selectStrategy(strategyName: string) {
    actions.setStrategyEditorActive(false)
    const strategy: Strategy = this.props.strategies.find((e) => e.name === strategyName)
    actions.setSelectedStrategy(strategy)
  }

  editStrategy(strategyName: string) {
    actions.setStrategyEditorActive(true)
    const strategy: Strategy = this.props.strategies.find((e) => e.name === strategyName)
    actions.setSelectedStrategy(strategy)
    actions.setStrategyDesignerStrategy(strategy)
  }
  
  addNewStrategy() {
    actions.setStrategyEditorActive(true)
    actions.setSelectedStrategy(null)
  }
  

 
  getItemTextClass(strategyKey: string): any {
    return this.props?.selectedStrategy?.name === strategyKey ? styles.strategySelectedItemText : styles.strategyItemTextStyle
  }

  readonly sxStyle = {
    itemButtonStyle: { 
      py: 0, 
      minHeight: 32, 
      color: '#212936', 
      "&:hover": {backgroundColor: '#212936'} 
    },
    selectedItemButtonStyle: { 
      py: 0, 
      minHeight: 32, 
      backgroundColor: '#2b3648', 
      borderBottomLeftRadius: '.4rem', 
      borderTopLeftRadius: '.4rem', 
      "&:hover": {backgroundColor: '#2b3648'}
    },
    editItemButtonStyle: {
      display: 'flex', 
      justifyContent: "center", 
      padding: 0, 
      backgroundColor: '#212936', 
      borderBottomRightRadius: '.4rem', 
      borderTopRightRadius: '.4rem'
    },
    selectedEditItemButtonStyle: { 
      display: 'flex', 
      justifyContent: "center", 
      padding: 0, 
      backgroundColor: '#2b3648', 
      borderBottomRightRadius: '.4rem', 
      borderTopRightRadius: '.4rem', 
      "&:hover": {backgroundColor: '#2b3648'}
    },
    addNewStrategyStyle: { 
      padding: '0.8rem', 
      display: 'flex', 
      justifyContent:'center', 
      color: 'white', 
      backgroundColor: '#1976d2', 
      borderRadius: '4px', 
      "&:hover": {backgroundColor: '#1976d2'} 
    },
    editIcon: { 
      fontSize: '2.4rem', 
      fontWeight: 'bold', 
      color: '#56657f'
    }
  }
  
  getItemButtonStyle(strategyKey: string): any {
    return this.props?.selectedStrategy?.name === strategyKey ? this.sxStyle.selectedItemButtonStyle : this.sxStyle.itemButtonStyle
  }
  
  getEditItemButtonStyle(strategyKey: string): any {
    return this.props?.selectedStrategy?.name === strategyKey ? this.sxStyle.selectedEditItemButtonStyle : this.sxStyle.editItemButtonStyle
  }
  

  render() {
    
    return (
      <div className={styles.strategyListWrapper}>
        <SpinnerComponent loading={this.props.strategiesFecthing} position="centered" />
        <List component="nav" aria-label="main mailbox folders" className={styles.strategyList}>
          {/* Strategy list  */}
          {!this.props.strategiesFecthing &&
            this.props.strategies.map((strategy) => (
            <div className={styles.strategyItemWrapper}>
              {/* Select strategy */}
              <ListItemButton key={strategy.name} sx={this.getItemButtonStyle(strategy.name)} onClick={() => this.selectStrategy(strategy.name)}>
                <ListItemText disableTypography primary={strategy.name.toUpperCase()} className={this.getItemTextClass(strategy.name)}/>
              </ListItemButton>
              {/* Edit strategy */}
              <ListItemButton sx={this.getEditItemButtonStyle(strategy.name)} onClick={() => this.editStrategy(strategy.name)}>
                <EditIcon sx={this.sxStyle.editIcon}/>
              </ListItemButton>
              </div>
            ))
          }
          <hr className={styles.strategyLineSeparator}/>
        {/* Add new strategy  */}
        <ListItemButton sx={this.sxStyle.addNewStrategyStyle} onClick={() => this.addNewStrategy()}>
          <LibraryAddIcon sx={{fontSize: '2rem'}} />
        </ListItemButton>
        </List>
      </div>
    );
  }
}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    strategies: state.strategies,
    strategiesFecthing: state.strategiesFecthing,
    selectedStrategy: state.selectedStrategy
  };
};

export default connect(mapStateToProps)(StrategyList);
