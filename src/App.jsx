import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { Login } from "./components/Admin/Login";
import {CorteSecc} from "./components/Electrico/CorteSecc.jsx";
import {Precauciones} from "./components/Electrico/Precauciones.jsx";
import {Administracion} from "./components/Admin/Administracion";
import {RegistrarOperadores} from "./components/Admin/RegistrarOperadores";
import {EditarOperadores} from "./components/Admin/EditarOperadores";
import { RegistroConductores } from "./components/Admin/RegistroConductores";
import { RegistroGuardaTren } from "./components/Admin/RegistroGuardaTren";
import { RegistroDiagrama } from "./components/Admin/RegistroDiagrama.jsx";
import {EditarConductores} from "./components/Admin/EditarConductores";
import {EditarGuardaTren} from "./components/Admin/EditarGuardaTren";
import {Padron} from "./Services/Padron";
import {Pool} from "./components/Personal/Pool";
import {Corrida} from "./components/Personal/Corrida";
import {Lista} from "./components/Personal/Lista.jsx";
import {Sabana} from "./components/Personal/Sabana.jsx";
import {Novedades} from "./components/Personal/Novedades.jsx"
import {RegistrarTarjetas} from "./components/Personal/RegistrarTarjetas.jsx";
import { Direcciones} from "./components/Emergencia/Direcciones"
import { Pendientes } from './components/Emergencia/Pendientes.jsx';
import { NavbarComponent } from './Views/Navbar';
import {UserProvider} from "./Services/UserContext";
import {Emergencia} from "./Services/Emergencia";
import {CargarColecciones} from "./Services/CargarColecciones";
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
          <Route path="/cortesecc" element={<CorteSecc/>} />
          <Route path="/precauciones" element={<Precauciones/>} />
          <Route path="/auv" element="Aca Puede Realizar AUV" />
          <Route path="/operadores/create" element={<RegistrarOperadores/>} />
          <Route path="/operadores/edit/:id" element={<EditarOperadores/>} />
          <Route path="/administracion" element={<Administracion/>} />
          <Route path="/direcciones" element={<Direcciones />} />
          <Route path="/pendientes" element={<Pendientes/>} />
          <Route path="/partes" element="Aca se ven los partes de Regularidad" />
          <Route path="/art" element="Formulario para ARTs " />
          <Route path="/barreras" element="Aca se ven los pendientes de barreras" />
          <Route path="/conductores/create" element={<RegistroConductores/>} />
          <Route path="/conductores/edit/:id" element={<EditarConductores/>} />
          <Route path="/guardatren/create" element={<RegistroGuardaTren/>} />
          <Route path="/guardatren/edit/:id" element={<EditarGuardaTren/>} />
          <Route path="/registrodiagrama" element={<RegistroDiagrama/>} />
          <Route path="/pool" element={<Pool/>} />
          <Route path="/sabana" element={<Sabana/>} />
          <Route path="/tarjetas" element={<RegistrarTarjetas/>} />
          <Route path="/padron" element={<Padron/>} />
          <Route path="/corrida" element={<Corrida/>} />
          <Route path="/listaspersonal" element={<Lista/>} />
          <Route path="/emergencia" element={<Emergencia/>} />
          <Route path="/colecciones" element={<CargarColecciones/>} />
          <Route path="/privacidad" element={<Privacidad/>} />


          
        </Routes>
          <Footer/>
        
        
   
        </UserProvider>
      </Router>
    </div>
    
  )
}


