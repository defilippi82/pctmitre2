import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const Tarjetas = () => {
  const { userData } = useContext(UserContext);
  
  const [registros, setRegistros] = useState([]);
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    fecha: '',
    tren: '',
    locomotora: '',
    toneladas: '',
    origen: '',
    destino: '',
    operador: userData?.nombre || ''
  });

  // Filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTren, setFiltroTren] = useState('');

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Tarjetas'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setRegistros(data);
      } catch (error) {
        console.error("Error al obtener tarjetas: ", error);
      }
    };
    fetchTarjetas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaTarjeta({ ...nuevaTarjeta, [name]: value });
  };

  const handleAddTarjeta = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'Tarjetas'), nuevaTarjeta);
      setRegistros([{ id: docRef.id, ...nuevaTarjeta }, ...registros]);
      
      MySwal.fire('Guardado', 'La tarjeta ha sido registrada', 'success');
      
      // Limpiamos campos específicos manteniendo los de referencia
      setNuevaTarjeta({
        ...nuevaTarjeta,
        tren: '',
        locomotora: '',
        toneladas: '',
        origen: '',
        destino: ''
      });
    } catch (error) {
      console.error("Error al guardar: ", error);
      MySwal.fire('Error', 'No se pudo guardar la tarjeta', 'error');
    }
  };

  const registrosFiltrados = registros.filter(reg => {
    const coincideFecha = filtroFecha === '' || reg.fecha === filtroFecha;
    const coincideTren = reg.tren.toLowerCase().includes(filtroTren.toLowerCase());
    return coincideFecha && coincideTren;
  });

  const exportarCSV = () => {
    const encabezados = ["Fecha", "Tren", "Locomotora", "Toneladas", "Origen", "Destino", "Operador"];
    const filas = registrosFiltrados.map(r => 
      [r.fecha, r.tren, r.locomotora, r.toneladas, r.origen, r.destino, r.operador].join(",")
    );

    const contenido = [encabezados.join(","), ...filas].join("\n");
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tarjetas_${new Date().toISOString().slice(0,10)}.csv`);
    link.click();
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Registro de Tarjetas</h2>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleAddTarjeta}>
            <Row className="g-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control type="date" name="fecha" value={nuevaTarjeta.fecha} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Tren</Form.Label>
                  <Form.Control type="text" name="tren" placeholder="N°" value={nuevaTarjeta.tren} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Locomotora</Form.Label>
                  <Form.Control type="text" name="locomotora" placeholder="ID Loco" value={nuevaTarjeta.locomotora} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Toneladas</Form.Label>
                  <Form.Control type="number" name="toneladas" placeholder="Tn" value={nuevaTarjeta.toneladas} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Origen</Form.Label>
                  <Form.Control type="text" name="origen" placeholder="Estación" value={nuevaTarjeta.origen} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Destino</Form.Label>
                  <Form.Control type="text" name="destino" placeholder="Estación" value={nuevaTarjeta.destino} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="mt-3 w-100">Registrar Tarjeta</Button>
          </Form>
        </Card.Body>
      </Card>

      <Row className="mb-3 align-items-end">
        <Col md={3}>
          <Form.Label>Filtrar por Fecha</Form.Label>
          <Form.Control type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Label>Filtrar por Tren</Form.Label>
          <Form.Control type="text" placeholder="Buscar N° Tren..." value={filtroTren} onChange={(e) => setFiltroTren(e.target.value)} />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="success" onClick={exportarCSV} disabled={registrosFiltrados.length === 0}>
            Exportar CSV
          </Button>
        </Col>
      </Row>

      <Table responsive striped bordered hover variant="secondary">
        <thead className="table-dark">
          <tr>
            <th>Fecha</th>
            <th>Tren</th>
            <th>Loco</th>
            <th>Tn</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Operador</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id}>
              <td>{reg.fecha}</td>
              <td>{reg.tren}</td>
              <td>{reg.locomotora}</td>
              <td>{reg.toneladas}</td>
              <td>{reg.origen}</td>
              <td>{reg.destino}</td>
              <td>{reg.operador}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Tarjetas;