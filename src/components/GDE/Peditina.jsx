import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'; 
import { db } from '../../firebaseConfig/firebase'; 
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySwal = withReactContent(Swal);

export const Peditina = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState([]);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: new Date().toISOString().split('T')[0], // Sugiere fecha de hoy por defecto
    tren: '',
    equipo: '',
    ubicacion: '',
    hora: '',
    linea: '', 
    operador: userData?.nombre || ''
  });

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroOperador, setFiltroOperador] = useState('');
  const [filtroLinea, setFiltroLinea] = useState('');

  const fetchPeditinas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Peditinas'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistros(data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchPeditinas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoRegistro.linea) {
        return MySwal.fire('Atención', 'Seleccioná Suárez o Tigre antes de guardar', 'warning');
    }
    try {
      await addDoc(collection(db, 'Peditinas'), nuevoRegistro);
      MySwal.fire({
        title: '¡Guardado!',
        text: `Registro de Línea ${nuevoRegistro.linea} cargado.`,
        icon: 'success',
        timer: 1500, // Se cierra solo para no interrumpir el flujo
        showConfirmButton: false
      });

      // MANTENEMOS LA LÍNEA Y LA FECHA, limpiamos el resto
      setNuevoRegistro(prev => ({
        ...prev,
        tren: '',
        equipo: '',
        ubicacion: '',
        hora: '',
        // linea: prev.linea, <-- NO SE TOCA, queda seleccionada
      }));
      
      fetchPeditinas();
    } catch (error) {
      MySwal.fire('Error', 'No se pudo guardar', 'error');
    }
  };

  const eliminarRegistro = async (id) => {
    const result = await MySwal.fire({
      title: '¿Eliminar?',
      text: "Se borrará permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Borrar'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "Peditinas", id));
      setRegistros(registros.filter(reg => reg.id !== id));
    }
  };

  const registrosFiltrados = registros.filter(reg => {
    const coincideFecha = filtroFecha ? reg.fecha === filtroFecha : true;
    const coincideOperador = filtroOperador ? reg.operador.toLowerCase().includes(filtroOperador.toLowerCase()) : true;
    const coincideLinea = filtroLinea ? reg.linea === filtroLinea : true;
    return coincideFecha && coincideOperador && coincideLinea;
  });

  return (
    <Container className="mt-5" style={{paddingTop: '30px'}}>
      <Card className="p-4 shadow-sm mb-4 border-left-danger">
        <h4 className="text-danger mb-4 border-bottom pb-2">Carga Rápida de Peditina</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">1. Seleccionar Línea</Form.Label>
                <Form.Select 
                    name="linea" 
                    value={nuevoRegistro.linea} 
                    onChange={handleChange} 
                    required 
                    className={nuevoRegistro.linea ? "bg-light border-primary fw-bold" : "border-danger"}
                >
                    <option value="">-- ELIGE LÍNEA --</option>
                    <option value="Suárez">LINEA SUÁREZ</option>
                    <option value="Tigre">LINEA TIGRE</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>Fecha</Form.Label><Form.Control type="date" name="fecha" value={nuevoRegistro.fecha} onChange={handleChange} required /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>N° Tren</Form.Label><Form.Control type="text" name="tren" value={nuevoRegistro.tren} onChange={handleChange} required placeholder="Ej: 3021" /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>Equipo</Form.Label><Form.Control type="text" name="equipo" value={nuevoRegistro.equipo} onChange={handleChange} placeholder="Loc/Chapa" /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3"><Form.Label>Hora</Form.Label><Form.Control type="time" name="hora" value={nuevoRegistro.hora} onChange={handleChange} required /></Form.Group></Col>
          </Row>
          <Row>
            <Col md={12}><Form.Group className="mb-3"><Form.Label>Ubicación / Kilómetro</Form.Label><Form.Control type="text" name="ubicacion" value={nuevoRegistro.ubicacion} onChange={handleChange} placeholder="Ej: Km 24.3 / Empalme..." /></Form.Group></Col>
          </Row>
          <Button variant="danger" type="submit" className="w-100 fw-bold py-2 shadow-sm">
            + CARGAR SIGUIENTE TREN
          </Button>
        </Form>
      </Card>

      {/* SECCIÓN DE FILTROS */}
      <Card className="p-3 mb-4 bg-light shadow-sm">
          <Row className="align-items-end">
            <Col md={3}><Form.Label className="small fw-bold">Ver Línea:</Form.Label>
                <Form.Select size="sm" value={filtroLinea} onChange={(e) => setFiltroLinea(e.target.value)}>
                    <option value="">TODAS LAS LÍNEAS</option>
                    <option value="Suárez">Suárez</option>
                    <option value="Tigre">Tigre</option>
                </Form.Select>
            </Col>
            <Col md={3}><Form.Label className="small fw-bold">Fecha:</Form.Label><Form.Control size="sm" type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} /></Col>
            <Col md={6} className="text-end">
                <Button variant="outline-success" size="sm" onClick={() => { /* Tu lógica de CSV */ }}>Exportar Listado</Button>
            </Col>
          </Row>
      </Card>

      <Table responsive striped bordered hover className="shadow-sm">
        <thead className="table-dark text-center">
          <tr>
            <th>Línea</th><th>Fecha</th><th>Tren</th><th>Ubicación</th><th>Hora</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id}>
              <td><span className={`badge ${reg.linea === 'Suárez' ? 'bg-primary' : 'bg-success'}`}>{reg.linea}</span></td>
              <td>{reg.fecha}</td>
              <td className="fw-bold">{reg.tren}</td>
              <td>{reg.ubicacion}</td>
              <td>{reg.hora}</td>
              <td>
                <Button variant="link" className="text-primary p-0 me-2" onClick={() => navigate(`/peditina/edit/${reg.id}`)}><FontAwesomeIcon icon={faEdit} /></Button>
                <Button variant="link" className="text-danger p-0" onClick={() => eliminarRegistro(reg.id)}><FontAwesomeIcon icon={faTrash} /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};