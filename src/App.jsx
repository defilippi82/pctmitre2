import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Login } from "./components/Admin/Login";
import {Administracion} from "./components/Admin/Administracion";
import {RegistrarOperadores} from "./components/Admin/RegistrarOperadores";
import {EditarOperadores} from "./components/Admin/EditarOperadores";
import { RegistroConductores } from "./components/Admin/RegistroConductores";
import { RegistroGuardaTren } from "./components/Admin/RegistroGuardaTren";
import {EditarConductores} from "./components/Admin/EditarConductores";
import {EditarGuardaTren} from "./components/Admin/EditarGuardaTren";
import {Padron} from "./Services/Padron";
import {Pool} from "./components/Personal/Pool";
import {Pool2} from "./components/Personal/Pool2.jsx";
import {Corrida} from "./components/Personal/Corrida";
import {Novedades} from "./components/Personal/Novedades"
import {RegistrarTarjetas} from "./components/Admin/RegistrarTarjetas";
import { Emergencias} from "./components/Emergencia/Emergencias"
import { NavbarComponent } from './Views/Navbar';
import {UserProvider} from "./Services/UserContext";
import {Footer} from './Views/Footer';
import {Privacidad} from "./Views/Privacidad";
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
          <Route path="/novedades" element={<Novedades/>} />
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
          <Route path="/pool" element={<Pool/>} />
          <Route path="/pool2" element={<Pool2/>} />
          <Route path="/tarjetas" element={<RegistrarTarjetas/>} />
          <Route path="/padron" element={<Padron/>} />
          <Route path="/corrida" element={<Corrida/>} />
          <Route path="/listaspersonal" element="aca SE VE COMPONENTE LISTAS DE PERSONAL" />
          <Route path="/privacidad" element={<Privacidad/>} />


          
        </Routes>
          <Footer/>
        
        
   
        </UserProvider>
      </Router>
    </div>
    
  )
}


