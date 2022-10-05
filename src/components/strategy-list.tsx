import React, { Component } from "react";
import { connect } from "react-redux";
import * as reducer from '../state/reducers';
import { Strategy } from "../models/strategy";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import * as actions from "../state/actions";
import RefreshIcon from '@mui/icons-material/Refresh';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import EditIcon from '@mui/icons-material/Edit';




type PropsType = {
  strategies: Strategy[],
  strategiesFecthing: boolean
}
type StateType = {
  selectedKey: string
}


class StrategyList extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.setState({selectedKey: ''})
  }

  setSelectedStrategy(
    strategyName: string
  ) {
    const strategy: Strategy = this.props.strategies.find((e) => e.name === strategyName)
    actions.setSelectedStrategy(strategy)
    this.setState({selectedKey: strategyName})
  }

  addNewStrategy() {
    alert('add new')
  }
  
  editStrategy(strategyName: string) {
    this.setSelectedStrategy(strategyName)
    alert(strategyName)
  }

  
  addNewStrategyStyle = { py: 0, minHeight: 32, display: 'flex', justifyContent:'center', color: 'white', backgroundColor: '#1976d2', borderRadius: '4px', "&:hover": {backgroundColor: '#1976d2'} }
  
  itemFontStyle = { fontSize: 14, fontWeight: 'bold', color: '#56657f'}
  selectedItemFontStyle = { fontSize: 14, fontWeight: 'bold', color: '#1976d2'}
  getItemFontStyle(strategyKey: string): any {
    return this.state?.selectedKey === strategyKey ? this.selectedItemFontStyle : this.itemFontStyle
  }
  
  strategyListItemButtonStyle = { py: 0, minHeight: 32, color: '#212936', "&:hover": {backgroundColor: '#212936'} }
  selectedStrategyListItemButtonStyle = { py: 0, minHeight: 32, backgroundColor: '#2b3648', borderBottomLeftRadius: '4px', borderTopLeftRadius: '4px', "&:hover": {backgroundColor: '#2b3648'}}
  getItemButtonStyle(strategyKey: string): any {
    return this.state?.selectedKey === strategyKey ? this.selectedStrategyListItemButtonStyle : this.strategyListItemButtonStyle
  }

  editItemButtonStyle = { display: 'flex', justifyContent: "center", padding: 0, backgroundColor: '#212936', borderBottomRightRadius: '4px', borderTopRightRadius: '4px'}
  selectedEditItemButtonStyle = { display: 'flex', justifyContent: "center", padding: 0, backgroundColor: '#2b3648', borderBottomRightRadius: '4px', borderTopRightRadius: '4px', "&:hover": {backgroundColor: '#2b3648'}}
  getEditItemButtonStyle(strategyKey: string): any {
    return this.state?.selectedKey === strategyKey ? this.selectedEditItemButtonStyle : this.editItemButtonStyle
  }


  render() {

    const strategyListStyle = {
      width: '10%',
      backgroundColor: '#212936',
      padding: '10px'
    }

    const lineSeparatorStyle = {
      width: '100%',
      borderColor: '#56657f',
      height: '1px'
    }
    
    return (
      <div style={strategyListStyle}>        
        <List component="nav" aria-label="main mailbox folders" style={{display: 'flex', flexDirection: 'column', rowGap: 6}} >
          {/* Strategy list  */}
          {!this.props.strategiesFecthing &&
            this.props.strategies.map((strategy) => (
            <div style={{display: 'flex', justifyContent:'center'}}>
              {/* Select strategy */}
              <ListItemButton key={strategy.name} sx={this.getItemButtonStyle(strategy.name)} onClick={() => this.setSelectedStrategy(strategy.name)}>
                <ListItemText primary={strategy.name.toUpperCase()} primaryTypographyProps={this.getItemFontStyle(strategy.name)}/>
              </ListItemButton>
              {/* Edit strategy */}
              <ListItemButton style={this.getEditItemButtonStyle(strategy.name)} onClick={() => this.editStrategy(strategy.name)}>
                <EditIcon sx={{ fontSize: 24, fontWeight: 'bold', color: '#56657f'}}/>
              </ListItemButton>
              </div>
            ))
          }
          <hr style={lineSeparatorStyle}/>
        {/* Add new strategy  */}
        <ListItemButton sx={this.addNewStrategyStyle} onClick={() => this.addNewStrategy()}>
          <LibraryAddIcon fontSize="medium"/>
        </ListItemButton>
        </List>


      </div>
    );
  }
}


const mapStateToProps = (state: reducer.StateType) => {
  return {
    strategies: state.strategies,
    strategiesFecthing: state.strategiesFecthing
  };
};

export default connect(mapStateToProps)(StrategyList);
