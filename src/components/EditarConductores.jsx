import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../firebaseConfig/firebase";

export const EditarConductores = () => {
    const { id } = useParams();
    
    const [formData, setFormData] = useState({
        rol: '',
        nombre: '',
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

    useEffect(() => {
        const fetchData = async () => {
            const doc = await db.collection('conductores').doc(id).get();
            if (doc.exists) {
                setFormData(doc.data());
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            secciones: checked
                ? [...formData.secciones, name]
                : formData.secciones.filter(seccion => seccion !== name)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await db.collection('conductores').doc(id).set(formData);
        history.push('/conductores');
    };

    return (
        <main>
            <h1>Editar Conductor</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="rol">Seleccione</label>
                    <select name="rol" id="rol" value={formData.rol} onChange={handleChange}>
                        <option value="electrico">Cond. Diesel</option>
                        <option value="diesel">Cond. Electrico</option>
                        <option value="instructorld">Instructor Tec. LF LD</option>
                        <option value="instructorelec">Instructor Tec. LF Elec.</option>
                        <option value="inspectorelec">Inspector Tec. LF Elec.</option>
                        <option value="inspectorld">Inspector Tec. LF LD.</option>
                        <option value="preConductor">Pre-Cond. Operativo</option>
                    </select>
                    <label htmlFor="nombre">Nombre y Apellido</label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    <label htmlFor="legajo">Legajo</label>
                    <input type="number" id="legajo" name="legajo" value={formData.legajo} onChange={handleChange} required />
                    <label htmlFor="servicio">Servicio</label>
                    <input type="number" id="servicio" name="servicio" value={formData.servicio} onChange={handleChange} required />
                    <label htmlFor="tarea">Tarea</label>
                    <select name="tarea" id="tarea" value={formData.tarea} onChange={handleChange}>
                        <option value="357">357</option>
                        <option value="358">358</option>
                        <option value="427">427</option>
                        <option value="428">428</option>
                        <option value="576">576</option>
                    </select>
                    <label htmlFor="dni">DNI</label>
                    <input type="number" id="dni" name="dni" value={formData.dni} onChange={handleChange} required />
                    <label htmlFor="nacimiento">Fecha Nac.</label>
                    <input type="date" id="nacimiento" name="nacimiento" value={formData.nacimiento} onChange={handleChange} required />
                    <label htmlFor="ingreso">Fecha Ingreso</label>
                    <input type="date" id="ingreso" name="ingreso" value={formData.ingreso} onChange={handleChange} required />
                    <label htmlFor="cupon">Venc. Cupón</label>
                    <input type="date" id="cupon" name="cupon" value={formData.cupon} onChange={handleChange} />
                    <label htmlFor="base">Base perteneciente</label>
                    <select name="base" id="base" value={formData.base} onChange={handleChange}>
                        <option value="suarez">Suarez</option>
                        <option value="victoria">Victoria</option>
                        <option value="retiro">Retiro</option>
                    </select>
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    <label htmlFor="direccion">Calle</label>
                    <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
                    <label htmlFor="localidad">Localidad</label>
                    <input type="text" id="localidad" name="localidad" value={formData.localidad} onChange={handleChange} required />
                    <label htmlFor="provincia">Provincia</label>
                    <input type="text" id="provincia" name="provincia" value={formData.provincia} onChange={handleChange} required />
                    <label htmlFor="piso">Piso</label>
                    <input type="number" id="piso" name="piso" value={formData.piso} onChange={handleChange} />
                    <label htmlFor="dpto">Dpto</label>
                    <input type="text" id="dpto" name="dpto" value={formData.dpto} onChange={handleChange} />
                    <label htmlFor="cp">Codigo Postal</label>
                    <input type="number" id="cp" name="cp" value={formData.cp} onChange={handleChange} />
                    <label htmlFor="tel">Teléfono</label>
                    <input type="text" id="tel" name="tel" value={formData.tel} onChange={handleChange} />
                    <h3>Conocimiento de Vías</h3>
                    <fieldset>
                        <ul className="lista1 form-check-inline form-switch">
                            {['ap', 'bp', 'cp', 'dp', 'ep', 'rosario', 'ug', 'e1', 'e2', 'puerto'].map(seccion => (
                                <li key={seccion}>
                                    <label htmlFor={`checkbox-${seccion}`}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name={seccion}
                                            checked={formData.secciones.includes(seccion)}
                                            onChange={handleCheckboxChange}
                                        />
                                        {seccion.toUpperCase()}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </fieldset>
                    <div style={{ display: 'inline' }}>
                        <input type="submit" className="btn btn-success" value="Guardar" />
                        <a href="/conductores" className="btn btn-warning">Cancelar</a>
                    </div>
                </form>
            </div>
        </main>
    );
};


