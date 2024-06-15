import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CardGroup } from 'react-bootstrap';

export const RegistrarTarjetas = () => {
    const [currentView, setCurrentView] = useState('');
    const [legajo, setLegajo] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [formData, setFormData] = useState({
        dia: '',
        efectuoServicio: '',
        tomo: '',
        dejo: '',
        horasDisp: '',
        totalHorasTrab: '',
        observaciones: ''
    });

    const handleViewChange = (event) => setCurrentView(event.target.value);
    const handleLegajoChange = (event) => setLegajo(event.target.value);
    const handleInputChange = (event) => setFormData({
        ...formData,
        [event.target.name]: event.target.value
    });

    const fetchUserData = async () => {
        try {
            const collectionRef = currentView === 'conductores' ? 'conductores' : 'guardatren';
            const docRef = doc(db, collectionRef, legajo);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setNombre(data.nombre);
                setApellido(data.apellido);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const collectionRef = currentView === 'conductores' ? 'conductores' : 'guardatren';
            const docRef = doc(db, collectionRef, legajo);

            await updateDoc(docRef, {
                ...formData
            });
            alert('Datos actualizados con éxito');
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    useEffect(() => {
        if (legajo && currentView) {
            fetchUserData();
        }
    }, [legajo, currentView]);

    return (
        <Container>
            <Form>
                <Form.Group controlId="currentViewSelect">
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control as="select" value={currentView} onChange={handleViewChange}>
                        <option value="">Seleccione una especialidad</option>
                        <option value="conductores">Conductores</option>
                        <option value="guardatren">Guardas</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="legajoInput">
                    <Form.Label>Legajo</Form.Label>
                    <Form.Control type="text" value={legajo} onChange={handleLegajoChange} placeholder="Ingrese el legajo" />
                </Form.Group>
                {nombre && apellido && (
                    <div>
                        <p><strong>Nombre:</strong> {nombre}</p>
                        <p><strong>Apellido:</strong> {apellido}</p>
                    </div>
                )}
                
                <Row>
                    <Col>
                    
                        <Col>
                        <Form.Group controlId="diaInput">
                            <Form.Label>Dia</Form.Label>
                            <Form.Control type="date" name="dia" value={formData.dia} onChange={handleInputChange} />
                        </Form.Group>
                        </Col>    
                    
                    <Col>
                        <Form.Group controlId="efectuoServicioInput">
                            <Form.Label>Efectuo el Servicio</Form.Label>
                            <Form.Control type="text" name="efectuoServicio" value={formData.efectuoServicio} onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tomoInput">
                            <Form.Label>Tomo</Form.Label>
                            <Form.Control type="time" name="tomo" value={formData.tomo} onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="dejoInput">
                            <Form.Label>Dejó</Form.Label>
                            <Form.Control type="time" name="dejo" value={formData.dejo} onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="horasDispInput">
                            <Form.Label>H. de disp</Form.Label>
                            <Form.Control type="time" name="horasDisp" value={formData.horasDisp} onChange={handleInputChange} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="totalHorasTrabInput">
                            <Form.Label>Total de Horas Trab</Form.Label>
                            <Form.Control type="time" name="totalHorasTrab" value={formData.totalHorasTrab} onChange={handleInputChange} />
                        </Form.Group>
                        </Col>
                        
                    </Col>
                    
                </Row>
                
                <Form.Group controlId="observacionesInput">
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control as="textarea" name="observaciones" value={formData.observaciones} onChange={handleInputChange} />
                </Form.Group>
                <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
            </Form>
        </Container>
    );
};

