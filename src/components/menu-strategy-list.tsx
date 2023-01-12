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
import { Box, Button, Divider, Grid, ListItemIcon, ListSubheader, Typography } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


type PropsType = {
  strategies: Strategy[],
  strategiesFecthing: boolean,
  selectedStrategy: Strategy
}

type StateType = {
}


class MenuStrategyList extends Component<PropsType, StateType> {
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
        <List 
          sx={{ paddingBottom: '10px', bgcolor: 'background.paper', borderRadius: '6px'} }
          subheader={
            <Typography sx={{ padding: '10px' }}>Strategy list</Typography>
        }>
          <Divider variant='middle' sx={{ }} orientation="horizontal" flexItem />
          <SpinnerComponent loading={this.props.strategiesFecthing} position="centered" />         
          {!this.props.strategiesFecthing &&
            this.props.strategies.map((strategy) => (
            <Grid container alignItems='center'>
              {/* Strategy name */}
              <Grid item xs={9}>
                <ListItemButton sx={{ height: 'auto', borderRadius: '8px', contain:'content'}} onClick={() => this.selectStrategy(strategy.name)}>
                  { <Typography>{strategy.name}</Typography>  }
                </ListItemButton>
              </Grid>
              {/* Strategy edit */}
              <Grid item xs={3}>
                <ListItemButton sx={{ paddingRight: 0, paddingLeft: 0, height: 'auto', borderRadius: '8px'}} onClick={() => this.editStrategy(strategy.name)}>
                  {
                  <ListItemIcon sx={{ paddingRight: 0, height: 'auto', minWidth: 'auto', margin: 'auto' }} >
                      <EditIcon fontSize='large' />
                  </ListItemIcon>
                  }           
                </ListItemButton>
              </Grid>
            </Grid>     
            ))
          }
          <Divider variant='middle' sx={{ paddingTop: '10px', marginBottom: '10px' }} orientation="horizontal" flexItem />
          <Box sx={{display: "flex", flexDirection: "column", paddingLeft: '8px', paddingRight: '8px'}}>
            <Button sx={{width: "auto", paddingLeft: '8px', paddingRight: '8px' }} variant="contained" endIcon={<AddCircleOutlineIcon/>} onClick={() => this.addNewStrategy()}>
              add strategy
            </Button>
          </Box>
      </List>
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

export default connect(mapStateToProps)(MenuStrategyList);
