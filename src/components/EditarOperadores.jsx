import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


export const EditarOperadores = () => {
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        legajo: '',
        rol:'',
        contrasena: ''
        });
        const { id } = useParams();
        const navigate = useNavigate();
        const roles = new Map([
            ['administrador', { valor: 'administrador', administrador: true, electrico: true, personal: true, emergencia: true, diesel: true, usuario: true }],
            ['electrico', { valor: 'electrico', administrador: false, electrico: true, personal: false, emergencia: false, diesel: false, usuario: false }],
            ['diesel', { valor: 'diesel', administrador: false, electrico: false, personal: false, emergencia: false, diesel: true, usuario: false }],
            ['personal', { valor: 'personal', administrador: false, electrico: false, personal: true, emergencia: false, diesel: false, usuario: false }],
            ['emergencia', { valor: 'emergencia', administrador: false, electrico: false, personal: false, emergencia: true, diesel: false, usuario: false }],
            ['usuario', { valor: 'usuario', administrador: false, electrico: false, personal: true, emergencia: false, diesel: false, usuario: true }],
            ['relevante', { valor: 'relevante', administrador: false, electrico: true, personal: true, emergencia: true, diesel: true, usuario: true }],
        ]);
        useEffect(() => {
            const getOperador = async () => {
                const operadorDoc = await getDoc(doc(db, 'operadores', id));
                if (operadorDoc.exists()) {
                    const data = operadorDoc.data();
                    setFormData({
                        ...data,
                        rol: roles.get(data.rol.valor) || ''
                    });
                } else {
                    MySwal.fire('Error', 'Operador no encontrado', 'error');
                    navigate('/administracion');
                }
            };
    
            getOperador();
        }, [id, navigate]);
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: name === 'rol' ? roles.get(value) : value
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const operadorDoc = doc(db, 'operadores', id);
                await updateDoc(operadorDoc, formData);
                MySwal.fire('Actualizado', 'Operador actualizado correctamente', 'success');
                navigate('/administracion');
            } catch (error) {
                MySwal.fire('Error', 'Hubo un error al actualizar el operador', 'error');
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
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="nombre">Nombre</label>
                    </div>
                </div>
                <div className="elem-group">
                    <div className='form-floating mb-3'>
                        <input
                            className='form-control'
                            type="text"
                            id="apellido"
                            name="apellido"
                            placeholder="Apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="apellido">Apellido</label>
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
                        value={formData.rol.valor}
                        onChange={handleChange}
                        required
                    >
                        {Array.from(roles.keys()).map((key) => (
                            <option key={key} value={key} >
              {key}</option>
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
