import React, { Component, CSSProperties, useEffect, useRef, useState } from "react";
import { StrategyReport } from "../models/strategy-report";
import StrategyReportTable from "./strategy-report-table/strategy-report-table";
import MenuMainActions from './menu-main-actions'
import MenuStrategyList from './menu-strategy-list'
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import GraphWithTradeMarkings from "./graph-with-trade-markings/graph-with-trade-markings";
import styles from '../styles/global.module.sass'
import StrategyDesigner from "./strategy-designer/strategy-designer";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Collapse, Grid, List, ListSubheader, Typography } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import EditIcon from '@mui/icons-material/Edit';


type PropsType = {
  strategyEditorActive: boolean
}
type StateType = {
  strategyBacktestResults?: StrategyReport,
  graphWidth: number,
  graphHeight: number,
  actionMenuOpened: boolean
}

class Main extends Component<PropsType, StateType> {

  constructor(props: PropsType) {
    super(props);
    this.handleActionMenuClick = this.handleActionMenuClick.bind(this)
    actions.getStrategies();
    actions.getStrategyReports();
    
    this.state = {
      graphWidth: this.getGraphSize().width,
      graphHeight: this.getGraphSize().height,
      actionMenuOpened: true
    }
    

    this.handleResize = this.handleResize.bind(this)    
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ 
      graphWidth: this.getGraphSize().width,
      graphHeight: this.getGraphSize().height
    })
  }

  getGraphSize(): { width: number, height: number} {
    return {
      width: window.innerWidth * 0.9,
      height: window.innerHeight * 0.6
    }
  }

  handleActionMenuClick() {
    this.setState({actionMenuOpened: !this.state.actionMenuOpened})
  }

  actionListEl() {
    return (
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', borderRadius: '8px'} }
        component="nav"
        aria-labelledby="nested-list-subheader"        
      >
        <Collapse in={this.state.actionMenuOpened} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Grid container alignItems='center'>
              <Grid item xs={9}>
                <ListItemButton sx={{ height: 'auto', borderRadius: '8px', contain:'content'}}>
                  { <Typography>nakjds dasd</Typography>  }
                </ListItemButton>
                <ListItemButton sx={{ height: 'auto', borderRadius: '8px'}}>
                  { <Typography>nakjds dad asd asdasd</Typography>  }
                </ListItemButton>
                <ListItemButton sx={{ height: 'auto', borderRadius: '8px'}}>
                  { <Typography>nakjds dasd</Typography>  }
                </ListItemButton>
              </Grid>
              <Grid item xs={3}>
                <ListItemButton sx={{ paddingRight: 0, paddingLeft: 0, height: 'auto', borderRadius: '8px'}}>
                  {
                  <ListItemIcon sx={{ paddingRight: 0, height: 'auto', minWidth: 'auto', margin: 'auto' }} >
                      <EditIcon fontSize='large' />
                  </ListItemIcon>
                  }           
                </ListItemButton>
              </Grid>
            </Grid>                
          </List>
        </Collapse>
      </List>
    )
  }



  render() {

    const { graphWidth, graphHeight} = this.state

    return (
      <div>
        <Box sx={{ width: '100%', padding: '24px' }}>
          <Box sx={{ width: 'auto', display:'flex', flexDirection: 'row', gap: '16px'}}>
            {/* Action and strategy list */}
            <Box sx={{ width: 'fit-content', display:'flex', flexDirection: 'column', gap: '16px'}}>
              <Box sx={{ width: '180px' }}>
                <MenuMainActions></MenuMainActions>             
              </Box>
              <Box sx={{ width: '180px'}}>
                <MenuStrategyList/>   
              </Box>
            </Box>
            {/* Strategy designer, graph view, report table  */}
            <Box sx={{ bgcolor: 'black', minHeight: '30vh', width: '100%', minWidth: '500px', display:'flex', flexDirection: 'column', gap: '16px'}}>
              {/* Strategy designer*/}
              <Box sx={{ bgcolor: 'gray', minHeight: '30vh', width: '100%', display:'flex', flexDirection: 'column', gap: '16px'}}>
              </Box>
              {/* Graph view */}
              <Box sx={{ bgcolor: 'gray', minHeight: '30vh', width: '100%', display:'flex', flexDirection: 'column', gap: '16px'}}>
              </Box>
              {/* Report table */}
              <Box sx={{ bgcolor: 'gray', minHeight: '30vh', width: '100%', display:'flex', flexDirection: 'column', gap: '16px'}}>
              </Box>
            </Box>
          </Box>
        </Box>
        { 
        //<Navigation/>
        //<div className={styles.underNavStyle}>
        //  <StrategyList/>
        }
          { 
          //<div className={styles.graphBacktestListWrapperStyle}>
          //  {/* Render strategy editor or graph with trade markings */}
          //  {this.props.strategyEditorActive ?
          //    <StrategyDesigner/> :
          //    <div>
          //      <GraphWithTradeMarkings width={graphWidth} height={graphHeight}/>
          //      <StrategyReportTable/>
          //    </div>
          //  }
          //</div>          
        //</div>
          }
      </div>
    );
  }

}



const mapStateToProps = (state: reducer.StateType) => {
  return {
		strategyEditorActive: state.strategyEditorActive
  };
};

export default connect(mapStateToProps)(Main);
