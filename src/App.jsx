import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import { RutasPrivadas } from './Services/RutasPrivadas.jsx';
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
import { Barreras } from "./components/Emergencia/Barreras.jsx";
import { BarrerasNormalizadas } from "./components/Emergencia/Normales.jsx";
import { Pendientes } from './components/Emergencia/Pendientes.jsx';
import { Peditina } from "./components/GDE/Peditina.jsx";
import { Tarjetas } from "./components/GDE/Tarjetas.jsx";
import { EditarPeditina } from "./components/GDE/EditarPeditina.jsx";
import { EditarTarjeta } from "./components/GDE/EditarTarjeta.jsx";
import { NavbarComponent } from './Views/Navbar';
import {UserProvider} from "./Services/UserContext";
import {Emergencia} from "./Services/Emergencia";
import {Partes} from "./components/Emergencia/Partes.jsx";
import { CargaAUV }  from "./components/Diesel/AUV.jsx";
import {CargarColecciones} from "./Services/CargarColecciones";
import {Footer} from './Views/Footer';
import {Privacidad} from "./Views/Privacidad";
import './scss/App.css'

export const App = () => {
 

  return (
    <div className="App container">
      <Router>
        <UserProvider>
          <header>
            <NavbarComponent />
          </header>

          <Routes>
            {/* --- 1. RUTAS PÚBLICAS --- */}
            {/* Si el usuario ya está logueado y va a /, podrías redirigirlo a /pendientes o dejarlo en Login */}
            <Route path="/" element={<Login />} />
            <Route path="/operadores/create" element={<RegistrarOperadores />} />
            <Route path="/privacidad" element={<Privacidad />} />

            {/* --- 2. RUTAS OPERATIVAS (Requieren estar logueado) --- */}
            <Route element={<RutasPrivadas />}>
              <Route path="/novedades" element={<Novedades />} />
              <Route path="/peditina" element={<Peditina />} />
              <Route path="/tarjetas" element={<Tarjetas />} /> {/* Usando tu componente original */}
              <Route path="/cortesecc" element={<CorteSecc />} />
              <Route path="/precauciones" element={<Precauciones />} />
              <Route path="/pendientes" element={<Pendientes />} />
              <Route path="/barrerasnormalizadas" element={<BarrerasNormalizadas />} />
              <Route path="/barreras" element={<Barreras />} />
              <Route path="/emergencia" element={<Emergencia />} />
              <Route path="/direcciones" element={<Direcciones />} />
              <Route path="/partes" element={<Partes />} />
              <Route path="/pool" element={<Pool />} />
              <Route path="/sabana" element={<Sabana />} />
              <Route path="/registrartarjetas" element={<RegistrarTarjetas />} />
              <Route path="/corrida" element={<Corrida />} />
              <Route path="/listaspersonal" element={<Lista />} />
              <Route path="/padron" element={<Padron />} />
              <Route path="/peditina/edit/:id" element={<EditarPeditina />} />
              <Route path="/tarjetas/edit/:id" element={<EditarTarjeta />} /> {/* Ruta para editar tarjetas */}
              <Route path="/auv" element={<CargaAUV />} />
              
              {/* Rutas de texto simple */}
              <Route path="/art" element={<div>Formulario para ARTs</div>} />
             
            </Route>

            {/* --- 3. RUTAS ADMINISTRATIVAS (Solo Rol Administrador) --- */}
            <Route element={<RutasPrivadas rolRequerido="administrador" />}>
              <Route path="/administracion" element={<Administracion />} />
              <Route path="/operadores/edit/:id" element={<EditarOperadores />} />
              <Route path="/conductores/create" element={<RegistroConductores />} />
              <Route path="/conductores/edit/:id" element={<EditarConductores />} />
              <Route path="/guardatren/create" element={<RegistroGuardaTren />} />
              <Route path="/guardatren/edit/:id" element={<EditarGuardaTren />} />
              <Route path="/registrodiagrama" element={<RegistroDiagrama />} />
              <Route path="/colecciones" element={<CargarColecciones />} />
            </Route>

            {/* --- REDIRECCIÓN POR DEFECTO --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </UserProvider>
      </Router>
    </div>
    
  )
}


