import React, { Component } from 'react';
import './App.css';
import Main from './components/main';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { Button, CssBaseline, FormControlLabel, GlobalStyles, styled, Switch } from "@mui/material";
import { threadId } from 'worker_threads';
import { runInThisContext } from 'vm';
import * as storage from 'browser-storage/browser-storage';
import * as materialStyle from 'styles/material-style'
 

type ThemeType = 'light' | 'dark'
  type StateType = {
    theme: ThemeType
  }


class App extends Component<any, StateType> {

  defaultTheme: ThemeType = 'dark'

  constructor(props: any) {
    super(props);
    this.state = {
      theme: storage.getItem('local', 'theme') ?? this.defaultTheme
    }
    this.switchThemeMode = this.switchThemeMode.bind(this)
  }



  switchThemeMode() {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark'
    this.setState({theme: newTheme})
    storage.setItem('local', 'theme', newTheme)
  }

  render() {
    const theme = (this.state.theme === 'light') ? materialStyle.lightTheme : materialStyle.darkTheme
    const backgroundColor = (this.state.theme === 'light') ? materialStyle.lightTheme.palette.background.default : materialStyle.darkTheme.palette.background.default 
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles
            styles={{
              body: { backgroundColor: backgroundColor },
            }}
          />
        <materialStyle.MaterialUISwitch theme={theme} sx={{ position: 'fixed', zIndex: 5, right: 0, margin: '6px'}} onChange={this.switchThemeMode} defaultChecked />
        <div className="App">
          <Main></Main>
        </div>
      </ThemeProvider>
    );
  }

}

export default App;
