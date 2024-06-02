import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

import { useNavigate } from 'react-router-dom';

/* SWEET ALERT*/
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal)

export const RegistrarOperadores = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [legajo, setlegajo] = useState('');
  
  const roles = new Map([
    ['administrador', { valor: 'administrador', administrador: true, electrico: true, personal: true, emergencia: true,diesel: true, usuario: true }],
    ['electrico', { valor: 'electrico', administrador: false, electrico: true, personal: false, emergencia: false,diesel: false, usuario: false }],
    ['diesel', { valor: 'diesel', administrador: false, electrico: false, personal: false, emergencia: false,diesel: true, usuario: false }],
    ['personal', { valor: 'personal', administrador: false, electrico: false, personal: true, emergencia: false,diesel: false, usuario: false }],
    ['emergencia', { valor: 'emergencia', administrador: false, electrico: false, personal: true, emergencia: true,diesel: false, usuario: false }],
    ['usuario', { valor: 'usuario', administrador: false, electrico: false, personal: true, emergencia: true,diesel: false, usuario: true }],
  ]);
  const [rol, setRol] = useState(roles.get('personal')); // Valor inicial del rol
 
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
 

  const auth = getAuth();
  const operadoresCollection = collection(db, 'operadores');
  const navigate = useNavigate()


  const MySwal = withReactContent(Swal);

  

  const crearoperador = async (e) => {
    e.preventDefault();
    // Validar que la contraseña tenga al menos 6 caracteres
  if (contrasena.length < 6) {
    MySwal.fire({
      title: 'Error',
      text: 'La contraseña debe tener al menos 6 caracteres',
      icon: 'error',
      showConfirmButton: true,
    });
    //return;  Salir de la función sin intentar crear el usuario
  }
  if (contrasena !== repetirContrasena) {
    MySwal.fire({
      title: 'Error',
      text: 'Las contraseñas no coinciden',
      icon: 'error',
      showConfirmButton: true,
    });
    return;
  }
  try {
    // Crear usuario en Firebase Authentication
    const { user } = await createUserWithEmailAndPassword(auth, email, contrasena);

    // Agregar datos del usuario a la colección 'usuarios' en Firestore
    await addDoc(operadoresCollection, {
      nombre,
      email,
      legajo,
      rol: rol.valor,
      contrasena,
      
    });

    // Mostrar alerta de éxito
    MySwal.fire({
      title: 'Registro exitoso',
      text: 'El operador ha sido registrado correctamente',
      icon: 'success',
      showConfirmButton: true,
    }).then(() => {
      // Redirigir al usuario a otra página después de la alerta
      navigate ('/#');
    });
    
    // Resetear los campos del formulario
    setNombre('');
    setEmail('');
    setContrasena('');
  } catch (error) {
    // Mostrar alerta de error
    MySwal.fire({
      title: 'Error',
      text: error.message,
      icon: 'error',
      showConfirmButton: true,
    });
  }
};
const RolSelect = () => {
  const [rol, setRol] = useState(roles.get('electrico'));

  const handleRolChange = (e) => {
    const nuevoRol = roles.get(e.target.value);
    setRol(nuevoRol);
  };

  return (
    <div className="container elem-group form-floating mb-3">
      <select
        name="rol"
        id="rol"
        value={rol.valor}
        onChange={handleRolChange}
        className="form-select"
      >
        {Array.from(roles.keys()).map((key) => (
          <option key={key} value={key} disabled={key === 'administrador'}>
            {key}
          </option>
        ))}
      </select>
      <label htmlFor="rol">Rol</label>
    </div>
  );
};

    return (

        <div className="container">
        <div className='card text-bg-primary mb-3 shadow-lg" style="max-width: 18rem;"'>
         <h1 className='card-header'>Registrar Nueva operador</h1>
       </div>
       <form onSubmit={crearoperador} className="card card-body shadow-lg">
        <div className="elem-group">
         <div className='form-floating mb-3'>

          <input className='form-control'
            type="text"
            id="nombre"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required />
          <label for="floatingInputDisabled" htmlFor="nombre">Nombre y Apellido</label>
         </div>
        </div>
        <div className="elem-group">
        <div className='form-floating mb-3'>

          <input className='form-control'
            type="email"
            id="email"
            placeholder="ejemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
          <label for="floatingInputDisabled" htmlFor="email">Correo electrónico</label>
            </div>
        </div>
            <div className="elem-group">
            <div className='form-floating mb-3'>
              

                <input type="number"required id="legajo" value={legajo} onChange={(e) => setlegajo(e.target.value)} name="legajo" maxlength="2" className='form-control'/>
                <label for="floatingInputDisabled" htmlFor="legajo">legajo</label>
              </div>
              </div>
             
              

                <div className="elem-group form-floating mb-3">
                <RolSelect />
                
            </div>

            <div className='elem-group form-floating mb-3'>
          <input className='form-control'
            type="password"
            id="contrasena"
            placeholder="XXXXXXXX"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            minLength={6}
            required />
          <label for="floatingInputDisabled" htmlFor="contrasena">Contraseña</label>
        </div>
        <div className='elem-group form-floating mb-3'>
          <input className='form-control'
            type="password"
            id="repetirContrasena"
            placeholder="XXXXXXXX"
            value={repetirContrasena}
            onChange={(e) => setRepetirContrasena(e.target.value)}
            required />
          <label for="floatingInputDisabled" htmlFor="repetirContrasena">Repetir Contraseña</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </form>
    </div> 
    );
  }
