import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { Form, Table, Button, FloatingLabel, Row, Col, Pagination } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Sabana = () => {
    const [apellido, setApellido] = useState('');
    const [base, setBase] = useState('');
    const [legajo, setLegajo] = useState('');
    const [rol, setRol] = useState('');
    const [conductores, setConductores] = useState([]);
    const [guardatrenes, setGuardatrenes] = useState([]);
    const [currentView, setCurrentView] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [novedades, setNovedades] = useState([]);
    const [formData, setFormData] = useState({
        diaNovedadInicio: '',
        diaNovedadFinal: '',
        diaDisponible: '',
        hdisp: '',
        codigo: '',
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
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };
    

    const fetchConductores = async () => {
        const q = query(collection(db, 'conductores'));
        const querySnapshot = await getDocs(q);
        const novedades = querySnapshot.docs.map(doc => ({ ...doc.novedades(), id: doc.id }));
        setConductores(novedades);
    };

    const fetchGuardatren = async () => {
        const q = query(collection(db, 'guardatrenes'));
        const querySnapshot = await getDocs(q);
        const novedades = querySnapshot.docs.map(doc => ({ ...doc.novedades(), id: doc.id }));
        setGuardatrenes(novedades);
    };

    useEffect(() => {
        if (currentView === 'conductores') {
            fetchConductores();
        } else if (currentView === 'guardatren') {
            fetchGuardatren();
        }
    }, [currentView]);

    useEffect(() => {
        const fetchNovedades = async () => {
            if (selectedUser) {
                const userDocRef = doc(db, currentView, selectedUser.id);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setNovedades(userDoc.data().novedades || []);
                } else {
                    setNovedades([]);
                }
            }
        };
        fetchNovedades();
    }, [selectedUser, currentView]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            Swal.fire('Error', 'Por favor, seleccione un usuario antes de agregar una novedad.', 'error');
            return;
        }
    
        try {
            const userDocRef = doc(db, currentView, selectedUser.id);
            await updateDoc(userDocRef, {
                novedades: arrayUnion({ ...formData })
            });
            Swal.fire('Éxito', 'Novedad agregada exitosamente.', 'success');
            // Aquí podrías agregar la nueva novedad directamente al estado `data`
            setNovedades(prevNovedades => [...prevNovedades, formData]);
            //setData(prevData => [...prevData, formData]);
            setFormData({
                diaNovedadInicio: '',
                diaNovedadFinal: '',
                diaDisponible: '',
                hdisp: '',
                codigo: '',
                totalHorasTrab: '',
                observaciones: ''
            });
        } catch (error) {
            console.error('Error al agregar la novedad: ', error);
            Swal.fire('Error', 'Hubo un problema al agregar la novedad.', 'error');
        }
    };
    
    const handleEdit = (index) => {
        Swal.fire({
            title: 'Editar Registro',
            html: `
                 <input type="date" id="diaNovedadInicio" class="swal2-input" value="${novedades[index].diaNovedadInicio}">
                <input type="date" id="diaNovedadFinal" class="swal2-input" value="${novedades[index].diaNovedadFinal}">
                <input type="date" id="diaDisponible" class="swal2-input" value="${novedades[index].diaDisponible}">
                <input type="time" id="hdisp" class="swal2-input" value="${novedades[index].hdisp}">
                <select id="codigo" class="swal2-input" value="${novedades[index].codigo}">
                    <option value="">Seleccione</option>
                    <option value="1">Franco</option>
                    <option value="2">Franco Adeudado</option>
                    <option value="3">Descanso por diagrama</option>
                    <option value="4">Descanso por cambio de rotación u horario</option>
                    <option value="144">Horas de inasistencia</option>
                    <option value="148">Horas de impuntualidad</option>
                    <option value="240">Días por fallecimiento</option>
                    <option value="246">Donación de sangre</option>
                    <option value="248">Licencia por examen</option>
                    <option value="250">Inasistencia justificada</option>
                    <option value="252">Inasistencia injustificada</option>
                    <option value="254">Días de suspensión</option>
                    <option value="256">Licencia sin goce de sueldo</option>
                    <option value="258">Días por nacimiento</option>
                    <option value="259">Días por enfermedad</option>
                    <option value="261">Enfermedad prolongada</option>
                    <option value="262">Días por accidente de trabajo</option>
                    <option value="263">Baja por arrollamiento</option>
                    <option value="264">Licencia gremial</option>
                    <option value="266">Licencia por mudanza</option>
                    <option value="268">Licencia por matrimonio</option>
                    <option value="276">Licencia especial paga</option>
                    <option value="277">Licencia deportiva</option>
                    <option value="278">Licencia por maternidad</option>
                    <option value="288">Declaración judicial</option>
                    <option value="291">Vacaciones adeudadas - completas</option>
                    <option value="292">Vacaciones según rotación - completas</option>
                    <option value="293">Vacaciones adelantadas - completas</option>
                    <option value="294">Vacaciones por cambio - completas</option>
                    <option value="295">Vacaciones adeudadas - fracción</option>
                    <option value="296">Vacaciones según rotación - fracción</option>
                    <option value="297">Vacaciones adelantadas - fracción</option>
                    <option value="298">Vacaciones por cambio - fracción</option>
                    <option value="300">Orden médica a domicilio</option>
                    <option value="301">Reiteración de O.M.D.</option>
                    <option value="302">P.A.M. (Permiso Atención Médica)</option>
                    <option value="303">O.M. y P.A.M. (Mismo día)</option>
                    <option value="304">P.A.M. en servicio</option>
                    <option value="305">Ausencia por causa médica - total</option>
                    <option value="306">Ausencia por causa médica - parcial</option>
                    <option value="307">Familiar enfermo</option>
                    <option value="308">Control - citado por servicio médico</option>
                    <option value="309">Alta médica - Reanuda tareas</option>
                    <option value="310">Baja C.R.P.C.</option>
                    <option value="311">P.A.M. por baja C.R.P.C.</option>
                    <option value="400">Revisión médica anual</option>
                    <option value="401">Descanso por revisión médica</option>
                    <option value="402">Consulta médica en retiro</option>
                    <option value="403">Consulta psicológica en retiro</option>
                    <option value="404">Consulta médica y psicológica en retiro</option>
                    <option value="405">Resolución N° 558 (Arrollamiento)</option>
                    <option value="406">Consulta con médico especialista</option>
                    <option value="407">Estudio médico complementario</option>
                    <option value="408">Polisonografía</option>
                    <option value="409">Revisión por cambio de categoría</option>
                    <option value="410">Tarea liviana</option>
                    <option value="411">Revisión por cambio de categoría</option>
                    <option value="412">Fuera de la operatoria ferroviaria</option>
                    <option value="413">Suspensión precaucional</option>
                    <option value="500">Suspensión precaucional</option>
                    <option value="501">Reserva de puesto</option>
                    <option value="502">Citado por RR.HH</option>
                    <option value="503">Pluriaccidentados</option>
                    <option value="504">Permiso gremial</option>
                    <option value="600">Certificado entrega 0 KM</option>
                    <option value="601">Reposo por entrega 0 KM</option>
                    <option value="602">P.A.M. por entrega 0 KM</option>
                    <option value="603">Incidente en pasos a nivel</option>
                    <option value="604">Participación en siniestros</option>
                    <option value="605">Licencia sin goce de sueldo</option>
                </select>
                <input type="number" id="totalHorasTrab" class="swal2-input" value="${novedades[index].totalHorasTrab}">
                <textarea id="observaciones" class="swal2-textarea">${novedades[index].observaciones}</textarea>`,
                focusConfirm: false,
                preConfirm: () => {
                    return {
                        diaNovedadInicio: document.getElementById('diaNovedadInicio').value,
                        diaNovedadFinal: document.getElementById('diaNovedadFinal').value,
                        diaDisponible: document.getElementById('diaDisponible').value,
                        hdisp: document.getElementById('hdisp').value,
                        codigo: document.getElementById('codigo').value,
                        totalHorasTrab: document.getElementById('totalHorasTrab').value,
                        observaciones: document.getElementById('observaciones').value,
                    };
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const updatedNovedades = [...novedades];
                    updatedNovedades[index] = { ...result.value };
                    setNovedades(updatedNovedades);
                    
                    // Actualizar en Firebase
                    try {
                        const userDocRef = doc(db, currentView, selectedUser.id);
                        await updateDoc(userDocRef, {
                            novedades: updatedNovedades
                        });
                        Swal.fire('Éxito', 'Novedad actualizada correctamente', 'success');
                    } catch (error) {
                        console.error('Error al actualizar la novedad: ', error);
                        Swal.fire('Error', 'Hubo un problema al actualizar la novedad', 'error');
                    }
                }
            });
        };
        
        const handleDelete = async (index) => {
            try {
                const updatedNovedades = novedades.filter((_, i) => i !== index);
                setNovedades(updatedNovedades);
        
                // Actualizar en Firebase
                const userDocRef = doc(db, currentView, selectedUser.id);
                await updateDoc(userDocRef, {
                    novedades: updatedNovedades
                });
                Swal.fire('Éxito', 'Novedad eliminada correctamente', 'success');
            } catch (error) {
                console.error('Error al eliminar la novedad: ', error);
                Swal.fire('Error', 'Hubo un problema al eliminar la novedad', 'error');
            }
        };

        useEffect(() => {
            console.log('Novedades:', novedades);
        }, [novedades]);

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
            <h2>Busqueda por filtro</h2>
            <Row>
                <Col>
                    <Row>
                    <Col>
                    <Form.Group controlId="formViewSelect">
                           <Col>
                        <Form.Label>Seleccione Vista</Form.Label>
                        <Form.Control as="select" value={currentView} onChange={handleViewChange}>
                            <option value="">Seleccione</option>
                            <option value="conductores">Conductores</option>
                            <option value="guardatren">Guardatrenes</option>
                        </Form.Control>
                           </Col>                     
                    </Form.Group>
                    </Col>
                     <Col>
                    <Form.Group controlId="baseSelect">
                    <Form.Label>Base Operativa</Form.Label>
                    <Form.Control as="select" value={base} onChange={handleBaseChange}>
                        <option value="">Seleccione una base</option>
                        <option value="victoria">Victoria</option>
                        <option value="suarez">Suarez</option>
                    </Form.Control>
                    </Form.Group>
                    </Col>
                    </Row>
                    <Row>
                    <Col>
                    <Form.Group controlId="formLegajo">
                        <Form.Label>Legajo</Form.Label>
                        <Form.Control type="number" value={legajo} onChange={handleLegajoChange} />
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group controlId="formApellido">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control type="text" value={apellido} onChange={handleApellidoChange} />
                    </Form.Group>
                    </Col>
                    </Row>
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
                                <FloatingLabel controlId="floatingdiaNovedadInicio" label="Día Inicio">
                                    <Form.Control type="date" name="diaNovedadInicio" value={formData.diaNovedadInicio} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingdiaNovedadFinal" label="Día Finaliza">
                                    <Form.Control type="date" name="diaNovedadFinal" value={formData.diaNovedadFinal} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                                <FloatingLabel controlId="floatingdiaDisponible" label="Día Disponible">
                                    <Form.Control type="date" name="diaDisponible" value={formData.diaDisponible} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>                 
                            <Col sm="auto">
                                <FloatingLabel controlId="floatingHdisp" label="H. de Disp.">
                                    <Form.Control type="time" name="hdisp" value={formData.hdisp} onChange={handleInputChange} />
                                </FloatingLabel>
                            </Col>
                            <Col xs="auto">
                            <FloatingLabel controlId="floatingCodigos" label="Códigos">
          <Form.Control as="select" name="codigo" value={formData.codigo} onChange={handleInputChange}>
        <option value="">Seleccione</option>
        <option value="1">Franco</option>
        <option value="2">Franco Adeudado</option>
        <option value="3">Descanso por diagrama</option>
        <option value="4">Descanso por cambio de rotación u horario</option>
        <option value="144">Horas de inasistencia</option>
        <option value="148">Horas de impuntualidad</option>
        <option value="240">Días por fallecimiento</option>
        <option value="246">Donación de sangre</option>
        <option value="248">Licencia por examen</option>
        <option value="250">Inasistencia justificada</option>
        <option value="252">Inasistencia injustificada</option>
        <option value="254">Días de suspensión</option>
        <option value="256">Licencia sin goce de sueldo</option>
        <option value="258">Días por nacimiento</option>
        <option value="259">Días por enfermedad</option>
        <option value="261">Enfermedad prolongada</option>
        <option value="262">Días por accidente de trabajo</option>
        <option value="263">Baja por arrollamiento</option>
        <option value="264">Licencia gremial</option>
        <option value="266">Licencia por mudanza</option>
        <option value="268">Licencia por matrimonio</option>
        <option value="276">Licencia especial paga</option>
        <option value="277">Licencia deportiva</option>
        <option value="278">Licencia por maternidad</option>
        <option value="288">Declaración judicial</option>
        <option value="291">Vacaciones adeudadas - completas</option>
        <option value="292">Vacaciones según rotación - completas</option>
        <option value="293">Vacaciones adelantadas - completas</option>
        <option value="294">Vacaciones por cambio - completas</option>
        <option value="295">Vacaciones adeudadas - fracción</option>
        <option value="296">Vacaciones según rotación - fracción</option>
        <option value="297">Vacaciones adelantadas - fracción</option>
        <option value="298">Vacaciones por cambio - fracción</option>
        <option value="300">Orden médica a domicilio</option>
        <option value="301">Reiteración de O.M.D.</option>
        <option value="302">P.A.M. (Permiso Atención Médica)</option>
        <option value="303">O.M. y P.A.M. (Mismo día)</option>
        <option value="304">P.A.M. en servicio</option>
        <option value="305">Ausencia por causa médica - total</option>
        <option value="306">Ausencia por causa médica - parcial</option>
        <option value="307">Familiar enfermo</option>
        <option value="308">Control - citado por servicio médico</option>
        <option value="309">Alta médica - Reanuda tareas</option>
        <option value="310">Baja C.R.P.C.</option>
        <option value="311">P.A.M. por baja C.R.P.C.</option>
        <option value="400">Revisión médica anual</option>
        <option value="401">Descanso por revisión médica</option>
        <option value="402">Consulta médica en retiro</option>
        <option value="403">Consulta psicológica en retiro</option>
        <option value="404">Consulta médica y psicológica en retiro</option>
        <option value="405">Resolución N° 558 (Arrollamiento)</option>
        <option value="406">Consulta con médico especialista</option>
        <option value="407">Estudio médico complementario</option>
        <option value="408">Polisonografía</option>
        <option value="409">Revisión por cambio de categoría</option>
        <option value="410">Tarea liviana</option>
        <option value="411">Revisión por cambio de categoría</option>
        <option value="412">Fuera de la operatoria ferroviaria</option>
        <option value="413">Suspensión precaucional</option>
        <option value="500">Suspensión precaucional</option>
        <option value="501">Reserva de puesto</option>
        <option value="502">Citado por RR.HH</option>
        <option value="503">Pluriaccidentados</option>
        <option value="504">Licencia por maternidad sin goce</option>
        <option value="505">Declaración policial (DIV MITRE)</option>
        <option value="519">Artículo 19 feriados acumulados (L.F)</option>
        <option value="530">Artículo 30 feriados acumulados (ASFA)</option>
        <option value="531">Feriados acumulados (U.F)</option>
        <option value="600">Curso escuela fraternidad</option>
        <option value="601">Cursos varios (solicitados por gremio o empresa)</option>
        <option value="700">Cambio de base</option>
        <option value="701">Baja por acuerdo voluntario</option>
        <option value="702">Baja por desvinculamiento</option>
        <option value="703">Suspensión de contrato temporal</option>
        <option value="800">Baja por fallecimiento</option>
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
                                <Button type="submit" className="mt-3">Agregar Novedad</Button>
                            </Col>
                        </Row>
                    </Form>
                )}
                {selectedUser && (
                <Table responsive striped bordered hover variant="dark" className="mt-3">
                    <thead>
                        <tr>
                            
                            <th>Desde</th>
                            <th>Hasta</th>
                            <th>Disponible</th>
                            <th>H.de Disp.</th>
                            <th>Novedad</th>
                            <th>Total Hs.Trab</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {novedades.map((novedad, index) => (
                            <tr key={index}>
                                
                                <td>{novedad.diaNovedadInicio}</td>
                                <td>{novedad.diaNovedadFinal}</td>
                                <td>{novedad.diaDisponible}</td>
                                <td>{novedad.hdisp}</td>
                                <td>{novedad.codigo}</td>
                                <td>{novedad.totalHorasTrab}</td>
                                <td>{novedad.observaciones}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEdit(index)}><i className="fas fa-edit"></i></Button>
                                    <Button variant="danger" onClick={() => handleDelete(index)}><i className="fas fa-trash-alt"></i></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                )}
            </div>
        </Container>
    );
};
