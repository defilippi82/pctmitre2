import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from "sweetalert2";

export const EditarOperadores = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        legajo: '',
        roles: [],
        contrasena: ''

    });
    
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Lista completa para el administrador
    const todasLasMesas = ['electrico', 'diesel', 'gde', 'emergencia', 'personal', 'administrador'];

    useEffect(() => {
        const getOperador = async () => {
            try {
                // CORREGIDO: Eliminada la doble llamada a doc()
                const docRef = doc(db, "operadores", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Normalizamos los roles para que siempre sean un Array (soporta datos viejos)
                    const rolesNormalizados = Array.isArray(data.roles) 
                        ? data.roles 
                        : (data.rol?.valor ? [data.rol.valor] : []);
                    
                    // Cargamos los datos en el estado para que aparezcan en los inputs

                    setFormData({
                        nombre: data.nombre || '',
                        apellido: data.apellido || '',
                        email: data.email || '',
                        legajo: data.legajo || '',
                        roles: rolesNormalizados,
                        contrasena: data.contrasena || ''
                    });
                } else {
                    Swal.fire("Error", "No se encontró el operador", "error");
                    navigate('/administracion');
                }
            } catch (error) {
                console.error("Error al obtener operador:", error);
                Swal.fire("Error", "Error de conexión con la base de datos", "error");
            }
        };
        getOperador();
    }, [id, navigate]);

    // Función genérica para manejar los cambios en texto
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Función para manejar los roles (Checkboxes)
    const handleCheckboxChange = (mesa) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.includes(mesa) 
                ? prev.roles.filter(r => r !== mesa) 
                : [...prev.roles, mesa]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, "operadores", id);
            await updateDoc(docRef, formData);
            Swal.fire("Éxito", "Los datos se actualizaron correctamente", "success");
            navigate('/administracion');
        } catch (error) {
            Swal.fire("Error", "No se pudieron guardar los cambios", "error");
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow">
                <h3 className="border-bottom pb-2 mb-4 text-secondary">
                    Editar Perfil: <span className="text-dark">{formData.nombre} {formData.apellido}</span>
                </h3>
                
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="fw-bold form-label">Nombre</label>
                        <input 
                            name="nombre" 
                            className="form-control" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="fw-bold form-label">Apellido</label>
                        <input 
                            name="apellido" 
                            className="form-control" 
                            value={formData.apellido} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8 mb-3">
                        <label className="fw-bold form-label">Email</label>
                        <input 
                            name="email" 
                            type="email" 
                            className="form-control" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="fw-bold form-label">Legajo</label>
                        <input 
                            name="legajo" 
                            className="form-control" 
                            value={formData.legajo} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="mb-4 p-3 border rounded bg-light">
                    <label className="fw-bold mb-3 d-block">Asignación de Roles y Permisos:</label>
                    <div className="row">
                        {todasLasMesas.map(mesa => (
                            <div key={mesa} className="col-6 col-md-4 mb-2">
                                <div className="form-check form-switch">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id={`check-${mesa}`}
                                        checked={formData.roles.includes(mesa)}
                                        onChange={() => handleCheckboxChange(mesa)} 
                                    />
                                    <label 
                                        className={`form-check-label text-capitalize ${mesa === 'administrador' ? 'text-danger fw-bold' : ''}`} 
                                        htmlFor={`check-${mesa}`}
                                    >
                                        {mesa}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="fw-bold form-label">Contraseña</label>
                    <input 
                        name="contrasena" 
                        type="text" 
                        className="form-control" 
                        value={formData.contrasena} 
                        onChange={handleChange} 
                        placeholder="Modificar contraseña"
                    />
                    <small className="text-muted">Si no desea cambiarla, mantenga la actual.</small>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end border-top pt-3">
                    <button type="button" className="btn btn-outline-secondary me-md-2" onClick={() => navigate('/administracion')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary px-5">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};