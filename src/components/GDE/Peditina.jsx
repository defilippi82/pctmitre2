import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'; // Importamos deleteDoc y doc
import { db } from '../../firebaseConfig/firebase'; 
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Para la navegación
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
    fecha: '',
    tren: '',
    equipo: '',
    ubicacion: '',
    hora: '',
    operador: userData?.nombre || ''
  });

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroOperador, setFiltroOperador] = useState('');

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
    try {
      await addDoc(collection(db, 'Peditinas'), nuevoRegistro);
      MySwal.fire({
        title: '¡Guardado!',
        text: 'El registro de Peditina se cargó con éxito.',
        icon: 'success'
      });
      setNuevoRegistro({
        fecha: '', tren: '', equipo: '', ubicacion: '', hora: '',
        operador: userData?.nombre || ''
      });
      fetchPeditinas();
    } catch (error) {
      MySwal.fire('Error', 'No se pudo guardar el registro', 'error');
    }
  };

  // FUNCIÓN PARA ELIMINAR
  const eliminarRegistro = async (id) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará el registro de Peditina permanentemente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "Peditinas", id));
        setRegistros(registros.filter(reg => reg.id !== id));
        MySwal.fire('Eliminado', 'El registro ha sido borrado.', 'success');
      } catch (error) {
        MySwal.fire('Error', 'No se pudo eliminar el registro', 'error');
      }
    }
  };

  const registrosFiltrados = registros.filter(reg => {
    const coincideFecha = filtroFecha ? reg.fecha === filtroFecha : true;
    const coincideOperador = filtroOperador ? reg.operador.toLowerCase().includes(filtroOperador.toLowerCase()) : true;
    return coincideFecha && coincideOperador;
  });

  const exportarCSV = () => {
    const encabezados = "Fecha,Tren,Equipo,Ubicacion,Hora,Operador\n";
    const filas = registrosFiltrados.map(r => 
      `${r.fecha},${r.tren},${r.equipo},${r.ubicacion},${r.hora},${r.operador}`
    ).join("\n");
    
    const blob = new Blob([encabezados + filas], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peditina_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <Container className="mt-5" style={{paddingTop: '30px'}}>
      <Card className="p-4 shadow-sm mb-4">
        <h4 className="text-danger mb-4">Carga de Peditina</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>Fecha</Form.Label><Form.Control type="date" name="fecha" value={nuevoRegistro.fecha} onChange={handleChange} required /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>Tren</Form.Label><Form.Control type="text" name="tren" value={nuevoRegistro.tren} onChange={handleChange} required /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>Equipo</Form.Label><Form.Control type="text" name="equipo" value={nuevoRegistro.equipo} onChange={handleChange} /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3"><Form.Label>Ubicación</Form.Label><Form.Control type="text" name="ubicacion" value={nuevoRegistro.ubicacion} onChange={handleChange} /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3"><Form.Label>Hora</Form.Label><Form.Control type="time" name="hora" value={nuevoRegistro.hora} onChange={handleChange} /></Form.Group></Col>
          </Row>
          <Button variant="danger" type="submit" className="w-100 fw-bold">CARGAR PEDITINA</Button>
        </Form>
      </Card>

      <Row className="mb-3 align-items-end">
        <Col md={3}><Form.Label>Filtrar Fecha</Form.Label><Form.Control type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} /></Col>
        <Col md={3}><Form.Label>Operador</Form.Label><Form.Control type="text" placeholder="Buscar..." value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)} /></Col>
        <Col md={6} className="text-end"><Button variant="success" onClick={exportarCSV}>Exportar CSV</Button></Col>
      </Row>

      <Table responsive striped bordered hover variant="secondary">
        <thead className="table-dark text-center">
          <tr>
            <th>Fecha</th><th>Tren</th><th>Equipo</th><th>Ubicación</th><th>Hora</th><th>Operador</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id} className="align-middle text-center">
              <td>{reg.fecha}</td>
              <td><strong>{reg.tren}</strong></td>
              <td>{reg.equipo}</td>
              <td>{reg.ubicacion}</td>
              <td>{reg.hora}</td>
              <td><small>{reg.operador}</small></td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => navigate(`/peditina/edit/${reg.id}`)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => eliminarRegistro(reg.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};