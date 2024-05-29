import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.jsx'
import './scss/index.css'
import  "./scss/styles.scss"
import { UserProvider } from './components/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  
    <UserProvider>
    <App />
    </UserProvider>,
)
