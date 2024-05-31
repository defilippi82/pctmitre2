import React, { useState } from 'react';
import { getAuth} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { useNavigate } from 'react-router-dom';

/* SWEET ALERT*/
import Swal from "sweetalert2";
import whitReactContent from "sweetalert2-react-content";

const MySwal = whitReactContent(Swal);

export const RegistroGuardaTren = () => {
    const [nombre, setNombre] = useState('');
    const [legajo, setLegajo] = useState('');
    const [servicio, setServicio] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [provincia, setProvincia] = useState('');
    const [piso, setPiso] = useState('');
    const [dpto, setDpto]= useState('');
    const [cp, setCp]= useState('');
    const [codigoPais, setCodigoPais]= useState('+54');
    const [tel, setTel]= useState('');
    const [altCodigoPais, setAltCodigoPais]= useState('+54');
    const [altTel, setAltTel]= useState('');

    
    const guardatrenCollection = collection(db, 'guardatren');

    const navigate = useNavigate();

   
    const crearguardatren = async (e) => {
        e.preventDefault();
        try {
          // Guardar los datos en Firebase
          await addDoc(guardatrenCollection, {
            nombre,
            email,
            legajo,
            servicio,
            direccion,
            localidad,
            provincia,
            piso,
            dpto,
            cp,
            codigoPais,
            tel,
            altCodigoPais,
            altTel,
                        
          });
          console.log('Datos guardados en Firebase');
    
          // Mostrar alerta de éxito
          MySwal.fire({
            title: 'Registro exitoso',
            text: 'Los datos han sido guardados correctamente',
            icon: 'success',
            showConfirmButton: true,
          }).then(() => {
            // Redirigir al usuario a otra página después de la alerta
            navigate('/guardatren/create');
          });
    
          // Restablecer el formulario después de enviar los datos
          
            setNombre(''),
            setLegajo(''),
            setServicio(''),
            setEmail('') ,
            setDireccion('') ,
            setLocalidad('') ,
            setProvincia('') ,
            setPiso('') ,
            setDpto('') ,
            setCp('') ,
            setCodigoPais('+54') ,
            setTel('') ,
           setAltCodigoPais('+54'),
           setAltTel('') 
          
        } catch (error) {
          console.error('Error al guardar los datos en Firebase:', error);
          // Mostrar alerta de error
          MySwal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            showConfirmButton: true,
          });
        }
      };

    return (
        <main>
            <h1>Registro de GuardaTren</h1>
            <div>
                <form onSubmit={crearguardatren} className="card card-body shadow-lg">
                    <div>
                        <label htmlFor="nombre">Nombre y Apellido</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Nombre y Apellido"
                            pattern="[A-Z\s-a-z]{3,20}"
                            required
                            value={nombre}
                            onChange={handleChange}
                        />
                        <label htmlFor="legajo">Legajo</label>
                        <input
                            type="number"
                            id="legajo"
                            name="legajo"
                            maxLength="6"
                            className="input-number"
                            required
                            value={legajo}
                            onChange={handleChange}
                        />
                        <br />
                        <label htmlFor="servicio">Servicio</label>
                        <input
                            type="number"
                            id="servicio"
                            name="servicio"
                            maxLength="6"
                            className="input-number"
                            required
                            value={servicio}
                            onChange={handleChange}
                        />
                        <div className="elem-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="ejemplo@email.com"
                                required
                                value={email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="direccion">Calle</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                placeholder="Dirección"
                                pattern="[A-Z\s-a-z]{3,20}"
                                required
                                value={direccion}
                                onChange={handleChange}
                            />
                            <label htmlFor="localidad">Localidad</label>
                            <input
                                type="text"
                                id="localidad"
                                name="localidad"
                                placeholder="Barrio o Partido"
                                pattern="[A-Z\s-a-z]{3,20}"
                                required
                                value={localidad}
                                onChange={handleChange}
                            />
                            <label htmlFor="provincia">Provincia</label>
                            <input
                                type="text"
                                id="provincia"
                                name="provincia"
                                placeholder="Provincia"
                                pattern="[A-Z\s-a-z]{3,20}"
                                required
                                value={provincia}
                                onChange={handleChange}
                            />
                            <label htmlFor="piso">Piso</label>
                            <input
                                type="number"
                                id="piso"
                                name="piso"
                                maxLength="2"
                                className="input-number"
                                value={piso}
                                onChange={handleChange}
                            />
                            <label htmlFor="dpto">Dpto</label>
                            <input
                                type="text"
                                id="dpto"
                                name="dpto"
                                placeholder="Departamento"
                                pattern="[A-Z\s-a-z]{3,20}"
                                value={dpto}
                                onChange={handleChange}
                            />
                            <label htmlFor="cp">Codigo Postal</label>
                            <input
                                type="number"
                                id="cp"
                                name="cp"
                                maxLength="6"
                                className="input-number"
                                value={cp}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="tel">Teléfono Principal</label><br />
                            <label htmlFor="codigoPais">Código de País</label>
                            <select
                                id="codigoPais"
                                name="codigoPais"
                                value={codigoPais}
                                onChange={handleChange}
                            >
                                <option value="+54">Argentina (+54)</option>
                                <option value="+598">Uruguay (+598)</option>
                                <option value="+55">Brasil (+55)</option>
                                <option value="+56">Chile (+56)</option>
                                <option value="+57">Colombia (+57)</option>
                                <option value="+1">EE. UU. (+1)</option>
                                <option value="+1">Canadá (+1)</option>
                                <option value="+52">México (+52)</option>
                                <option value="+34">España (+34)</option>
                                <option value="+44">Reino Unido (+44)</option>
                                <option value="+49">Alemania (+49)</option>
                                <option value="+33">Francia (+33)</option>
                                <option value="+39">Italia (+39)</option>
                                <option value="+41">Suiza (+41)</option>
                                {/* Agrega más opciones según sea necesario */}
                            </select>
                            <label htmlFor="tel">Teléfono</label>
                            <input
                                type="text"
                                id="tel"
                                name="tel"
                                placeholder="11-XXXX-XXXX"
                                value={tel}
                                onChange={handleChange}
                            />
                            <br />
                            <label htmlFor="altTel">Telefono Alternativo</label><br />
                            <label htmlFor="altCodigoPais">Código de País</label>
                            <select
                                id="altCodigoPais"
                                name="altCodigoPais"
                                value={altCodigoPais}
                                onChange={handleChange}
                            >
                                <option value="+54">Argentina (+54)</option>
                                <option value="+598">Uruguay (+598)</option>
                                <option value="+55">Brasil (+55)</option>
                                <option value="+56">Chile (+56)</option>
                                <option value="+57">Colombia (+57)</option>
                                <option value="+1">EE. UU. (+1)</option>
                                <option value="+1">Canadá (+1)</option>
                                <option value="+52">México (+52)</option>
                                <option value="+34">España (+34)</option>
                                <option value="+44">Reino Unido (+44)</option>
                                <option value="+49">Alemania (+49)</option>
                                <option value="+33">Francia (+33)</option>
                                <option value="+39">Italia (+39)</option>
                                <option value="+41">Suiza (+41)</option>
                                {/* Agrega más opciones según sea necesario */}
                            </select>
                            <label htmlFor="altTel">Teléfono </label>
                            <input
                                type="text"
                                id="altTel"
                                name="altTel"
                                placeholder="11-XXXX-XXXX"
                                value={altTel}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ display: 'inline' }}>
                            <input type="submit" className="btn btn-outline-success" value="Registrar" />
                            <a href="/guardatren/create" className="btn btn-warning">Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

