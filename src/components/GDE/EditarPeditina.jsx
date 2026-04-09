import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { Form, Button, Container, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';

export const EditarPeditina = () => {
    const [formData, setFormData] = useState({
        fecha: '',
        tren: '',
        equipo: '',
        ubicacion: '',
        hora: '',
        operador: ''
    });
    
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getPeditina = async () => {
            const docRef = doc(db, "Peditinas", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFormData(docSnap.data());
            } else {
                Swal.fire("Error", "No se encontró el registro", "error");
                navigate('/peditina');
            }
        };
        getPeditina();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, "Peditinas", id), formData);
            Swal.fire("Actualizado", "Registro modificado con éxito", "success");
            navigate('/peditina');
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar", "error");
        }
    };

    return (
        <Container className="mt-5" style={{paddingTop: '30px'}}>
            <Card className="p-4 shadow">
                <h4 className="text-danger mb-4">Editar Registro de Peditina</h4>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <label className="fw-bold">Fecha</label>
                        <Form.Control name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <label className="fw-bold">Tren</label>
                        <Form.Control name="tren" value={formData.tren} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <label className="fw-bold">Equipo</label>
                        <Form.Control name="equipo" value={formData.equipo} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <label className="fw-bold">Ubicación</label>
                        <Form.Control name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <label className="fw-bold">Hora</label>
                        <Form.Control name="hora" type="time" value={formData.hora} onChange={handleChange} />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button variant="danger" type="submit" className="flex-grow-1">Guardar Cambios</Button>
                        <Button variant="secondary" onClick={() => navigate('/peditina')}>Cancelar</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};