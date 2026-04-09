import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'; 
import { db } from '../../firebaseConfig/firebase'; 
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faTrash, faEdit, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySwal = withReactContent(Swal);

export const Peditina = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState([]);
  
  // Estado inicial: Fecha de hoy y Operador desde el contexto (si existe)
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tren: '',
    equipo: '',
    ubicacion: '',
    hora: '',
    linea: '', 
    operador: '' // Se precarga pero se puede editar
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
    
    if (!nuevoRegistro.linea || !nuevoRegistro.operador) {
        return MySwal.fire('Campos incompletos', 'Por favor seleccioná la Línea y verificá el Operador', 'warning');
    }

    try {
      await addDoc(collection(db, 'Peditinas'), nuevoRegistro);
      
      MySwal.fire({
        title: '¡Guardado!',
        text: `Tren ${nuevoRegistro.tren} registrado con éxito`,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      });

      // MANTENEMOS: Fecha, Línea y Operador. 
      // LIMPIAMOS: Tren, Equipo, Ubicación y Hora.
      setNuevoRegistro(prev => ({
        ...prev,
        tren: '',
        equipo: '',
        ubicacion: '',
        hora: ''
      }));
      
      fetchPeditinas();
    } catch (error) {
      MySwal.fire('Error', 'No se pudo guardar el registro', 'error');
    }
  };

  const eliminarRegistro = async (id) => {
    const result = await MySwal.fire({
      title: '¿Eliminar registro?',
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
        <h2 className="text-danger mb-4 border-bottom pb-2">Carga de Modulaciones</h2>
        <h4 className="text-danger mb-4 border-bottom pb-2">Tiempo y Espacio</h4>
        <Form onSubmit={handleSubmit}>
          {/* Fila 1: Datos que Persisten (Configuración del Turno) */}
          <Row className="bg-light p-3 rounded mb-3 border">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Línea</Form.Label>
                <Form.Select 
                    name="linea" 
                    value={nuevoRegistro.linea} 
                    onChange={handleChange} 
                    required 
                    className="border-primary fw-bold"
                >
                    <option value="">-- SELECCIONAR --</option>
                    <option value="Suárez">SUÁREZ</option>
                    <option value="Tigre">TIGRE</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold"><FontAwesomeIcon icon={faUser} /> Operador de Control</Form.Label>
                <Form.Control 
                    type="text" 
                    name="operador" 
                    value={nuevoRegistro.operador} 
                    onChange={handleChange} 
                    required 
                    placeholder="Nombre del operador..."
                    className="border-primary fw-bold"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Fecha de Carga</Form.Label>
                <Form.Control type="date" name="fecha" value={nuevoRegistro.fecha} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          {/* Fila 2: Datos del Tren (Se limpian en cada carga) */}
          <Row>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>N° Tren</Form.Label><Form.Control type="text" name="tren" value={nuevoRegistro.tren} onChange={handleChange} required placeholder="3021" /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3"><Form.Label>Equipo (Loc/Chapa)</Form.Label><Form.Control type="text" name="equipo" value={nuevoRegistro.equipo} onChange={handleChange} placeholder="Ej: A601" /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label>Ubicación / Km</Form.Label><Form.Control type="text" name="ubicacion" value={nuevoRegistro.ubicacion} onChange={handleChange} placeholder="Km 15.5" /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3"><Form.Label>Hora</Form.Label><Form.Control type="time" name="hora" value={nuevoRegistro.hora} onChange={handleChange} required /></Form.Group></Col>
          </Row>

          <Button variant="danger" type="submit" className="w-100 fw-bold py-2 shadow-sm">
            REGISTRAR Y CARGAR OTRO TREN
          </Button>
        </Form>
      </Card>

      {/* SECCIÓN DE FILTROS */}
      <Card className="p-3 mb-4 bg-light shadow-sm">
          <Row className="align-items-end">
            <Col md={3}><Form.Label className="small fw-bold">Filtrar Línea:</Form.Label>
                <Form.Select size="sm" value={filtroLinea} onChange={(e) => setFiltroLinea(e.target.value)}>
                    <option value="">TODAS</option>
                    <option value="Suárez">Suárez</option>
                    <option value="Tigre">Tigre</option>
                </Form.Select>
            </Col>
            <Col md={3}><Form.Label className="small fw-bold">Operador:</Form.Label><Form.Control size="sm" type="text" value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)} placeholder="Nombre..." /></Col>
            <Col md={3}><Form.Label className="small fw-bold">Fecha:</Form.Label><Form.Control size="sm" type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} /></Col>
            <Col md={3} className="text-end">
                <Button variant="outline-success" size="sm" className="w-100">Exportar Excel</Button>
            </Col>
          </Row>
      </Card>

      {/* Tabla de Resultados */}
      <Table responsive striped bordered hover className="shadow-sm border-danger">
        <thead className="table-dark text-center">
          <tr>
            <th>Línea</th><th>Fecha</th><th>Tren</th><th>Ubicación</th><th>Hora</th><th>Operador</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id}>
              <td><span className={`badge ${reg.linea === 'Suárez' ? 'bg-primary' : 'bg-success'}`}>{reg.linea}</span></td>
              <td>{reg.fecha}</td>
              <td className="fw-bold text-danger">{reg.tren}</td>
              <td>{reg.ubicacion}</td>
              <td>{reg.hora} hs</td>
              <td><small className="text-muted">{reg.operador}</small></td>
              <td>
                <Button variant="link" className="text-primary p-0 me-2" onClick={() => navigate(`/peditina/edit/${reg.id}`)} title="Editar"><FontAwesomeIcon icon={faEdit} /></Button>
                <Button variant="link" className="text-danger p-0" onClick={() => eliminarRegistro(reg.id)} title="Borrar"><FontAwesomeIcon icon={faTrash} /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};