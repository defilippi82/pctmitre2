import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

// Definición de los roles y sus permisos (Estructura para el campo 'rol' tipo Map)
const rolesMap = new Map([
  ['gde', { valor: 'gde', administrador: false, electrico: true, personal: false, emergencia: true, diesel: true, usuario: true, gde: true }],
  ['electrico', { valor: 'electrico', administrador: false, electrico: true, personal: false, emergencia: false, diesel: false, usuario: false, gde: false }],
  ['diesel', { valor: 'diesel', administrador: false, electrico: false, personal: false, emergencia: false, diesel: true, usuario: false, gde: false }],
  ['personal', { valor: 'personal', administrador: false, electrico: false, personal: true, emergencia: false, diesel: false, usuario: false, gde: false }],
  ['emergencia', { valor: 'emergencia', administrador: false, electrico: false, personal: false, emergencia: true, diesel: false, usuario: false, gde: false }]
]);

export const RegistrarOperadores = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [legajo, setLegajo] = useState('');
  const [rolBase, setRolBase] = useState(''); // Almacena el ID del rol (ej: 'gde')
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');

  const navigate = useNavigate();

  // Generamos la lista de opciones para el select desde las llaves del Map
  const rolesDisponibles = Array.from(rolesMap.keys());

  const registro = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!rolBase) {
      Swal.fire("Atención", "Debes seleccionar un rol principal", "warning");
      return;
    }

    if (contrasena !== repetirContrasena) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    try {
      // Obtenemos el objeto de permisos que irá dentro del Map 'rol'
      const permisosDelRol = rolesMap.get(rolBase);

      await addDoc(collection(db, "operadores"), {
        nombre,
        apellido,
        email,
        legajo,
        contrasena,
        // ESTRUCTURA EXACTA SEGÚN TU DB:
        rol: { ...permisosDelRol }, // Se guarda como un MAP en Firestore
        roles: [rolBase],           // Se guarda como un ARRAY en Firestore
        fechaAlta: new Date().toLocaleDateString()
      });

      Swal.fire("Éxito", "Operador registrado correctamente.", "success");
      navigate('/'); 
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire("Error", "No se pudo completar el registro", "error");
    }
  };

  return (
    <div className='container mt-5'>
      <form onSubmit={registro} className='p-4 border rounded shadow bg-light'>
        <h3 className="mb-4 text-center">Registro de Nuevo Operador</h3>
        
        <div className='row'>
          <div className='col-md-6 form-floating mb-3'>
            <input type="text" required id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className='form-control' placeholder="Nombre"/>
            <label htmlFor="nombre" className="ms-2">Nombre</label>
          </div>
          <div className='col-md-6 form-floating mb-3'>
            <input type="text" required id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} className='form-control' placeholder="Apellido"/>
            <label htmlFor="apellido" className="ms-2">Apellido</label>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-8 form-floating mb-3'>
            <input type="email" required id="email" value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder="Email"/>
            <label htmlFor="email" className="ms-2">Correo Electrónico</label>
          </div>
          <div className='col-md-4 form-floating mb-3'>
            <input type="text" required id="legajo" value={legajo} onChange={(e) => setLegajo(e.target.value)} className='form-control' placeholder="Legajo"/>
            <label htmlFor="legajo" className="ms-2">Legajo</label>
          </div>
        </div>

        {/* --- SELECTOR DE ROL --- */}
        <div className='form-floating mb-3'>
          <select 
            className="form-select border-primary" 
            id="rol" 
            value={rolBase} 
            onChange={(e) => setRolBase(e.target.value)}
            required
          >
            <option value="">-- Seleccionar Mesa de Trabajo Principal --</option>
            {rolesDisponibles.map(key => (
              <option key={key} value={key}>{key.toUpperCase()}</option>
            ))}
          </select>
          <label htmlFor="rol" className="ms-2">Rol Base (Asignación automática de permisos)</label>
        </div>

        <div className='row mt-4'>
          <div className='col-md-6 form-floating mb-3'>
            <input type="password" required id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className='form-control' placeholder="Contraseña"/>
            <label htmlFor="contrasena" className="ms-2">Contraseña</label>
          </div>
          <div className='col-md-6 form-floating mb-3'>
            <input type="password" required id="repetir" value={repetirContrasena} onChange={(e) => setRepetirContrasena(e.target.value)} className='form-control' placeholder="Repetir"/>
            <label htmlFor="repetir" className="ms-2">Repetir Contraseña</label>
          </div>
        </div>

        <div className="d-flex gap-3 mt-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary w-50 py-2 fw-bold" 
            onClick={() => navigate('/')}
          >
            CANCELAR
          </button>
          <button 
            type="submit" 
            className="btn btn-primary w-50 py-2 fw-bold"
          >
            FINALIZAR REGISTRO
          </button>
        </div>
      </form>
    </div>
  );
};