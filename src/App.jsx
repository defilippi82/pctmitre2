import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Login } from "./components/Login";
import {Corrida} from "./components/Corrida";
import {Administracion} from "./components/Administracion";
import {RegistrarOperadores} from "./components/RegistrarOperadores";
import {EditarOperadores} from "./components/EditarOperadores";
import { RegistroConductores } from "./components/RegistroConductores";
import { RegistroGuardaTren } from "./components/RegistroGuardaTren";
import {EditarConductores} from "./components/EditarConductores";
import {EditarGuardaTren} from "./components/EditarGuardaTren";
import {Padron} from "./components/Padron";
import { Emergencias} from "./components/Emergencias"
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
          <Route path="/operadores/edit/:id" element={<EditarOperadores/>} />
          <Route path="/administracion" element={<Administracion/>} />
          <Route path="/emergencias" element={<Emergencias />} />
          <Route path="/partes" element="Aca se ven los partes de Regularidad" />
          <Route path="/art" element="Formulario para ARTs " />
          <Route path="/barreras" element="Aca se ven los pendientes de barreras" />
          <Route path="/conductores/create" element={<RegistroConductores/>} />
          <Route path="/conductores/edit/:id" element={<EditarConductores/>} />
          <Route path="/guardatren/create" element={<RegistroGuardaTren/>} />
          <Route path="/guardatren/edit/:id" element={<EditarGuardaTren/>} />
          <Route path="/padron" element={<Padron/>} />
          <Route path="/corrida" element={<Corrida/>} />
          <Route path="/listaspersonal" element="aca SE VE COMPONENTE LISTAS DE PERSONAL" />

          
        </Routes>
          <Footer/>
        
        
   
        </UserProvider>
      </Router>
    </div>
    
  )
}


