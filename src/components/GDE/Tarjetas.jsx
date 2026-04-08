import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase'; // Ajusta la ruta si es diferente
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Tarjetas = () => {
  const { userData } = useContext(UserContext);
  
  // Estado para la lista de registros traídos de Firebase
  const [registros, setRegistros] = useState([]);
  
  // Estado para el formulario (Pre-cargamos el operador si existe en el context)
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: '',
    tren: '',
    equipo: '',
    ubicacion: '',
    hora: '',
    operador: userData?.nombre || ''
  });

  // Estados para filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroOperador, setFiltroOperador] = useState('');

  // Cargar datos de Firebase al montar el componente
  useEffect(() => {
    const fetchPeditinas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Peditinas'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Opcional: ordenar por fecha (asumiendo formato YYYY-MM-DD del input type="date")
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        setRegistros(data);
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    fetchPeditinas();
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro({ ...nuevoRegistro, [name]: value });
  };

  // Guardar nuevo registro en Firebase
  const handleAddRegistro = async (e) => {
    e.preventDefault();
    
    try {
      // Agregamos a la colección 'Peditinas' en Firestore
      const docRef = await addDoc(collection(db, 'Peditinas'), nuevoRegistro);
      
      // Actualizamos la tabla localmente sin tener que recargar la página
      setRegistros([{ id: docRef.id, ...nuevoRegistro }, ...registros]);
      
      MySwal.fire('Guardado', 'El registro ha sido agregado correctamente', 'success');
      
      // Limpiamos los campos (dejamos fecha y operador por si hay cargas consecutivas)
      setNuevoRegistro({
        ...nuevoRegistro,
        tren: '',
        equipo: '',
        ubicacion: '',
        hora: ''
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      MySwal.fire('Error', 'Hubo un problema al guardar el registro', 'error');
    }
  };

  // Lógica de filtrado para la tabla y el CSV
  const registrosFiltrados = registros.filter(reg => {
    const coincideFecha = filtroFecha === '' || reg.fecha === filtroFecha;
    const coincideOperador = reg.operador.toLowerCase().includes(filtroOperador.toLowerCase());
    return coincideFecha && coincideOperador;
  });

  // Función para exportar a CSV
  const exportarCSV = () => {
    const encabezados = ["Fecha", "Tren", "Equipo", "Ubicación", "Hora", "Operador"];
    const filas = registrosFiltrados.map(r => 
      [r.fecha, r.tren, r.equipo, r.ubicacion, r.hora, r.operador].join(",")
    );

    const contenido = [encabezados.join(","), ...filas].join("\n");
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `peditina_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Registro de Peditina</h2>

      {/* Formulario de Entrada */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleAddRegistro}>
            <Row className="g-3 align-items-end">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type="date" name="fecha" value={nuevoRegistro.fecha} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Tren</Form.Label>
                  <Form.Control type="text" name="tren" placeholder="N° Tren" value={nuevoRegistro.tren} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Equipo</Form.Label>
                  <Form.Control type="text" name="equipo" placeholder="Material" value={nuevoRegistro.equipo} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control type="text" name="ubicacion" placeholder="KM / Estación" value={nuevoRegistro.ubicacion} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Hora</Form.Label>
                  <Form.Control type="time" name="hora" value={nuevoRegistro.hora} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Operador</Form.Label>
                  <Form.Control type="text" name="operador" placeholder="Nombre" value={nuevoRegistro.operador} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="text-end">
                <Button variant="primary" type="submit">Cargar Registro</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Filtros y Exportación */}
      <Row className="mb-3 align-items-end">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Filtrar por Fecha</Form.Label>
            <Form.Control type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Filtrar por Operador</Form.Label>
            <Form.Control type="text" placeholder="Buscar operador..." value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" onClick={exportarCSV} disabled={registrosFiltrados.length === 0}>
            Exportar a Excel (CSV)
          </Button>
        </Col>
      </Row>

      {/* Tabla de Visualización */}
      <Table responsive striped bordered hover variant="secondary">
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>Tren</th>
            <th>Equipo</th>
            <th>Ubicación</th>
            <th>Hora</th>
            <th>Operador</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.length > 0 ? (
            registrosFiltrados.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.fecha}</td>
                <td>{reg.tren}</td>
                <td>{reg.equipo}</td>
                <td>{reg.ubicacion}</td>
                <td>{reg.hora}</td>
                <td>{reg.operador}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No hay registros cargados o no coinciden con la búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Tarjetas;