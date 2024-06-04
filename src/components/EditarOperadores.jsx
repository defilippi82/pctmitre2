import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, getAuth, updatePassword } from '../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const roles = new Map([
    ['administrador', { valor: 'administrador', administrador: true, electrico: true, personal: true, emergencia: true, diesel: true, usuario: true }],
    ['electrico', { valor: 'electrico', administrador: false, electrico: true, personal: false, emergencia: false, diesel: false, usuario: false }],
    ['diesel', { valor: 'diesel', administrador: false, electrico: false, personal: false, emergencia: false, diesel: true, usuario: false }],
    ['personal', { valor: 'personal', administrador: false, electrico: false, personal: true, emergencia: false, diesel: false, usuario: false }],
    ['emergencia', { valor: 'emergencia', administrador: false, electrico: false, personal: true, emergencia: true, diesel: false, usuario: false }],
    ['usuario', { valor: 'usuario', administrador: false, electrico: false, personal: true, emergencia: true, diesel: false, usuario: true }],
]);

export const EditarOperadores = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        legajo: '',
        rol: '',
        contrasena: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const doc = await db.collection('operadores').doc(id).get();
            if (doc.exists) {
                const data = doc.data();
                setFormData({
                    nombre: data.nombre,
                    email: data.email,
                    legajo: data.legajo,
                    rol: roles.get(data.rol).valor,
                    contrasena: ''
                });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await db.collection('operadores').doc(id).set({
                nombre: formData.nombre,
                email: formData.email,
                legajo: formData.legajo,
                rol: formData.rol
            });

            if (formData.contrasena) {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    await updatePassword(user, formData.contrasena);
                } else {
                    throw new Error('Usuario no autenticado');
                }
            }
            
            MySwal.fire({
                title: 'Actualización exitosa',
                text: 'Los datos han sido actualizados correctamente',
                icon: 'success',
                showConfirmButton: true,
            });
        } catch (error) {
            console.error('Error al actualizar los datos en Firebase:', error);
            MySwal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="container">
            <div className='card text-bg-primary mb-3 shadow-lg'>
                <h1 className='card-header'>Editar Operador</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="card card-body shadow-lg">
                <div className="elem-group">
                    <div className='form-floating mb-3'>
                        <input
                            className='form-control'
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="nombre">Nombre y Apellido</label>
                    </div>
                </div>
                <div className="elem-group">
                    <div className='form-floating mb-3'>
                        <input
                            className='form-control'
                            type="email"
                            id="email"
                            name="email"
                            placeholder="ejemplo@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Correo electrónico</label>
                    </div>
                </div>
                <div className="elem-group">
                    <div className='form-floating mb-3'>
                        <input
                            type="number"
                            id="legajo"
                            name="legajo"
                            value={formData.legajo}
                            onChange={handleChange}
                            className='form-control'
                            required
                        />
                        <label htmlFor="legajo">Legajo</label>
                    </div>
                </div>

                <div className="elem-group form-floating mb-3">
                    <select
                        className="form-control"
                        id="rol"
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                    >
                        {Array.from(roles.keys()).map((key) => (
                            <option key={key} value={key}>{roles.get(key).valor}</option>
                        ))}
                    </select>
                    <label htmlFor="rol">Rol</label>
                </div>

                <div className='elem-group form-floating mb-3'>
                    <input
                        className='form-control'
                        type="password"
                        id="contrasena"
                        name="contrasena"
                        placeholder="XXXXXXXX"
                        value={formData.contrasena}
                        onChange={handleChange}
                        minLength={6}
                    />
                    <label htmlFor="contrasena">Nueva Contraseña (opcional)</label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar cambios
                </button>
            </form>
        </div>
    );
};
