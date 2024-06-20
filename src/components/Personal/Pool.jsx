import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { CardFooter, CardHeader } from 'react-bootstrap';

export const Pool = () => {
    const [conductores, setConductores] = useState([]);
    const [guardatrenes, setGuardatrenes] = useState([]);
    const [rol, setRol] = useState('');
    const [base, setBase] = useState('');
    const [currentView, setCurrentView] = useState('conductores');
    const [currentPage, setCurrentPage] = useState(0);
    const [cardStates, setCardStates] = useState({});

    const itemsPerPage = 4;
    
    //panel de busqueada
    
    // Firestore collections
    const conductoresCollection = collection(db, "conductores");
    const guardatrenesCollection = collection(db, "guardatren");
    const handleBaseChange = (event) => setBase(event.target.value);
    const handleCurrentViewChange = (event) => setCurrentView(event.target.value);
    const handleRolChange = (event) => setRol(event.target.value);
    const handleShow = () => {
        if (currentView === 'conductores') {
            fetchConductores();
        } else if (currentView === 'guardatren') {
            fetchGuardatren();
        }
    };

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
            const data = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => a.orden - b.orden);
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
    };// Número de elementos por página

    /*const fetchConductores = async () => {
        const q = query(collection(db, 'conductores'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setConductores(data);
    };

    const fetchGuardatrenes = async () => {
        const q = query(collection(db, 'guardatrenes'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setGuardatrenes(data);
    };

    useEffect(() => {
        fetchConductores();
        fetchGuardatrenes();
    }, []);

    const handleViewChange = (event) => {
        setCurrentView(event.target.value);
        setCardStates({}); // Limpiar el estado de las tarjetas al cambiar de vista
    };*/

    

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

    const filteredData = (currentView === 'conductores' ? conductores : guardatrenes).filter(person => {
        return (base ? person.base.toLowerCase().includes(base.toLowerCase()) : true);
    });

    // Ordenar por el campo 'orden'
    const sortedData = filteredData.sort((a, b) => a.orden - b.orden);

    // Obtener el número total de páginas
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Dividir los datos en páginas
    const paginatedData = sortedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleSelect = (selectedIndex, e) => {
        setCurrentPage(selectedIndex);
    };

    return (
        <Container>
            <Row>
                <Col>
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
                    
                </Col>
            </Row>
            <Carousel activeIndex={currentPage} onSelect={handleSelect} interval={null}>
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <Carousel.Item key={pageIndex}>
                        <Row>
                            {paginatedData
                                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                .map((person, index) => (
                                    <Col key={index} xs={12} md={6} lg={3}>
                                        <Card
                                            style={{
                                                backgroundColor: currentView === 'conductores' ? 'orange' : 'lightblue',
                                                margin: '10px'
                                            }}
                                        >
                                            <Card.Header>{person.apellido}</Card.Header>
                                            <Card.Body>
                                                <p>Nombre: {person.nombre}</p>
                                                <p>Rol: {person.rol}</p>
                                                <p>Legajo: {person.legajo}</p>
                                                <p>Teléfono: {person.telefono}</p>
                                                <p>Orden: {person.orden}</p>
                                                <p>Cupon: {person.cupon}</p>
                                                <p>Apto: {person.apto}</p>
                                                <p>Secciones: {person.secciones.join(', ')}</p>
                                            </Card.Body>
                                            <CardFooter>
                                                <Button variant="primary" onClick={() => handleAtendio(person.id)}>Atendió</Button>
                                                <Button variant="danger" onClick={() => handleNoAtendio(person.id)}>No Atiende</Button>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};
