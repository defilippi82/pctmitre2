import React, { useState, useEffect } from 'react';
import firebase, { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

export const EditarGuardaTren = ({ id }) => {
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

    useEffect(() => {
        // Aquí deberías implementar la lógica para obtener los datos del guardatren con el ID proporcionado
        // Por ejemplo, usando Firebase
        const obtenerDatosGuardaTren = async () => {
            try {
                const doc = await firebase.firestore().collection('guardatren').doc(id).get();
                if (doc.exists) {
                    const data = doc.data();
                    setFormData(data);
                } else {
                    console.log('No se encontraron datos para el ID proporcionado');
                }
            } catch (error) {
                console.error('Error al obtener datos de Firebase:', error);
            }
        };

        obtenerDatosGuardaTren();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Actualiza los datos del guardatren en Firebase
            await firebase.firestore().collection('guardatren').doc(id).set(formData, { merge: true });
            console.log('Datos actualizados correctamente');
        } catch (error) {
            console.error('Error al actualizar datos en Firebase:', error);
        }
    };

    return (
        <main>
            <h1>Editar GuardaTren</h1>
            <div>
                <form onSubmit={handleSubmit}>
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
                        {/* Resto de los campos de entrada aquí */}
                        <div style={{ display: 'inline' }}>
                            <input type="submit" className="btn btn-outline-success" value="Guardar cambios" />
                            <a href="/" className="btn btn-warning">Cancelar</a>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
};
