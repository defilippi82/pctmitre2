import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';

// Mantenemos las listas para que el usuario pueda corregir usando los selectores
const ESTACIONES = ["Retiro", "Zárate", "Rosario", "San Lorenzo", "Córdoba", "Tucumán"];
const EMPRESAS = ["NCA", "Ferrosur Roca", "Belgrano Cargas", "Ferroexpreso Pampeano", "Fepasa"];

export const EditarTarjeta = () => {
    const [formData, setFormData] = useState({
        fecha: '',
        tren: '',
        locomotora: '',
        empresa: '',
        origen: '',
        destino: '',
        horaInicio: '',
        horaLlegada: '',
        toneladasNetas: '',
        tara: '',
        toneladasBrutas: 0,
        operador: ''
    });
    
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getTarjeta = async () => {
            try {
                const docRef = doc(db, "Tarjetas", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    Swal.fire("Error", "No se encontró el registro", "error");
                    navigate('/tarjetas');
                }
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Error al conectar con la base de datos", "error");
            }
        };
        getTarjeta();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            // Mantenemos el cálculo automático de Brutas al editar
            if (name === 'toneladasNetas' || name === 'tara') {
                updated.toneladasBrutas = Number(updated.toneladasNetas || 0) + Number(updated.tara || 0);
            }
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, "Tarjetas", id);
            await updateDoc(docRef, formData);
            Swal.fire("¡Actualizado!", "La tarjeta se modificó correctamente", "success");
            navigate('/tarjetas');
        } catch (error) {
            Swal.fire("Error", "No se pudieron guardar los cambios", "error");
        }
    };

    return (
        <Container className="mt-5" style={{paddingTop: '30px'}}>
            <Card className="p-4 shadow">
                <h4 className="text-primary mb-4 border-bottom pb-2">Editar Tarjeta de Tren</h4>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={4} className="mb-3">
                            <Form.Label className="fw-bold">Fecha</Form.Label>
                            <Form.Control name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
                        </Col>
                        <Col md={4} className="mb-3">
                            <Form.Label className="fw-bold">N° Tren</Form.Label>
                            <Form.Control name="tren" value={formData.tren} onChange={handleChange} required />
                        </Col>
                        <Col md={4} className="mb-3">
                            <Form.Label className="fw-bold">Locomotora</Form.Label>
                            <Form.Control name="locomotora" value={formData.locomotora} onChange={handleChange} />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-bold">Hora Inicio</Form.Label>
                            <Form.Control name="horaInicio" type="time" value={formData.horaInicio} onChange={handleChange} />
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Label className="fw-bold">Hora Llegada</Form.Label>
                            <Form.Control name="horaLlegada" type="time" value={formData.horaLlegada} onChange={handleChange} />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4} className="mb-3">
                            <Form.Label className="fw-bold">Empresa</Form.Label>
                            <Form.Select name="empresa" value={formData.empresa} onChange={handleChange}>
                                <option value="">Seleccione...</option>
                                {EMPRESAS.map(e => <option key={e} value={e}>{e}</option>)}
                            </Form.Select>
                        </Col>
                        <Col md={4} className="mb-3">
                            <Form.Label className="fw-bold">Origen</Form.Label>
                            <Form.Select name="origen" value={formData.origen} onChange={handleChange}>
                                <option value="">Seleccione...</option>
                                {ESTACIONES.map(e => <option key={e} value={e}>{e}</option>)}
                            </Form.Select>
                        </Col>
                        <Col md={4} className="mb-3">
                            <Form.Label className="fw-bold">Destino</Form.Label>
                            <Form.Select name="destino" value={formData.destino} onChange={handleChange}>
                                <option value="">Seleccione...</option>
                                {ESTACIONES.map(e => <option key={e} value={e}>{e}</option>)}
                            </Form.Select>
                        </Col>
                    </Row>

                    <Row className="bg-light p-3 rounded mb-4">
                        <Col md={4}>
                            <Form.Label className="fw-bold">Ton. Netas</Form.Label>
                            <Form.Control name="toneladasNetas" type="number" value={formData.toneladasNetas} onChange={handleChange} />
                        </Col>
                        <Col md={4}>
                            <Form.Label className="fw-bold">Tara</Form.Label>
                            <Form.Control name="tara" type="number" value={formData.tara} onChange={handleChange} />
                        </Col>
                        <Col md={4}>
                            <Form.Label className="fw-bold text-primary">Total Bruto</Form.Label>
                            <Form.Control value={formData.toneladasBrutas} disabled className="fw-bold bg-warning-subtle" />
                        </Col>
                    </Row>

                    <div className="d-flex gap-2">
                        <Button variant="primary" type="submit" className="px-5">Actualizar Registro</Button>
                        <Button variant="outline-secondary" onClick={() => navigate('/tarjetas')}>Cancelar</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};