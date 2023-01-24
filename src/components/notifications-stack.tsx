import { Component } from "react";
import * as actions from "../state/actions";
import * as reducer from '../state/reducers';
import { connect } from "react-redux";
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingIcons from 'react-loading-icons'
import { Notification } from "../models/notification";

type PropsType = {
  notifications?: Notification[]
}

type StateType = {
}

const notificationDuration = 3
const messageRemovalCheckInterval = 500

class NotificationsStack extends Component<PropsType, StateType> {

  componentDidMount(): void {
    setInterval(() => {
      this.handleMessageRemoval()
    }, messageRemovalCheckInterval);
  }  

  handleMessageRemoval() {
    const date = new Date()
    this.props.notifications.forEach(notification => {
      const didNotificationExpire = (date.getSeconds() - notification.creationDate.getSeconds() > notificationDuration)
      if(!notification.manuallyClosed && didNotificationExpire){
        actions.removeNotification(notification)
      }
    });
  }
  
  render() {
    return (          
          <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} open={true} sx={{padding: '8px', gap: '6px'}}>
            <Box gap='6px' display='flex' flexDirection='column' alignItems='end'>
              {
                this.props.notifications?.map((notification, i) => {
                  return(
                    <MuiAlert key={i} severity={notification.type} variant='filled'>
                      <Box display='flex' flexDirection='row' alignItems='center' >
                      <Typography color='white'>{notification.message}</Typography>
                      {
                        notification.manuallyClosed &&
                        <Box width='2rem' height='2rem' paddingLeft='8px'>
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