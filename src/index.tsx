import CssBaseline from '@mui/material/CssBaseline'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import 'resize-observer-polyfill/dist/ResizeObserver.global'

import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.scss'

// import App from './App'
import App from './App'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.Fragment>
    <CssBaseline />
    <App />
  </React.Fragment>
)
