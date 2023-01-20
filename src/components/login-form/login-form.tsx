import React, { Component, CSSProperties } from "react";
import { connect } from "react-redux";

import * as actions from "../../state/actions";
import "apercu-font";
import { Divider, Grid, List, ListItemButton, ListSubheader, Typography, TextField, Button} from "@mui/material";
import Box from "@mui/material/Box";
import { authentication, UserCredentials } from "http/http";
import * as reducer from '../../state/reducers';



type PropsType = {
	authenticate?: boolean
}
type StateType = {
	username: string,
	password: string
}



class LoginForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
		this.state = {
			username: 'Ivica',
			password: 'majmun'
		}
		this.changeUsername = this.changeUsername.bind(this)
		this.changePassword = this.changePassword.bind(this)
		this.login = this.login.bind(this)
  }


  login() {
		if(!this.state?.username || !this.state?.password)
			return
		const credentials: UserCredentials = { user: this.state.username, password: this.state.password }
    // call http and check if jwt is returned
		console.log("trying to login with: ")
		console.log(credentials)
    authentication(credentials).then(res => {
    	if(res.accessToken == null)
				console.log(res.message)    	
    	else {
    	    console.log("Successfuly authenticated!!!")
    	    actions.setAuthenticationFlag(true)
    	}
    })
    .catch(error => {
        console.log("AUTH ERROR: " + error)
    })
  }

	changeUsername(event) {
		this.setState({username: event?.target?.value})
	}

	changePassword(event) {
		this.setState({password: event?.target?.value})
	}

  
  render() {
		console.log("XX:" + this.props.authenticate)

    return (
				<Grid
  				container
  				spacing={0}
  				direction="column"
  				justifyContent="center"
					alignItems="center"
  				style={{ width: '100%', height: '100vh'}}>
  				<Box style={{width: "min(300px, 100%)", padding: '16px', borderRadius: '10px', background: 'white', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)"}}>
						<Typography fontSize='large' sx={{width: 'auto', padding: '16px'}}>LOGIN</Typography>
						<TextField sx={{width: 'auto'}} label="Username" defaultValue="Ivica" onChange={this.changeUsername}/>
						<TextField sx={{width: 'auto'}} label="Password" type="password" defaultValue="majmun" onChange={this.changePassword}/>
						<Button sx={{width: 'auto', padding: '16px'}} onClick={this.login} >
							<Typography sx={{color: 'white'}}>LOGIN</Typography>
						</Button>
  				</Box>   						 
				</Grid> 

    );
  }

}


const mapStateToProps = (state: reducer.StateType) => {
  return {
		authentication: state.authenticated
	};
};

export default connect(mapStateToProps)(LoginForm);
