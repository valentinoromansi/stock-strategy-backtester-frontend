import React from 'react';
import './App.css';
import Main from './components/main';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    "fontSize": 16,
    "fontWeightLight": 300,
    "fontWeightRegular": 500,
    "fontWeightMedium": 600
   },
   components: {
    MuiList: {
      styleOverrides: {
        root: {
          boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.5)"
        }
      }
    }
   }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Main></Main>
      </div>
    </ThemeProvider>
  );
}

export default App;
