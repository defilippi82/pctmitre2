import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import Button  from 'react-bootstrap/Button';
import CardGroup from 'react-bootstrap/CardGroup';
import { CardFooter, CardHeader } from 'react-bootstrap';

export const Pool = () => {
    const [currentView, setCurrentView] = useState('');
    const [base, setBase] = useState('');
    const [rol, setRol] = useState('');
    const [conductores, setConductores] = useState([]);
    const [guardatren, setGuardatren] = useState([]);

     // Firestore collections
     const conductoresCollection = collection(db, "conductores");
     const guardatrenesCollection = collection(db, "guardatren");

    const handleBaseChange = (event) => setBase(event.target.value);
    const handlecurrentViewChange = (event) => setCurrentView(event.target.value);
    const handleRolChange = (event) => setRol(event.target.value);

    useEffect(() => {
        if (currentView) {
            handleShow();
        }
    }, [currentView]);

    const fetchConductores = async () => {
        try {
            let q = query(conductoresCollection);

            if (base) {
                q = query(q, where('base', '==', base));
            }
            if (rol) {
                q = query(q, where('rol', '==', rol));
            
            }

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => doc.data()).sort((a, b)=> a.orden - b.orden);
            setConductores(data);
        } catch (error) {
            console.error('Error fetching conductores:', error);
        }
    };

    const fetchGuardatren = async () => {
        try {
            let q = query(guardatrenesCollection);
            if (base) {
                q = query(q, where('base', '==', base));
            }
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => doc.data());
            setGuardatren(data);
        } catch (error) {
            console.error('Error fetching guardatren:', error);
        }
    };

    const handleShow = () => {
        if (currentView === 'conductores') {
            fetchConductores();
        } else if (currentView === 'guardatren') {
            fetchGuardatren();
        }
    };


    return (
        <Container>
            <Form>
                <Form.Group controlId="baseSelect">
                    <Form.Label>Base Operativa</Form.Label>
                    <Form.Control as="select" value={base} onChange={handleBaseChange}>
                        <option value="">Seleccione una base</option>
                        <option value="victoria">Victoria</option>
                        <option value="suarez">Suarez</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="currentViewSelect">
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control as="select" value={currentView} onChange={handlecurrentViewChange}>
                        <option value="">Seleccione una especialidad</option>
                        <option value="conductores">Conductores</option>
                        <option value="guardatren">Guardas</option>
                    </Form.Control>
                </Form.Group>
                {currentView === 'conductores' && (
                <Form.Group controlId="rolSelect">
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control as="select" value={rol} onChange={handleRolChange}>
                        <option value="">Seleccione una especialidad</option>
                        <option value="diesel">Cond. Diesel</option>
                            <option value="electrico">Cond. Electrico</option>
                            <option value="instructorld">Instructor Tec. LF LD</option>
                            <option value="instructorelec">Instructor Tec. LF Elec.</option>
                            <option value="inspectorelec">Inspector Tec. LF Elec.</option>
                            <option value="inspectorld">Inspector Tec. LF LD.</option>
                            <option value="preConductor">Pre-Cond. Operativo</option>
                    </Form.Control>
                </Form.Group>
                )}
               <Button variant="warning" onClick={handleShow}>Mostrar</Button>
            </Form>
            <CardGroup>
                <Row>
                {currentView === 'conductores' && conductores.map((conductor, index) => (
                    <Col key={index} sm={12} md={6} lg={4}>
                        
                            
                        
                        {['Success',].map((variant) => (
                            <Card
                            bg={variant.toLowerCase()}
                            key={variant}
                            text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                            style={{ width: '18rem' }}
                            className="mb-2"
                            >
                            <CardHeader><strong>{conductor.nombre} {conductor.apellido}</strong></CardHeader>
                            <Card.Body>
                                <Card.Title><strong>Cond.:</strong> {conductor.rol}</Card.Title>
                                <Card.Text><strong>Legajo:</strong> {conductor.legajo}</Card.Text>
                                <Card.Text><strong>Teléfono:</strong> {conductor.tel}</Card.Text>
                                <Card.Text><strong>Base:</strong> {conductor.base}</Card.Text>
                                <Card.Text><strong>Apto:</strong> {conductor.apto}</Card.Text>
                                <Card.Text><strong>Cupón:</strong> {conductor.cupon}</Card.Text>
                                <Card.Text><strong>Tarea:</strong> {conductor.tarea}</Card.Text>
                                <Card.Text><strong>Servicio:</strong> {conductor.servicio}</Card.Text>
                                <Card.Text><strong>Orden:</strong> {conductor.orden}</Card.Text>
                                <Card.Text><strong>Secciones:</strong> {conductor.secciones.join(', ')}</Card.Text>
                            </Card.Body>
                                <CardFooter>
                                    <Button variant="primary" onClick={''}>Atendió</Button>
                                    <Button variant="danger" onClick={''}>No Atiende</Button>
                                </CardFooter>
                        </Card>
                    ))}
                    </Col>
                ))}
                {currentView === 'guardatren' && guardatren.map((guarda, index) => (
                    <Col key={index} sm={12} md={6} lg={4}>
                        {['Secondary',].map((variant) => (
                            <Card
                            bg={variant.toLowerCase()}
                            key={variant}
                            text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
                            style={{ width: '18rem' }}
                            className="mb-2"
                            >
                                <CardHeader><strong>{guarda.nombre} {guarda.apellido}</strong></CardHeader>
                            <Card.Body>
                                <Card.Title><strong>Guarda Tren</strong></Card.Title>
                                <Card.Text><strong>Legajo:</strong> {guarda.legajo}</Card.Text>
                                <Card.Text><strong>Teléfono:</strong> {guarda.tel}</Card.Text>
                                <Card.Text><strong>Base:</strong> {guarda.base}</Card.Text>
                                <Card.Text><strong>Apto:</strong> {guarda.apto}</Card.Text>
                                <Card.Text><strong>Cupón:</strong> {guarda.cupon}</Card.Text>
                                <Card.Text><strong>Tarea:</strong> {guarda.tarea}</Card.Text>
                                <Card.Text><strong>Servicio:</strong> {guarda.servicio}</Card.Text>
                                <Card.Text><strong>Orden:</strong> {guarda.orden}</Card.Text>
                                <Button variant="primary" onClick={''}>Atendió</Button>
                                <Button variant="danger" onClick={''}>No Atiende</Button>
                                
                            </Card.Body>
                        </Card>
                        ))}
                    </Col>
                ))}
            </Row>
            </CardGroup>
        </Container>
    );
};