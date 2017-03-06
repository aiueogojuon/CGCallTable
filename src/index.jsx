import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {fullBlack, darkBlack} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar'

import { App } from './components/App'
import './styles'

injectTapEventPlugin()

const muiTheme = getMuiTheme({
  fontFamily: 'Noto Sans Japanese, sans-serif',
  palette: {
    primary1Color: fullBlack,
    primary2Color: darkBlack,
  },
  appBar: {
    height: 50,
  },
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('app'),
)
