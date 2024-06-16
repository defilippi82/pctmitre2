import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { UserContext } from './UserContext';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Novedades = () => {
    const { userData } = useContext(UserContext);
    const [novedades, setNovedades] = useState([]);
    const [newNovedad, setNewNovedad] = useState('');
    const [editId, setEditId] = useState(null);
    const [editNovedad, setEditNovedad] = useState('');

    useEffect(() => {
        const fetchNovedades = async () => {
            const querySnapshot = await getDocs(collection(db, 'novedades'));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Ordenar las novedades por fecha de la más antigua a la más reciente
            data.sort((a, b) => new Date(a.fecha.split('/').reverse().join('-')) - new Date(b.fecha.split('/').reverse().join('-')));
            setNovedades(data);
        };

        fetchNovedades();
    }, []);

    const handleAddNovedad = async (e) => {
        e.preventDefault();
        const currentDate = new Date();
        const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
        
        if (newNovedad.trim() === '') return;
        const newEntry = {
            operador: userData.nombre,
            fecha: formattedDate,
            novedad: newNovedad,
        };
        try {
            const docRef = await addDoc(collection(db, 'novedades'), newEntry);
            setNovedades([...novedades, { id: docRef.id, ...newEntry }]);
            setNewNovedad('');
            MySwal.fire('Éxito', 'Novedad agregada correctamente', 'success');
        } catch (error) {
            console.error('Error adding document: ', error);
            MySwal.fire('Error', 'Hubo un problema al agregar la novedad', 'error');
        }
    };

    const handleDeleteNovedad = async (id) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, bórralo',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDoc(doc(db, 'novedades', id));
                    setNovedades(novedades.filter(novedad => novedad.id !== id));
                    MySwal.fire('Borrado', 'La novedad ha sido borrada', 'success');
                } catch (error) {
                    console.error('Error deleting document: ', error);
                    MySwal.fire('Error', 'Hubo un problema al borrar la novedad', 'error');
                }
            }
        });
    };

    const handleEditNovedad = (id, novedad) => {
        setEditId(id);
        setEditNovedad(novedad);
    };

    const handleUpdateNovedad = async (e) => {
        e.preventDefault();
        if (editNovedad.trim() === '') return;
        try {
            const novedadDoc = doc(db, 'novedades', editId);
            await updateDoc(novedadDoc, { novedad: editNovedad });
            setNovedades(novedades.map(n => n.id === editId ? { ...n, novedad: editNovedad } : n));
            setEditId(null);
            setEditNovedad('');
            MySwal.fire('Éxito', 'Novedad actualizada correctamente', 'success');
        } catch (error) {
            console.error('Error updating document: ', error);
            MySwal.fire('Error', 'Hubo un problema al actualizar la novedad', 'error');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Novedades</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Operador</th>
                        <th>Fecha</th>
                        <th>Novedad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {novedades.map(({ id, operador, fecha, novedad }) => (
                        <tr key={id}>
                            <td>{operador}</td>
                            <td>{fecha}</td>
                            <td>
                                {editId === id ? (
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={editNovedad}
                                        onChange={(e) => setEditNovedad(e.target.value)}
                                    />
                                ) : (
                                    novedad
                                )}
                            </td>
                            <td>
                                {editId === id ? (
                                    <Button variant="success" onClick={handleUpdateNovedad}>Guardar</Button>
                                ) : (
                                    userData.nombre === operador && <Button variant="warning" onClick={() => handleEditNovedad(id, novedad)}>Editar</Button>
                                )}
                                {' '}
                                <Button variant="danger" onClick={() => handleDeleteNovedad(id)}>Borrar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Form onSubmit={handleAddNovedad}>
                <Form.Group controlId="novedadInput">
                    <Form.Label>Agregar Novedad</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newNovedad}
                        onChange={(e) => setNewNovedad(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Agregar Novedad
                </Button>
            </Form>
        </div>
    );
};

