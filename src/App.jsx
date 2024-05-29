import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Login } from "./components/Login";
import {Corrida} from "./components/Corrida";
import {RegistrarOperadores} from "./components/RegistrarOperadores";
import { RegistroConductores } from "./components/RegistroConductores";
import { RegistroGuardaTren } from "./components/RegistroGuardaTren";
import { NavbarComponent } from './components/Navbar';
import {UserProvider} from "./components/UserContext";
import {Footer} from './components/Footer';
import './scss/App.css'

export const App = () => {
 

  return (
    <div className="App container ">
      <Router>
        <UserProvider>
        <header>
        <NavbarComponent />
        </header>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/operadores/create" element={<RegistrarOperadores/>} />
          <Route path="/administracion" element="aca se VE ADMIN" />
          <Route path="/emergencias" element="aca SE VE COMPONENTE EMERGENCIAS" />
          <Route path="/conductores/create" element={<RegistroConductores/>} />
          <Route path="/conductores/edit/:id" element="aca SE VE COMPONENTE EDIT COND" />
          <Route path="/guardastren/create" element={<RegistroGuardaTren/>} />
          <Route path="/guardastren/edit/:id" element="aca SE VE COMPONENTE EDIT GUARDA" />
          <Route path="/padron" element="aca SE VE COMPONENTE PADRON" />
          <Route path="/corrida" element={<Corrida/>} />
          <Route path="/listaspersonal" element="aca SE VE COMPONENTE LISTAS DE PERSONAL" />

          
        </Routes>
          <Footer/>
        
        
   
        </UserProvider>
      </Router>
    </div>
    
  )
}


