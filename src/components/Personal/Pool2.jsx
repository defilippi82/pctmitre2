import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import CardGroup from 'react-bootstrap/CardGroup';
import { CardFooter, CardHeader } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';

export const Pool2 = () => {
    const [currentView, setCurrentView] = useState('');
    const [base, setBase] = useState('');
    const [rol, setRol] = useState('');
    const [conductores, setConductores] = useState([]);
    const [guardatren, setGuardatren] = useState([]);
    const [cardStates, setCardStates] = useState({});
    const [currentPage, setCurrentPage] = useState(0);

    const conductoresCollection = collection(db, "conductores");
    const guardatrenesCollection = collection(db, "guardatren");
    const itemsPerPage = 4;

    const handleBaseChange = (event) => setBase(event.target.value);
    const handleCurrentViewChange = (event) => setCurrentView(event.target.value);
    const handleRolChange = (event) => setRol(event.target.value);

    useEffect(() => {
        if (currentView) {
            handleShow();
        }
    }, [currentView]);

    const fetchConductores = async () => {
        try {
            let q = query(conductoresCollection);
            if (base) q = query(q, where('base', '==', base));
            if (rol) q = query(q, where('rol', '==', rol));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => a.orden - b.orden);
            setConductores(data);
        } catch (error) {
            console.error('Error fetching conductores:', error);
        }
    };

    const fetchGuardatren = async () => {
        try {
            let q = query(guardatrenesCollection);
            if (base) q = query(q, where('base', '==', base));
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

    const handleAtendio = (id) => {
        setCardStates(prevState => ({
            ...prevState,
            [id]: { ...prevState[id], hidden: true }
        }));
    };

    const handleNoAtendio = (id) => {
        setCardStates(prevState => ({
            ...prevState,
            [id]: { ...prevState[id], color: 'danger' }
        }));
    };

    const filteredData = currentView === 'conductores' ? conductores : guardatren;
    const sortedData = filteredData.sort((a, b) => a.orden - b.orden);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleSelect = (selectedIndex) => {
        setCurrentPage(selectedIndex);
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
                    <Form.Control as="select" value={currentView} onChange={handleCurrentViewChange}>
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
            <Carousel activeIndex={currentPage} onSelect={handleSelect} interval={null}>
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <Carousel.Item key={pageIndex}>
                        <CardGroup>
                            <Row>
                                {paginatedData.map((person, index) => (
                                    <Col key={index} sm={12} md={6} lg={4}>
                                        <Card
                                            bg={cardStates[person.legajo]?.color || 'light'}
                                            text={(cardStates[person.legajo]?.color) ? 'dark' : 'black'}
                                            style={{ width: '18rem', display: cardStates[person.legajo]?.hidden ? 'none' : 'block' }}
                                            className="mb-2"
                                        >
                                            <CardHeader><strong>{person.nombre} {person.apellido}</strong></CardHeader>
                                            <Card.Body>
                                                <Card.Title>{currentView === 'conductores' ? `Cond.: ${person.rol}` : 'Guarda Tren'}</Card.Title>
                                                <Card.Text><strong>Legajo:</strong> {person.legajo}</Card.Text>
                                                <Card.Text><strong>Teléfono:</strong> {person.tel}</Card.Text>
                                                <Card.Text><strong>Base:</strong> {person.base}</Card.Text>
                                                <Card.Text><strong>Apto:</strong> {person.apto}</Card.Text>
                                                <Card.Text><strong>Cupón:</strong> {person.cupon}</Card.Text>
                                                <Card.Text><strong>Tarea:</strong> {person.tarea}</Card.Text>
                                                <Card.Text><strong>Servicio:</strong> {person.servicio}</Card.Text>
                                                <Card.Text><strong>Orden:</strong> {person.orden}</Card.Text>
                                                {currentView === 'conductores' && <Card.Text><strong>Secciones:</strong> {person.secciones.join(', ')}</Card.Text>}
                                            </Card.Body>
                                            <CardFooter>
                                                <Button variant="primary" onClick={() => handleAtendio(person.legajo)}>Atendió</Button>
                                                <Button variant="danger" onClick={() => handleNoAtendio(person.legajo)}>No Atiende</Button>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </CardGroup>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};
