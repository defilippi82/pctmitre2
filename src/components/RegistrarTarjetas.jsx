import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { db } from '../firebaseConfig/firebase';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import CardHeader from 'react-bootstrap/CardHeader';
import CardFooter from 'react-bootstrap/CardFooter';
import { CardGroup } from 'react-bootstrap';

export const RegistrarTarjetas = () => {
    const [apellido, setApellido] = useState('');
    const [conductores, setConductores] = useState([]);
    const [guardatrenes, setGuardatrenes] = useState([]);
    const [currentView, setCurrentView] = useState('conductores');
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
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
    const handleApellidoChange = (event) => setApellido(event.target.value);
    const handleInputChange = (event) => setFormData({
        ...formData,
        [event.target.name]: event.target.value
    });

    useEffect(() => {
        if (currentView === 'conductores') {
            fetchConductores();
        
        }else if (currentView === 'guardatren') {
            fetchGuardatren();
        }
    }, [currentView]);

      const fetchConductores = async () => {
        try {
            const q = query(collection(db, 'conductores'), where('apellido', '==', apellido));
            const data = await getDocs(q);
            setConductores(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching conductores:', error);
        }
    };
    const fetchGuardatren = async () => {
        try {
            const q = query(collection(db, 'guardatren'), where('apellido', '==', apellido));
            const data = await getDocs(q);
            setGuardatrenes(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error('Error fetching guardatren:', error);
        }
    };
    const fetchUserData = async (userId) => {
        try {
            const collectionRef = currentView === 'conductores' ? 'conductores' : 'guardatren';
            const docRef = doc(db, collectionRef, userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setSelectedUser({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await fetchUserData();
    };
    const handleSearch = async (event) => {
        event.preventDefault();
        if (currentView === 'conductores') {
            await fetchConductores();
        } else if (currentView === 'guardatrenes') {
            await fetchGuardatren();
        }
    };

   

    return (
        

        <Container>
            <Form  onSubmit={handleSearch}>
                <Row>
                    <Col>
                    <Form.Group controlId="formViewSelect">
                            <Form.Label>Seleccionar Vista</Form.Label>
                            <Form.Control as="select" value={currentView} onChange={handleViewChange}>
                                <option value="conductores">Conductores</option>
                                <option value="guardatrenes">Guardatren</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control type="text" value={apellido} onChange={handleApellidoChange} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit" style={{ marginTop: '30px' }}>
                            Buscar
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Legajo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {(currentView === 'conductores' ? conductores : guardatrenes).map(user => (
                        <tr key={user.id}>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.legajo}</td>
                            <td>
                                <Button variant="primary" onClick={() => fetchUserData(user.id)}>
                                    Seleccionar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
                {(currentView === 'conductores' ? conductores : guardatrenes).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                    {(currentView === 'conductores' ? conductores : guardatrenes).map(user => (
                        <Card
                            bg={currentView === 'conductores' ? 'warning' : 'secondary'}
                            key={user.id}
                            text='white'
                            style={{ width: '18rem', margin: '10px' }}
                            className="mb-2"
                            onClick={() => fetchUserData(user.id)}
                        >
                            <CardHeader><strong>{user.nombre} {user.apellido}</strong></CardHeader>
                            <Card.Body>
                                <Card.Title>{currentView === 'conductores' ? `Cond.: ${user.rol}` : 'Guarda Tren'}</Card.Title>
                                <Card.Text><strong>Legajo:</strong> {user.legajo}</Card.Text>
                                <Card.Text><strong>Teléfono:</strong> {user.tel}</Card.Text>
                                <Card.Text><strong>Base:</strong> {user.base}</Card.Text>
                                {currentView === 'conductores' && <Card.Text><strong>Orden:</strong> {user.orden}</Card.Text>}
                                <Card.Text><strong>Apto:</strong> {user.apto}</Card.Text>
                                <Card.Text><strong>Cupón:</strong> {user.cupon}</Card.Text>
                                <Card.Text><strong>Tarea:</strong> {user.tarea}</Card.Text>
                                <Card.Text><strong>Servicio:</strong> {user.servicio}</Card.Text>
                                {currentView === 'conductores' && <Card.Text><strong>Secciones:</strong> {user.secciones.join(', ')}</Card.Text>}
                                {currentView === 'guardatrenes' && <Card.Text><strong>Orden:</strong> {user.orden}</Card.Text>}
                            </Card.Body>
                            {currentView === 'guardatrenes' && (
                                <CardFooter>
                                    
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            )}
            {selectedUser && (
                <>
                    <Table responsive="sm" variant="warning" style={{ marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>Día</th>
                                <th>Efectuo el Servicio</th>
                                <th>Tomó</th>
                                <th>Dejó</th>
                                <th>Total de Horas Trab</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><Form.Control type="date" name="dia" value={formData.dia} onChange={handleInputChange} /></td>
                                <td><Form.Control type="text" name="efectuoServicio" value={formData.efectuoServicio} onChange={handleInputChange} /></td>
                                <td><Form.Control type="time" name="tomo" value={formData.tomo} onChange={handleInputChange} /></td>
                                <td><Form.Control type="time" name="dejo" value={formData.dejo} onChange={handleInputChange} /></td>
                                <td><Form.Control type="time" name="totalHorasTrab" value={formData.totalHorasTrab} onChange={handleInputChange} /></td>
                                <td><Form.Control as="textarea" name="observaciones" value={formData.observaciones} onChange={handleInputChange} /></td>
                            </tr>
                        </tbody>
                    </Table>
                </>
            )}
        </Container>
    
    );
};

