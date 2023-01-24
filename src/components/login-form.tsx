import { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../state/actions";
import "apercu-font";
import { Grid, Typography, TextField, Button, Paper} from "@mui/material";
import * as reducer from '../state/reducers';
import 'dotenv/config'


type PropsType = {
	authenticate?: boolean,
	authenticationFetching: boolean
}
type StateType = {
	username: string,
	password: string
}



class LoginForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
		this.state = {
			username: process?.env?.REACT_APP_DEFAULT_USER,
			password: process?.env?.REACT_APP_DEFAULT_PASSWORD
		}
		this.changeUsername = this.changeUsername.bind(this)
		this.changePassword = this.changePassword.bind(this)
		this.login = this.login.bind(this)
  }

	// sends credentials for authentication and on successful authentication saves received access token in session storage 
  login() {
		if(!this.state?.username || !this.state?.password)
			return
		actions.authenticateCredentials({ username: this.state.username, password: this.state.password})
  }

	changeUsername(event) {
		this.setState({username: event?.target?.value})
	}

	changePassword(event) {
		this.setState({password: event?.target?.value})
	}

  
  render() {

    return (
			<Grid
  			container
  			spacing={0}
  			direction="column"
  			justifyContent="center"
				alignItems="center"
  			style={{ width: '100%', height: '80vh'}}>
  				<Paper style={{width: "min(300px, 100%)", padding: '24px', paddingBottom:'24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)"}}>
						<Typography fontSize='large' sx={{width: 'auto', padding: '16px'}}>LOGIN</Typography>
						<TextField sx={{width: 'auto'}} label="Username" defaultValue={this.state.username} onChange={this.changeUsername}/>
						<TextField sx={{width: 'auto'}} label="Password" type="password" defaultValue={this.state.password} onChange={this.changePassword}/>
						<Button sx={{width: 'auto', padding: '16px'}} onClick={this.login} variant="contained" disabled={this.props.authenticationFetching}>
							<Typography sx={{color: 'white'}}>LOGIN</Typography>
						</Button>
  				</Paper>  						 
			</Grid> 

    );
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
		authentication: state.authenticated,
		authenticationFetching: state.authenticationFetching
	};
};

export default connect(mapStateToProps)(LoginForm);
