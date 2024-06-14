import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Pool = () => {
    const [conductores, setConductores] = useState([]);

    useEffect(() => {
        const fetchConductores = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'conductores'));
                const data = querySnapshot.docs.map(doc => doc.data());
                setConductores(data);
            } catch (error) {
                console.error('Error fetching conductores:', error);
            }
        };

        fetchConductores();
    }, []);

    return (
        <Container>
            <Row>
                {conductores.map((conductor, index) => (
                    <Col key={index} sm={12} md={6} lg={4}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>{conductor.nombre} {conductor.apellido}</Card.Title>
                                <Card.Text><strong>Legajo:</strong> {conductor.legajo}</Card.Text>
                                <Card.Text><strong>Teléfono:</strong> {conductor.tel}</Card.Text>
                                <Card.Text><strong>Base:</strong> {conductor.base}</Card.Text>
                                <Card.Text><strong>Apto:</strong> {conductor.apto}</Card.Text>
                                <Card.Text><strong>Cupón:</strong> {conductor.cupon}</Card.Text>
                                <Card.Text><strong>Tarea:</strong> {conductor.tarea}</Card.Text>
                                <Card.Text><strong>Servicio:</strong> {conductor.servicio}</Card.Text>
                                <Card.Text><strong>Orden:</strong> {conductor.orden}</Card.Text>
                                <Card.Text><strong>Rol:</strong> {conductor.rol}</Card.Text>
                                <Card.Text><strong>Secciones:</strong> {conductor.secciones.join(', ')}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};


