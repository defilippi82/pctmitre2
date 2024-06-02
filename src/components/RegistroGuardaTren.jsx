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
    const [formData, setFormData] = useState({
        nombre: '',
        legajo: '',
        servicio: '',
        email: '',
        direccion: '',
        localidad: '',
        provincia: '',
        piso: '',
        dpto: '',
        cp: '',
        codigoPais: '+54',
        tel: '',
        altCodigoPais: '+54',
        altTel: ''
    });

    const guardatrenCollection = collection(db, 'guardatren');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const crearguardatren = async (e) => {
        e.preventDefault();
        try {
            // Guardar los datos en Firebase
            await addDoc(guardatrenCollection, formData);
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
            setFormData({
                nombre: '',
                legajo: '',
                servicio: '',
                email: '',
                direccion: '',
                localidad: '',
                provincia: '',
                piso: '',
                dpto: '',
                cp: '',
                codigoPais: '+54',
                tel: '',
                altCodigoPais: '+54',
                altTel: ''
            });
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
                            value={formData.nombre}
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
                            value={formData.legajo}
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
                            value={formData.servicio}
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
                                value={formData.email}
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
                                value={formData.direccion}
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
                                value={formData.localidad}
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
                                value={formData.provincia}
                                onChange={handleChange}
                            />
                            <label htmlFor="piso">Piso</label>
                            <input
                                type="number"
                                id="piso"
                                name="piso"
                                maxLength="2"
                                className="input-number"
                                value={formData.piso}
                                onChange={handleChange}
                            />
                            <label htmlFor="dpto">Dpto</label>
                            <input
                                type="text"
                                id="dpto"
                                name="dpto"
                                placeholder="Departamento"
                                pattern="[A-Z\s-a-z]{3,20}"
                                value={formData.dpto}
                                onChange={handleChange}
                            />
                            <label htmlFor="cp">Codigo Postal</label>
                            <input
                                type="number"
                                id="cp"
                                name="cp"
                                maxLength="6"
                                className="input-number"
                                value={formData.cp}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="tel">Teléfono Principal</label><br />
                            <label htmlFor="codigoPais">Código de País</label>
                            <select
                                id="codigoPais"
                                name="codigoPais"
                                value={formData.codigoPais}
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
                                value={formData.tel}
                                onChange={handleChange}
                            />
                            <br />
                            <label htmlFor="altTel">Teléfono Alternativo</label><br />
                            <label htmlFor="altCodigoPais">Código de País</label>
                            <select
                                id="altCodigoPais"
                                name="altCodigoPais"
                                value={formData.altCodigoPais}
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
                            <label htmlFor="altTel">Teléfono</label>
                            <input
                                type="text"
                                id="altTel"
                                name="altTel"
                                placeholder="11-XXXX-XXXX"
                                value={formData.altTel}
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