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
import { Box, Button, Divider, Grid, ListItem, ListItemIcon, ListSubheader, Typography } from "@mui/material";
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

  isStrategySelected(strategy: Strategy) {
    return strategy?.name == this.props.selectedStrategy?.name
  }
  

  render() {

    return (
      <Box>
        <SpinnerComponent loading={this.props.strategiesFecthing} position="centered" />
        <List
          sx={{ paddingBottom: '10px', borderRadius: '8px'} }
          subheader={
            <Typography>Strategy list</Typography>
          }>
          <Divider sx={{margin: '8px'}} variant='middle' orientation="horizontal" flexItem />

          {!this.props.strategiesFecthing &&
            this.props.strategies.map((strategy) => (
            <ListItem selected={ this.isStrategySelected(strategy)} sx={{margin: 0, padding: 0, borderRadius: '8px'}}>
              <Grid container alignItems='center'>
                {/* Strategy name */}
                <Grid item xs={9}>
                  <ListItemButton sx={{ height: 'auto', borderRadius: '8px', contain:'content'}} onClick={() => this.selectStrategy(strategy.name)}>
                    { <Typography>{strategy.name}</Typography>  }
                  </ListItemButton>
                </Grid>
                {/* Strategy edit */}
                <Grid item xs={3}>
                  <ListItemButton sx={{ paddingRight: 0, paddingLeft: 0, height: 'auto', borderRadius: '8px'}} onClick={() => this.editStrategy(strategy.name) }>
                    {
                    <ListItemIcon sx={{ paddingRight: 0, height: 'auto', minWidth: 'auto', margin: 'auto' }} >
                        <EditIcon fontSize='large' />
                    </ListItemIcon>
                    }           
                  </ListItemButton>
                </Grid>
              </Grid>
            </ListItem>
            ))
          }

          <Divider variant='middle' sx={{ marginTop: '4px', marginBottom: '12px' }} orientation="horizontal" flexItem />
          <Box sx={{display: "flex", flexDirection: "column"}}>
            <Button sx={{width: "auto", padding: "10px 20px" }} variant="contained" endIcon={<AddCircleOutlineIcon/>} onClick={() => this.addNewStrategy()}>
              add strategy
            </Button>
          </Box>
      </List>
      </Box>
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
