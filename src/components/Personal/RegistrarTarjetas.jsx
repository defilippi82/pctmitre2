import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { db } from '../../firebaseConfig/firebase';
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
import Swal from 'sweetalert2';

export const RegistrarTarjetas = () => {
    const [apellido, setApellido] = useState('');
    const [base, setBase] = useState('');
    const [legajo, setLegajo] = useState('');
    const [rol, setRol] = useState('');
    const [conductores, setConductores] = useState([]);
    const [guardatrenes, setGuardatrenes] = useState([]);
    const [currentView, setCurrentView] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        diaInicio: '',
        diaFin: '',
        efectuoServicio: '',
        tomo: '',
        dejo: '',
        totalHorasTrab: '',
        observaciones: ''
    });

    const handleViewChange = (event) => setCurrentView(event.target.value);
    const handleApellidoChange = (event) => setApellido(event.target.value);
    const handleBaseChange = (event) => setBase(event.target.value);
    const handleLegajoChange = (event) => setLegajo(event.target.value);
    const handleInputChange = (event) => setFormData({
        ...formData,
        [event.target.name]: event.target.value
    });

    const fetchConductores = async () => {
        const q = query(collection(db, 'conductores'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setConductores(data);
    };

    const fetchGuardatren = async () => {
        const q = query(collection(db, 'guardatrenes'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setGuardatrenes(data);
    };

    useEffect(() => {
        if (currentView === 'conductores') {
            fetchConductores();
        } else if (currentView === 'guardatren') {
            fetchGuardatren();
        }
    }, [currentView]);

    const filteredData = (currentView === 'conductores' ? conductores : guardatrenes).filter(person => {
        return (
            (apellido ? person.apellido.toLowerCase().includes(apellido.toLowerCase()) : true) &&
            (base ? person.base.toLowerCase().includes(base.toLowerCase()) : true) &&
            (legajo ? person.legajo.toString().includes(legajo) : true) &&
            (rol ? person.rol.toLowerCase().includes(rol.toLowerCase()) : true)
        );
    });

    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const collectionRef = currentView === 'conductores' ? 'conductores' : 'guardatrenes';
            const docRef = doc(db, collectionRef, selectedUser.id);
            await updateDoc(docRef, formData);
            Swal.fire('Éxito', 'Datos registrados correctamente.', 'success');
        } catch (error) {
            console.error('Error updating document:', error);
            Swal.fire('Error', 'Hubo un problema al registrar los datos.', 'error');
        }
    };

    useEffect(() => {
        if (formData.tomo && formData.dejo) {
            const tomoTime = new Date(`1970-01-01T${formData.tomo}:00`);
            const dejoTime = new Date(`1970-01-01T${formData.dejo}:00`);
            const diff = (dejoTime - tomoTime) / (1000 * 60 * 60);
            setFormData(prevFormData => ({
                ...prevFormData,
                totalHorasTrab: diff.toFixed(2)
            }));
        }
    }, [formData.tomo, formData.dejo]);

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
                            <Form.Control as="select" value={currentView} onChange={handleViewChange}>
                                <option value="">Seleccione una especialidad</option>
                                <option value="conductores">Conductores</option>
                                <option value="guardatren">Guardas</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formLegajo">
                            <Form.Label>Legajo</Form.Label>
                            <Form.Control type="number" value={legajo} onChange={handleLegajoChange} />
                        </Form.Group>
                        <Form.Group controlId="formApellido">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control type="text" value={apellido} onChange={handleApellidoChange} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <CardGroup>
                        {paginatedData.map((person, index) => (
                            <Card
                                key={index}
                                style={{
                                    backgroundColor: currentView === 'conductores' ? 'orange' : 'lightblue'
                                }}
                            >
                                <CardHeader>{person.apellido}</CardHeader>
                                <Card.Body>
                                    <p>Base: {person.base}</p>
                                    <p>Legajo: {person.legajo}</p>
                                    <p>Rol: {person.rol}</p>
                                    {/* Aquí puedes agregar más campos e interacciones */}
                                </Card.Body>
                                <CardFooter>
                                    <Button onClick={() => setSelectedUser(person)}>Seleccionar</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardGroup>
                    <div className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                            <Button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</Button>
                        ))}
                    </div>
                </Col>
            </Row>
            {selectedUser && (
                <>
                    <Table responsive="sm" variant="warning" style={{ marginTop: '20px' }}>
                        <thead>
                            <tr>
                                <th>Día Inicio</th>
                                <th>Día Fin</th>
                                <th>Efectuó el Servicio</th>
                                <th>Tomó</th>
                                <th>Dejó</th>
                                <th>Total de Horas Trab</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><Form.Control type="date" name="diaInicio" value={formData.diaInicio} onChange={handleInputChange} /></td>
                                <td><Form.Control type="date" name="diaFin" value={formData.diaFin} onChange={handleInputChange} /></td>
                                <td><Form.Control type="number" name="efectuoServicio" value={formData.efectuoServicio} onChange={handleInputChange} /></td>
                                <td><Form.Control type="time" name="tomo" value={formData.tomo} onChange={handleInputChange} /></td>
                                <td><Form.Control type="time" name="dejo" value={formData.dejo} onChange={handleInputChange} /></td>
                                <td><Form.Control type="text" name="totalHorasTrab" value={formData.totalHorasTrab} readOnly /></td>
                                <td><Form.Control as="textarea" name="observaciones" value={formData.observaciones} onChange={handleInputChange} /></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="primary" onClick={handleRegister} style={{ marginTop: '20px' }}>
                        Registrar
                    </Button>
                </>
            )}
        </Container>
    );
};
