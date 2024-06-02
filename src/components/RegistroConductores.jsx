import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
 
const MySwal = withReactContent(Swal);

export const RegistroConductores = () => {
    const [formData, setFormData] = useState({
        rol: 'electrico',
        nombre: '',
        legajo: '',
        servicio: '',
        tarea: '357',
        dni: '',
        nacimiento: '',
        ingreso: '',
        cupon: '',
        base: 'suarez',
        email: '',
        direccion: '',
        localidad: '',
        provincia: '',
        piso: '',
        dpto: '',
        cp: '',
        tel: '',
        secciones: []
    });
    
    const conductoresCollection = collection(db, 'conductores');
    const navigate = useNavigate()
  

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => ({
                ...prevData,
                secciones: checked
                    ? [...prevData.secciones, value]
                    : prevData.secciones.filter((seccion) => seccion !== value)
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const crearconductor = async (e) => {
        e.preventDefault();
        try {
            // Guardar los datos en Firebase
            await addDoc(conductoresCollection, formData);

            // Mostrar alerta de éxito
            MySwal.fire({
                title: 'Registro exitoso',
                text: 'Los datos han sido guardados correctamente',
                icon: 'success',
                showConfirmButton: true,
            }).then(() => {
                // Redirigir al usuario a otra página después de la alerta
                navigate('/conductores/create');
            });

            // Restablecer el formulario después de enviar los datos
            setFormData({
                rol: 'electrico',
                nombre: '',
                legajo: '',
                servicio: '',
                tarea: '357',
                dni: '',
                nacimiento: '',
                ingreso: '',
                cupon: '',
                base: 'suarez',
                email: '',
                direccion: '',
                localidad: '',
                provincia: '',
                piso: '',
                dpto: '',
                cp: '',
                tel: '',
                secciones: []
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
            <h1>Registro de Conductores</h1>
            <div className="d-flex justify-content-start">
                <form onSubmit={crearconductor}>
                    <div>
                        <label htmlFor="rol">Seleccione</label>
                        <select name="rol" id="rol" className="rol" value={formData.rol} onChange={handleChange}>
                            <option value="electrico">Cond. Diesel</option>
                            <option value="diesel">Cond. Electrico</option>
                            <option value="instructorld">Instructor Tec. LF LD</option>
                            <option value="instructorelec">Instructor Tec. LF Elec.</option>
                            <option value="inspectorelec">Inspector Tec. LF Elec.</option>
                            <option value="inspectorld">Inspector Tec. LF LD.</option>
                            <option value="preConductor">Pre-Cond. Operativo</option>
                        </select>
                        <label htmlFor="nombre">Nombre y Apellido</label>
                        <input type="text" id="nombre" name="nombre" placeholder="Nombre y Apellido"
                            pattern="[A-Z\s-a-z]{3,20}" required value={formData.nombre} onChange={handleChange} />
                        <label htmlFor="legajo">Legajo</label>
                        <input type="number" id="legajo" name="legajo" maxLength="6" className="input-number" required value={formData.legajo} onChange={handleChange} />
                        <label htmlFor="servicio">Servicio</label>
                        <input type="number" id="servicio" name="servicio" maxLength="6" className="input-number" required value={formData.servicio} onChange={handleChange} />
                        <label htmlFor="tarea">Tarea</label>
                        <select name="tarea" id="tarea" className="tarea" value={formData.tarea} onChange={handleChange}>
                            <option value="357">357</option>
                            <option value="358">358</option>
                            <option value="427">427</option>
                            <option value="428">428</option>
                            <option value="576">576</option>
                        </select>
                        <label htmlFor="dni">DNI</label>
                        <input type="number" id="dni" name="dni" maxLength="7" placeholder="XX.XXX.XXX" className="input-number" required value={formData.dni} onChange={handleChange} />
                        <label htmlFor="nacimiento">Fecha Nac.</label>
                        <input type="date" id="nacimiento" name="nacimiento" className="input-number" required value={formData.nacimiento} onChange={handleChange} />
                        <label htmlFor="ingreso">Fecha Ingreso</label>
                        <input type="date" id="ingreso" name="ingreso" className="input-number" required value={formData.ingreso} onChange={handleChange} />
                        <label htmlFor="cupon">Venc. Cupón</label>
                        <input type="date" id="cupon" name="cupon" className="input-number" value={formData.cupon} onChange={handleChange} />
                        <label htmlFor="base">Base perteneciente</label>
                        <select name="base" id="base" className="base" value={formData.base} onChange={handleChange}>
                            <option value="suarez">Suarez</option>
                            <option value="victoria">Victoria</option>
                            <option value="retiro">Retiro</option>
                        </select>
                        <div>
                            <label htmlFor="email">Correo electrónico</label>
                            <input type="email" id="email" name="email" placeholder="ejemplo@email.com" required value={formData.email} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="direccion">Calle</label>
                            <input type="text" id="direccion" name="direccion" placeholder="Dirección"
                                pattern="[A-Z\s-a-z]{3,20}" required value={formData.direccion} onChange={handleChange} />
                            <label htmlFor="localidad">Localidad</label>
                            <input type="text" id="localidad" name="localidad" placeholder="Barrio o Partido"
                                pattern="[A-Z\s-a-z]{3,20}" required value={formData.localidad} onChange={handleChange} />
                            <label htmlFor="provincia">Provincia</label>
                            <input type="text" id="provincia" name="provincia" placeholder="Provincia"
                                pattern="[A-Z\s-a-z]{3,20}" required value={formData.provincia} onChange={handleChange} />
                            <label htmlFor="piso">Piso</label>
                            <input type="number" id="piso" name="piso" maxLength="2" className="input-number" value={formData.piso} onChange={handleChange} />
                            <label htmlFor="dpto">Dpto</label>
                            <input type="text" id="dpto" name="dpto" placeholder="Departamento"
                                pattern="[A-Z\s-a-z]{3,20}" value={formData.dpto} onChange={handleChange} />
                            <label htmlFor="cp">Codigo Postal</label>
                            <input type="text" id="cp" name="cp" maxLength="6" className="input-number" value={formData.cp} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="tel">Teléfono</label>
                            <input type="text" id="tel" name="tel" placeholder="11-XXXX-XXXX" value={formData.tel} onChange={handleChange} />
                        </div>
                        <div className="d-flex justify-content-start">
                            <h3>Conocimiento de Vías</h3>
                            <fieldset>
                                <div className="d-flex justify-content-start">
                                    <ul className="lista1 form-check-inline form-switch">
                                        {['ap', 'bp', 'cp', 'dp', 'ep', 'rosario', 'ug', 'e1', 'e2', 'puerto'].map((seccion) => (
                                            <li key={seccion}>
                                                <label htmlFor={`checkbox-${seccion}`}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="secciones"
                                                        value={seccion}
                                                        id={`checkbox-${seccion}`}
                                                        checked={formData.secciones.includes(seccion)}
                                                        onChange={handleChange}
                                                    /> {seccion.toUpperCase()}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </fieldset>
                        </div>
                        <div style={{ display: 'inline' }}>
                            <input type="submit" className="btn btn-success" value="Registrar" />
                            <a href="/" className="btn btn-warning">Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};

