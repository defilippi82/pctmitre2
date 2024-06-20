import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { Form, Table, Button, FloatingLabel, Row, Col, Pagination } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
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
    const [formData, setFormData] = useState({
        diaInicio: '',
        efectuoServicio: '',
        licencia: '',
        franco: false,
        descanso: false,
        tomo: '',
        dejo: '',
        hdisp: '',
        totalHorasTrab: '',
        observaciones: ''
    });

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 3;

    const handleViewChange = (event) => setCurrentView(event.target.value);
    const handleApellidoChange = (event) => setApellido(event.target.value);
    const handleBaseChange = (event) => setBase(event.target.value);
    const handleLegajoChange = (event) => setLegajo(event.target.value);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

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

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const servicio = formData.licencia || (formData.franco ? 'Fco' : '') || (formData.descanso ? 'Desc' : '');
        setData([...data, { ...formData, servicio }]);
        setFormData({
            diaInicio: '',
            efectuoServicio: '',
            licencia: '',
            franco: false,
            descanso: false,
            tomo: '',
            dejo: '',
            hdisp: '',
            totalHorasTrab: '',
            observaciones: ''
        });
    };

    const handleEdit = (index) => {
        Swal.fire({
            title: 'Editar Registro',
            html: `
                <input type="date" id="diaInicio" class="swal2-input" value="${data[index].diaInicio}">
                <input type="number" id="efectuoServicio" class="swal2-input" value="${data[index].efectuoServicio}">
                <select id="licencia" class="swal2-input" value="${data[index].licencia}">
                    <option value="">Seleccione</option>
                    <option value="por enfermedad">por enfermedad</option>
                    <option value="por enfermedad familiar">por enfermedad familiar</option>
                    <option value="por maternidad">por maternidad</option>
                    <option value="por vacaciones">por vacaciones</option>
                    <option value="deportiva">deportiva</option>
                    <option value="por ART">por ART</option>
                    <option value="por fallecimiento familiar cercano">por fallecimiento familiar cercano</option>
                    <option value="por fallecimiento familiar">por fallecimiento familiar</option>
                </select>
                <input type="checkbox" id="franco" class="swal2-checkbox" ${data[index].franco ? 'checked' : ''}> Franco
                <input type="checkbox" id="descanso" class="swal2-checkbox" ${data[index].descanso ? 'checked' : ''}> Descanso
                <input type="time" id="tomo" class="swal2-input" value="${data[index].tomo}">
                <input type="time" id="dejo" class="swal2-input" value="${data[index].dejo}">
                <input type="time" id="hdisp" class="swal2-input" value="${data[index].hdisp}">
                <input type="text" id="totalHorasTrab" class="swal2-input" value="${data[index].totalHorasTrab}">
                <textarea id="observaciones" class="swal2-textarea">${data[index].observaciones}</textarea>`,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    diaInicio: document.getElementById('diaInicio').value,
                    efectuoServicio: document.getElementById('efectuoServicio').value,
                    licencia: document.getElementById('licencia').value,
                    franco: document.getElementById('franco').checked,
                    descanso: document.getElementById('descanso').checked,
                    tomo: document.getElementById('tomo').value,
                    dejo: document.getElementById('dejo').value,
                    hdisp: document.getElementById('hdisp').value,
                    totalHorasTrab: document.getElementById('totalHorasTrab').value,
                    observaciones: document.getElementById('observaciones').value,
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const servicio = result.value.licencia || (result.value.franco ? 'Fco' : '') || (result.value.descanso ? 'Desc' : '');
                const updatedData = [...data];
                updatedData[index] = { ...result.value, servicio };
                setData(updatedData);
            }
        });
    };

    const handleDelete = (index) => {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
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

    const renderPaginationItems = () => {
        const items = [];
        if (totalPages <= 7) {
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            items.push(
                <Pagination.Item key={1} active={currentPage === 1} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            if (currentPage > 4) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }
            let start = Math.max(2, currentPage - 2);
            let end = Math.min(totalPages - 1, currentPage + 2);
            for (let number = start; number <= end; number++) {
                items.push(
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                        {number}
                    </Pagination.Item>
                );
            }
            if (currentPage < totalPages - 3) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }
            items.push(
                <Pagination.Item key={totalPages} active={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Form.Group controlId="formViewSelect">
                        <Form.Label>Seleccione Vista</Form.Label>
                        <Form.Control as="select" value={currentView} onChange={handleViewChange}>
                            <option value="">Seleccione</option>
                            <option value="conductores">Conductores</option>
                            <option value="guardatren">Guardatrenes</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formBase">
                        <Form.Label>Base</Form.Label>
                        <Form.Control type="text" value={base} onChange={handleBaseChange} />
                    </Form.Group>
                    <Form.Group controlId="formLegajo">
                        <Form.Label>Legajo</Form.Label>
                        <Form.Control type="number" value={legajo} onChange={handleLegajoChange} />
                    </Form.Group>
                    <Form.Group controlId="formApellido">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control type="text" value={apellido} onChange={handleApellidoChange} />
                    </Form.Group>
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
                                <Card.Header as="h5">{person.apellido}</Card.Header>
                                <Card.Body>
                                    <p>Base: {person.base}</p>
                                    <p>Legajo: {person.legajo}</p>
                                    <p>Rol: {person.rol}</p>
                                </Card.Body>
                                <Card.Footer>
                                    <Button onClick={() => setSelectedUser(person)}>Seleccionar</Button>
                                </Card.Footer>
                            </Card>
                        ))}
                    </CardGroup>
                    <Pagination className="justify-content-center mt-3">
                        <Pagination.First onClick={() => handlePageChange(1)} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {renderPaginationItems()}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
                    </Pagination>
                </Col>
            </Row>
            <div>
                {selectedUser && (
                    <Form onSubmit={handleSubmit}>
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingDiaInicio" label="Día">
                                    <Form.Control type="date" name="diaInicio" value={formData.diaInicio} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingEfectuoServicio" label="Efectuó el Servicio">
                                    <Form.Control type="number" name="efectuoServicio" value={formData.efectuoServicio} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                <Form.Check
                                    type="checkbox"
                                    name="franco"
                                    checked={formData.franco}
                                    onChange={handleInputChange}
                                    label="Franco"
                                    className="mt-4"
                                />
                            </Col>
                            <Col xs="auto">
                                <Form.Check
                                    type="checkbox"
                                    name="descanso"
                                    checked={formData.descanso}
                                    onChange={handleInputChange}
                                    label="Descanso"
                                    className="mt-4"
                                />
                            </Col>
                        </Row>
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingTomo" label="Tomó">
                                    <Form.Control type="time" name="tomo" value={formData.tomo} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingDejo" label="Dejó">
                                    <Form.Control type="time" name="dejo" value={formData.dejo} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col sm="auto">
                                <FloatingLabel controlId="floatingHdisp" label="H. de Disp.">
                                    <Form.Control type="time" name="hdisp" value={formData.hdisp} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingLicencia" label="Licencia">
                                    <Form.Control as="select" name="licencia" value={formData.licencia} onChange={handleInputChange}>
                                        <option value="">Seleccione</option>
                                        <option value="por enfermedad">por enfermedad</option>
                                        <option value="por enfermedad familiar">por enfermedad familiar</option>
                                        <option value="por maternidad">por maternidad</option>
                                        <option value="por vacaciones">por vacaciones</option>
                                        <option value="deportiva">deportiva</option>
                                        <option value="por ART">por ART</option>
                                        <option value="por fallecimiento familiar cercano">por fallecimiento familiar cercano</option>
                                        <option value="por fallecimiento familiar">por fallecimiento familiar</option>
                                    </Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingObservaciones" label="Observaciones">
                                    <Form.Control as="textarea" name="observaciones" value={formData.observaciones} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                <Button type="submit" className="mt-3">Guardar</Button>
                            </Col>
                        </Row>
                    </Form>
                )}

                <Table responsive striped bordered hover variant="dark" className="mt-3">
                    <thead>
                        <tr>
                            
                            <th>Día</th>
                            <th>Servicio</th>
                            <th>Tomó</th>
                            <th>Dejó</th>
                            <th>H.de Disp.</th>
                            <th>Total Hs.Trab</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                
                                <td>{item.diaInicio}</td>
                                <td>{item.servicio}</td>
                                <td>{item.tomo}</td>
                                <td>{item.dejo}</td>
                                <td>{item.hdisp}</td>
                                <td>{item.totalHorasTrab}</td>
                                <td>{item.observaciones}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEdit(index)}><i className="fas fa-edit"></i></Button>
                                    <Button variant="danger" onClick={() => handleDelete(index)}><i className="fas fa-trash-alt"></i></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};
