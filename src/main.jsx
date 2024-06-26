import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.jsx'
import './scss/index.css'
import  './scss/styles.scss'
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from './Services/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <UserProvider>
    <App />
    </UserProvider>,
)
