import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { UserContext } from '../../Services/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Table, Button, FloatingLabel, Row, Col, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';

const MySwal = withReactContent(Swal);

export const Pendientes = () => {
    const { userData } = useContext(UserContext);
    const [pendientes, setPendientes] = useState([]);
    const [newPendiente, setNewPendiente] = useState('');
    const [formData, setFormData] = useState({
        ramal: '',
        causa: '',
        sector: '',
        observaciones: '',
    });

    const { ramal, causa, sector, observaciones } = formData;

    useEffect(() => {
        const fetchPendientes = async () => {
            const querySnapshot = await getDocs(collection(db, 'Pendientes'));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a, b) => new Date(a.fecha.split('/').reverse().join('-')) - new Date(b.fecha.split('/').reverse().join('-')));
            setPendientes(data);
        };

        fetchPendientes();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddPendiente = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

        if (newPendiente.trim() === '') return;
        const newEntry = {
            operador: userData.nombre,
            fecha: formattedDate,
            novedad: newPendiente,
            ramal,
            causa,
            sector,
            observaciones,
        };

        try {
            await addDoc(collection(db, 'Pendientes'), newEntry);
            setPendientes([...pendientes, newEntry]);
            MySwal.fire('Agregado', 'La novedad ha sido agregada', 'success');
            setNewPendiente('');
            setFormData({
                ramal: '',
                causa: '',
                sector: '',
                observaciones: '',
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            MySwal.fire('Error', 'Hubo un problema al agregar la novedad', 'error');
        }
    };

    const handleDeletePendiente = async (id) => {
        try {
            await deleteDoc(doc(db, 'Pendientes', id));
            setPendientes(pendientes.filter(pendiente => pendiente.id !== id));
            MySwal.fire('Eliminado', 'La novedad ha sido eliminada', 'success');
        } catch (error) {
            console.error("Error deleting document: ", error);
            MySwal.fire('Error', 'Hubo un problema al eliminar la novedad', 'error');
        }
    };

    const handleEditPendiente = (id, novedad) => {
        MySwal.fire({
            title: 'Editar Novedad',
            input: 'text',
            inputValue: novedad,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateDoc(doc(db, 'Pendientes', id), { novedad: result.value });
                    setPendientes(pendientes.map(pendiente => pendiente.id === id ? { ...pendiente, novedad: result.value } : pendiente));
                    MySwal.fire('Actualizado', 'La novedad ha sido actualizada', 'success');
                } catch (error) {
                    console.error("Error updating document: ", error);
                    MySwal.fire('Error', 'Hubo un problema al actualizar la novedad', 'error');
                }
            }
        });
    };

    return (
        <div className="container align-items-center mt-4">
            <h2>Pendientes</h2>
            <Table responsive striped bordered hover variant='secondary'>
                <thead>
                    <tr>
                        <th>Operador</th>
                        <th>Fecha</th>
                        <th>Novedad</th>
                        <th>Ramal</th>
                        <th>Causa</th>
                        <th>Sector</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pendientes.map(({ id, operador, fecha, novedad, ramal, causa, sector, observaciones }) => (
                        <tr key={id}>
                            <td>{operador}</td>
                            <td>{fecha}</td>
                            <td>{novedad}</td>
                            <td>{ramal}</td>
                            <td>{causa}</td>
                            <td>{sector}</td>
                            <td>{observaciones}</td>
                            <td>
                                {userData.nombre === operador && <Button variant="warning" onClick={() => handleEditPendiente(id, novedad)}><FontAwesomeIcon icon={faEdit} /></Button>}
                                {' '}
                                <Button variant="success" onClick={() => handleDeletePendiente(id)}><FontAwesomeIcon icon={faCheck} /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Form onSubmit={handleAddPendiente}>
            <Row className="align-items-center">
            <Col xs="auto">
                <Form.Group controlId="novedadInput">
                    <Form.Label>Agregar Novedad</Form.Label>
                </Form.Group>
                <Row className="align-items-center">
                <Form.Group controlId="formBasicRamal">
                <Form.Label>Ramal</Form.Label>
                            <Col xs="auto">
                    <Form.Check
                        type="checkbox"
                        name="ap"
                        checked={ramal}
                        onChange={handleInputChange}
                        label="AP"
                    />
                    </Col>
                    <Col xs="auto">
                    <Form.Check
                        type="checkbox"
                        name="bp"
                        checked={ramal}
                        onChange={handleInputChange}
                        label="BP"
                        />
                        </Col>
                        <Col xs="auto">
                    <Form.Check
                        type="checkbox"
                        name="cp"
                        checked={ramal}
                        onChange={handleInputChange}
                        label="CP"
                        />
                        </Col>
                </Form.Group>
                </Row>
                <Row className="align-items-center">
                <Col xs="auto">
                <Form.Group controlId="formBasicSector">
                    <Form.Label>Sector</Form.Label>
                    
                    <Form.Control
                        as="select"
                        name="sector"
                        value={sector}
                        onChange={handleInputChange}
                        >
                        <option value="">Seleccione</option>
                        <option value="adv">ADV</option>
                        <option value="barrera">Barrera</option>
                        <option value="senales">Señal</option>
                        <option value="vias">Vía</option>
                        <option value="telecomunicaciones">Telecomunicaciones</option>
                    </Form.Control>
                </Form.Group>
                        </Col>
                        </Row>
                <Row className="align-items-center">
                <Col xs="auto">
                <Form.Group controlId="formBasicCausa">
                    <Form.Label>Causa</Form.Label>
                    <Col xs="auto">
                    <Form.Control
                        as="select"
                        name="causa"
                        value={causa}
                        onChange={handleInputChange}
                        >
                        <option value="">Seleccione</option>
                        <option value="adv">ADV en averia</option>
                        <option value="brazoRoto">Brazo Roto</option>
                        <option value="senales">Señal a Peligro</option>
                        <option value="rielRoto">Riel Roto</option>
                        <option value="blockStaff">Aparato Block</option>
                    </Form.Control>
                        </Col>
                        <Col xs="auto">
                        <Form.Control
                            as="textarea"
                            rows={1}
                            value={newPendiente}
                            onChange={(e) => setNewPendiente(e.target.value)}
                            />
                            </Col>
                    <Col xs="auto">
                    <Form.Label>Observaciones</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="observaciones"
                        rows={3}
                        value={observaciones}
                        onChange={handleInputChange}
                        placeholder="Ingrese las observaciones"
                        />
                        </Col>
                </Form.Group>
                </Col>
                </Row>
                                        
                <Button variant="primary" type="submit" className="mt-3">
                    Agregar Novedad
                </Button>
                </Col>
                </Row>
            </Form>
        </div>
    );
};
