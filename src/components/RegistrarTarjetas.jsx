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

    const handleShow = () => {
        if (currentView === 'conductores') {
            fetchConductores();
        } else if (currentView === 'guardatren') {
            fetchGuardatren();
        }
    };

    return (
        <div className="">

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
                    <Button variant="warning" onClick={handleShow}>Mostrar</Button>
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

            <div>
      <Table responsive="sm">
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
          <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
          </div> 
          
             
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
                <Form>
                <Form.Group controlId="observacionesInput">
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control as="textarea" name="observaciones" value={formData.observaciones} onChange={handleInputChange} />
                </Form.Group>
                <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
            </Form>
        </Container>
     </div>
    );
};

