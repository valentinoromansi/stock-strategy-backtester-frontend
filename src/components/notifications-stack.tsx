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
import { Button, Collapse, Grid, List, ListSubheader, MenuItem, Select, Stack, Typography } from "@mui/material";
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
import { Strategy } from "models/strategy";
import { BacktestResult } from "models/backtest-result";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { runInThisContext } from "vm";
import LoadingIcons from 'react-loading-icons'

type PropsType = {
  notifications?: Notification[]
}

type StateType = {
}

const notificationDuration = 2

export class Notification {
  id?: number
  type: AlertColor
  message: string
  creationDate: Date
  fetching: boolean
  constructor(type: AlertColor, message: string, fetching: boolean = false) {
    this.type = type
    this.message = message
    this.fetching = fetching
    this.creationDate = new Date()
  }
}



class NotificationsStack extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
  }
  
  
  componentDidMount(): void {
    setInterval(() => {
      this.handleMessageRemoval()
    }, 200);
  }

  handleMessageRemoval() {
    const date = new Date()
    this.props.notifications.forEach(notification => {
      if(!notification.fetching && this.didNotificationExpire(notification, date)){
        actions.removeNotification(notification.id)
      }
    });
  }

  didNotificationExpire(notification: Notification, date: Date) {
    return (date.getSeconds() - notification.creationDate.getSeconds() > notificationDuration)
  }
  
  render() {
    return (          
          <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} open={true} autoHideDuration={6000} sx={{padding: '8px', gap: '6px'}}>
            <Box sx={{gap: '6px', display: 'flex', flexDirection: 'column', alignItems: 'end'}}>
              {
                this.props.notifications?.map((notification) => {
                  return(
                    <MuiAlert key={notification.id} severity={notification.type} variant="filled">
                      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} >
                      <Typography color={'white'}>{notification.message}</Typography>
                      {
                        notification.fetching &&
                        <Box width='2rem' height='2rem' sx={{paddingLeft: '8px'}}>
                          <LoadingIcons.SpinningCircles speed={1.5} width='2rem' height='2rem'/>
                        </Box>
                      }
                      </Box>
                    </MuiAlert>
                  )
                })
              }
            </Box>
          </Snackbar>
    );
  }

}



const mapStateToProps = (state: reducer.StateType) => {
  return {
    notifications: state.notifications
  };
};

export default connect(mapStateToProps)(NotificationsStack);