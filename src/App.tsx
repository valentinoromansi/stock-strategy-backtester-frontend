import React, { Component } from 'react';
import './App.css';
import Main from './components/main';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { Button, CssBaseline, FormControlLabel, GlobalStyles, styled, Switch } from "@mui/material";
import { threadId } from 'worker_threads';
import { runInThisContext } from 'vm';


const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    "fontSize": 16,
    "fontWeightLight": 300,
    "fontWeightRegular": 500,
    "fontWeightMedium": 600
   },
   components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#56657f',
          fontWeight: '600'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)"
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: 0
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background:'#1976d2',
          '&:hover': {
            background: '#1361ad'
          }
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background:'#1976d2',
          '&:hover': {
            background: '#1361ad'
          }
        }
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          boxShadow: '-1px 0px 8px 0px rgba(0,0,0,0.2)',
          padding: "12px"
        }
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: "aliceblue"
         },
        }
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: "none"
         }         
        }
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          padding: '8px 16px'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px'
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {        
        selectLabel: {
          margin: 0
        },
        displayedRows: {
          margin: 0
        }
      }
    }
   }
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#161616'
    },
    primary: {
      main: '#3b31fb'
    }
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    "fontSize": 16,
    "fontWeightLight": 400,
    "fontWeightRegular": 500,
    "fontWeightMedium": 600
  },
   components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#acb5c4',
          fontWeight: '500'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "-1px 0px 8px 0px rgba(0,0,0,0.2)",
          background: '#1b1b1b'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: 0
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          background:'#3b31fb',
          '&:hover': {
            background: '#3027d9'
          }
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background:'#3b31fb',
          '&:hover': {
            background: '#3027d9'
          }
        }
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          boxShadow: '-1px 0px 8px 0px rgba(0,0,0,0.2)',
          padding: "12px",
          background: '#1b1b1b'
        }
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: "#222222",
          }
        }
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: "none",
            color: "none"
         }         
        }
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          background: '#1b1b1b'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px',
          background: '#1b1b1b'
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {        
        selectLabel: {
          margin: 0
        },
        displayedRows: {
          margin: 0
        }
      },
    }
   }
});

type StateType = {
  theme: 'light' | 'dark'
}





const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: "theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be'",
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));




class App extends Component<any, StateType> {

  constructor(props: any) {
    super(props);
    this.state = {
      theme: 'dark'
    }
    this.switchThemeMode = this.switchThemeMode.bind(this)
  }



  switchThemeMode() {
    this.setState({theme: this.state.theme === 'dark' ? 'light' : 'dark'})
  }

  render() {
    const theme = (this.state.theme === 'light') ? lightTheme : darkTheme
    const backgroundColor = (this.state.theme === 'light') ? lightTheme.palette.background.default : darkTheme.palette.background.default 
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles
            styles={{
              body: { backgroundColor: backgroundColor },
            }}
          />
        <MaterialUISwitch theme={theme} sx={{ position: 'fixed', zIndex: 5, right: 0, margin: '6px'}} onChange={this.switchThemeMode} defaultChecked />
        <div className="App">
          <Main></Main>
        </div>
      </ThemeProvider>
    );
  }

}

export default App;
