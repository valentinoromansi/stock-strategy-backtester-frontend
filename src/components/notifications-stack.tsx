import { Component } from "react";
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
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