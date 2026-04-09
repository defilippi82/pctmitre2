import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

export const RegistrarOperadores = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [legajo, setLegajo] = useState(''); // Campo Legajo
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');

  const navigate = useNavigate();

  // Filtramos 'administrador' para que no se pueda elegir en el registro abierto
  const mesas = ['electrico', 'diesel', 'gde', 'emergencia', 'personal'];

  const handleRoleChange = (mesa) => {
    setRolesSeleccionados(prev => 
      prev.includes(mesa) ? prev.filter(r => r !== mesa) : [...prev, mesa]
    );
  };

  const registro = async (e) => {
    e.preventDefault();
    if (contrasena !== repetirContrasena) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    try {
      await addDoc(collection(db, "operadores"), {
        nombre,
        apellido,
        email,
        legajo,
        roles: rolesSeleccionados,
        contrasena,
        fechaAlta: new Date().toLocaleDateString()
      });
      Swal.fire("Éxito", "Operador registrado correctamente", "success");
      navigate('/administracion');
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar", "error");
    }
  };

  return (
    <div className='container mt-5'>
      <form onSubmit={registro} className='p-4 border rounded shadow bg-light'>
        <h3 className="mb-4">Registro de Operador</h3>
        
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

        <div className='mb-3 p-3 border rounded bg-white shadow-sm'>
          <label className='fw-bold mb-2 text-primary'>Asignar Mesas de Trabajo:</label>
          <div className='row'>
            {mesas.map(mesa => (
              <div key={mesa} className='col-6 col-md-4'>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id={mesa} 
                    checked={rolesSeleccionados.includes(mesa)}
                    onChange={() => handleRoleChange(mesa)} />
                  <label className="form-check-label text-capitalize" htmlFor={mesa}>{mesa}</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='row'>
          <div className='col-md-6 form-floating mb-3'>
            <input type="password" required id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className='form-control' placeholder="Contraseña"/>
            <label htmlFor="contrasena" className="ms-2">Contraseña</label>
          </div>
          <div className='col-md-6 form-floating mb-3'>
            <input type="password" required id="repetir" value={repetirContrasena} onChange={(e) => setRepetirContrasena(e.target.value)} className='form-control' placeholder="Repetir"/>
            <label htmlFor="repetir" className="ms-2">Repetir Contraseña</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">FINALIZAR REGISTRO</button>
      </form>
    </div>
  );
};