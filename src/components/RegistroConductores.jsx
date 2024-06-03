import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
 
const MySwal = withReactContent(Swal);

export const RegistroConductores = () => {
    const [formData, setFormData] = useState({
        rol: '',
        nombre: '',
        apellido: '',
        legajo: '',
        servicio: '',
        tarea: '',
        dni: '',
        nacimiento: '',
        ingreso: '',
        cupon: '',
        base: '',
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
                rol: '',
                nombre: '',
                apellido: '',
                legajo: '',
                servicio: '',
                tarea: '',
                dni: '',
                nacimiento: '',
                ingreso: '',
                cupon: '',
                base: '',
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
            <div className="container ">
            <div className='card text-bg-primary mb-3 shadow-lg" style="max-width: 18rem;"'>
            <h1 className='card-header'>Registro de Conductores</h1>
            </div>
            <div className="d-flex justify-content-start">
                <form onSubmit={crearconductor} className="card card-body shadow-lg">
                        <div>
                        <div className="container elem-group form-floating mb-3">
                         <select name="base" id="base" className="form-select" value={formData.base} onChange={handleChange}>
                            <option value="suarez">Suarez</option>
                            <option value="victoria">Victoria</option>
                            <option value="retiro">Retiro</option>
                        </select>
                        <label htmlFor="base">Base perteneciente</label>
                        </div>
                        </div>
                     
                     <div>
                    <div className="container elem-group form-floating mb-3">
                        <select name="rol" id="rol" className="form-select" value={formData.rol} onChange={handleChange}>
                            <option value="diesel">Cond. Diesel</option>
                            <option value="electrico">Cond. Electrico</option>
                            <option value="instructorld">Instructor Tec. LF LD</option>
                            <option value="instructorelec">Instructor Tec. LF Elec.</option>
                            <option value="inspectorelec">Inspector Tec. LF Elec.</option>
                            <option value="inspectorld">Inspector Tec. LF LD.</option>
                            <option value="preConductor">Pre-Cond. Operativo</option>
                        </select>
                        <label htmlFor="categoria">Categoría</label>
                        </div>
                        </div>

                        <div className="elem-group">
                        <div className='form-floating mb-2'>
                        <input  type="number" id="legajo" name="legajo" maxLength="6" className="form-control input-number" required value={formData.legajo} onChange={handleChange} />
                        <label htmlFor="legajo" for="floatingInputDisabled">Legajo</label>
                        </div>
                        </div>
                        <div className="elem-group">
                        <div className='form-floating mb-3'>
                        <input className='form-control' type="text" id="nombre" name="nombre" placeholder="Nombre"
                             required value={formData.nombre} onChange={handleChange} />
                        <label htmlFor="nombre">Nombre </label>
                        </div>
                        </div>

                        <div className="elem-group">
                        <div className='form-floating mb-3'>
                        <input className='form-control' type="text" id="apellido" name="apellido" placeholder="Apellido"
                             required value={formData.apellido} onChange={handleChange} />
                        <label htmlFor="apellido" for="floatingInputDisabled" >Apellido</label>
                        </div>
                        </div>

                        <div>
                        <div className="container elem-group form-floating mb-3">
                        <input className='form-control input-number' type="number" id="dni" name="dni" maxLength="7" placeholder="XX.XXX.XXX"  required value={formData.dni} onChange={handleChange} />
                        <label htmlFor="dni">DNI</label>
                        </div>
                        </div>
                        <div>
                        <div className="container elem-group form-floating mb-3">
                        <input  type="date" id="nacimiento" name="nacimiento" className="form-control input-number" required value={formData.nacimiento} onChange={handleChange} />
                        <label htmlFor="nacimiento">Fecha Nac.</label>
                        </div>
                        </div>
                        <div>
                        <div className="container elem-group form-floating mb-3">
                            <input  type="date" id="ingreso" name="ingreso" className="form-control input-number" required value={formData.ingreso} onChange={handleChange} />
                            <label htmlFor="ingreso">Fecha Ingreso</label>
                        </div>
                        </div>

                        <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control' type="email" id="email" name="email" placeholder="ejemplo@email.com" required value={formData.email} onChange={handleChange} />
                            <label htmlFor="email" for="floatingInputDisabled">Correo electrónico</label>
                        </div>
                        </div>
                        <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control' type="text" id="direccion" name="direccion" placeholder="Dirección"
                                 required value={formData.direccion} onChange={handleChange} />
                            <label htmlFor="direccion" for="floatingInputDisabled">Calle</label>
                            </div></div>

                            <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control' type="text" id="localidad" name="localidad" placeholder="Barrio o Partido"
                                 required value={formData.localidad} onChange={handleChange} />
                            <label htmlFor="localidad" for="floatingInputDisabled">Localidad</label>
                            </div></div>

                            <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control' type="text" id="provincia" name="provincia" placeholder="Provincia"
                                 required value={formData.provincia} onChange={handleChange} />
                            <label htmlFor="provincia" for="floatingInputDisabled">Provincia</label></div></div>

                            <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control input-number' type="number" id="piso" name="piso" maxLength="2" value={formData.piso} onChange={handleChange} />
                            <label htmlFor="piso" for="floatingInputDisabled">Piso</label></div></div>
                            
                            <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control' type="text" id="dpto" name="dpto" placeholder="Departamento"
                                pattern="[A-Z\s-a-z]{3,20}" value={formData.dpto} onChange={handleChange} />
                            <label htmlFor="dpto" for="floatingInputDisabled">Dpto</label></div></div>
                            
                            <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control input-number' type="text" id="cp" name="cp" maxLength="6"  value={formData.cp} onChange={handleChange} />
                            <label htmlFor="cp" for="floatingInputDisabled">Codigo Postal</label>
                        </div>
                        </div>
                        <div>
                        <div className="container elem-group form-floating mb-3">
                            <input className='form-control' type="text" id="tel" name="tel" placeholder="11-XXXX-XXXX" value={formData.tel} onChange={handleChange} />
                            <label htmlFor="tel" for="floatingInputDisabled">Teléfono</label>
                        </div>
                        </div>
                        <div className="elem-group">
                        <div className='form-floating mb-3'>

                        <input  type="number" id="servicio" name="servicio" maxLength="6" className='form-control input-number' required value={formData.servicio} onChange={handleChange} />
                        <label for="floatingInputDisabled" htmlFor="servicio">Servicio</label>
                        </div>
                        </div>

                        <div>
                        <div className="container elem-group form-floating mb-3">
                            <select name="tarea" id="tarea" className="form-select" value={formData.tarea} onChange={handleChange}>
                            <option value="357">357</option>
                            <option value="358">358</option>
                            <option value="427">427</option>
                            <option value="428">428</option>
                            <option value="576">576</option>
                        </select>
                        <label htmlFor="tarea">Tarea</label>
                        </div></div>
                        <div>
                        <div className="container elem-group form-floating mb-3">
                            <input  type="date" id="cupon" name="cupon" className="form-control input-number" value={formData.cupon} onChange={handleChange} />
                            <label htmlFor="cupon">Venc. Cupón</label>
                        </div>
                        </div>
                        <div>
                        <div className="container elem-group form-floating mb-6">
                            <h3>Conocimiento de Vías</h3>
                            <fieldset>
                                <div className="form-control content">
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
                            </div>
                       
                        <div style={{ display: 'inline' }}>
                            <input type="submit" className="btn btn-success" value="Registrar" />
                            <a href="/" className="btn btn-warning">Cancel</a>
                        </div>
                                            
                </form>
            </div>
        </div>
        </main>
    );
};

