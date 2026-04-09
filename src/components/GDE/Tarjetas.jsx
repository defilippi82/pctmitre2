import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// LISTAS PREDEFINIDAS
const ESTACIONES = ["Retiro", "Zárate", "Rosario", "San Lorenzo", "Córdoba", "Tucumán"];
const EMPRESAS = ["NCA", "Ferrosur Roca", "Belgrano Cargas", "Ferroexpreso Pampeano", "Fepasa"];

export const Tarjetas = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTren, setFiltroTren] = useState('');
  
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    fecha: '',
    tren: '',
    locomotora: '',
    empresa: '',
    origen: '',
    destino: '',
    horaInicio: '',    // Nuevo campo
    horaLlegada: '',   // Nuevo campo
    toneladasNetas: '',
    tara: '',
    toneladasBrutas: 0,
    operador: userData?.nombre || ''
  });

  const fetchRegistros = async () => {
    const querySnapshot = await getDocs(collection(db, "Tarjetas"));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setRegistros(data);
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaTarjeta(prev => {
      const updated = { ...prev, [name]: value };
      // Mantenemos el cálculo automático de Brutas
      if (name === 'toneladasNetas' || name === 'tara') {
        updated.toneladasBrutas = Number(updated.toneladasNetas || 0) + Number(updated.tara || 0);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Tarjetas"), nuevaTarjeta);
      Swal.fire('Éxito', 'Tarjeta guardada correctamente', 'success');
      setNuevaTarjeta({
        fecha: '', tren: '', locomotora: '', empresa: '', origen: '', destino: '',
        horaInicio: '', horaLlegada: '', toneladasNetas: '', tara: '', toneladasBrutas: 0,
        operador: userData?.nombre || ''
      });
      fetchRegistros();
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la tarjeta', 'error');
    }
  };

  const eliminarRegistro = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "Tarjetas", id));
      setRegistros(registros.filter(r => r.id !== id));
      Swal.fire('Borrado', 'Registro eliminado', 'success');
    }
  };

  // Lógica de filtrado (Mantenida)
  const registrosFiltrados = registros.filter(reg => {
    const coincideFecha = filtroFecha ? reg.fecha === filtroFecha : true;
    const coincideTren = filtroTren ? reg.tren.includes(filtroTren) : true;
    return coincideFecha && coincideTren;
  });

  const exportarCSV = () => {
    const encabezados = "Fecha,Tren,Loc,Empresa,Origen,Destino,H.Inicio,H.Llegada,Neto,Tara,Bruto\n";
    const filas = registrosFiltrados.map(r => 
      `${r.fecha},${r.tren},${r.locomotora},${r.empresa},${r.origen},${r.destino},${r.horaInicio},${r.horaLlegada},${r.toneladasNetas},${r.tara},${r.toneladasBrutas}`
    ).join("\n");
    
    const blob = new Blob([encabezados + filas], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tarjetas_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="container mt-5" style={{paddingTop: '50px'}}>
      <Card className="p-4 shadow-sm mb-4 bg-light">
        <h4 className="text-primary mb-3">Carga de Tarjeta de Tren</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Fecha</Form.Label><Form.Control type="date" name="fecha" value={nuevaTarjeta.fecha} onChange={handleChange} required /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>N° Tren</Form.Label><Form.Control type="text" name="tren" value={nuevaTarjeta.tren} onChange={handleChange} required /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Locomotora</Form.Label><Form.Control type="text" name="locomotora" value={nuevaTarjeta.locomotora} onChange={handleChange} /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-2"><Form.Label>Hora Inicio</Form.Label><Form.Control type="time" name="horaInicio" value={nuevaTarjeta.horaInicio} onChange={handleChange} /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-2"><Form.Label>Hora Llegada</Form.Label><Form.Control type="time" name="horaLlegada" value={nuevaTarjeta.horaLlegada} onChange={handleChange} /></Form.Group></Col>
          </Row>
          <Row>
            <Col md={3}><Form.Group className="mb-2"><Form.Label>Empresa</Form.Label><Form.Select name="empresa" value={nuevaTarjeta.empresa} onChange={handleChange}><option value="">Seleccione...</option>{EMPRESAS.map(e => <option key={e} value={e}>{e}</option>)}</Form.Select></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-2"><Form.Label>Origen</Form.Label><Form.Select name="origen" value={nuevaTarjeta.origen} onChange={handleChange}><option value="">Seleccione...</option>{ESTACIONES.map(e => <option key={e} value={e}>{e}</option>)}</Form.Select></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-2"><Form.Label>Destino</Form.Label><Form.Select name="destino" value={nuevaTarjeta.destino} onChange={handleChange}><option value="">Seleccione...</option>{ESTACIONES.map(e => <option key={e} value={e}>{e}</option>)}</Form.Select></Form.Group></Col>
            <Col md={1}><Form.Group className="mb-2"><Form.Label>Neto</Form.Label><Form.Control type="number" name="toneladasNetas" value={nuevaTarjeta.toneladasNetas} onChange={handleChange} /></Form.Group></Col>
            <Col md={1}><Form.Group className="mb-2"><Form.Label>Tara</Form.Label><Form.Control type="number" name="tara" value={nuevaTarjeta.tara} onChange={handleChange} /></Form.Group></Col>
            <Col md={1}><Form.Group className="mb-2"><Form.Label>Bruto</Form.Label><Form.Control type="number" value={nuevaTarjeta.toneladasBrutas} disabled className="bg-warning-subtle fw-bold" /></Form.Group></Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3 w-100 fw-bold">GUARDAR TARJETA</Button>
        </Form>
      </Card>

      <Row className="mb-3 align-items-end">
        <Col md={3}><Form.Label>Filtrar Fecha</Form.Label><Form.Control type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} /></Col>
        <Col md={3}><Form.Label>Buscar Tren</Form.Label><Form.Control type="text" placeholder="N°..." value={filtroTren} onChange={(e) => setFiltroTren(e.target.value)} /></Col>
        <Col md={6} className="text-end"><Button variant="success" onClick={exportarCSV}>Exportar CSV</Button></Col>
      </Row>

      <Table responsive striped bordered hover variant="secondary shadow-sm">
        <thead className="table-dark text-center">
          <tr>
            <th>Fecha</th><th>Tren</th><th>H. Inicio</th><th>H. Llegada</th><th>Empresa</th><th>Origen/Destino</th><th>Bruto</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id} className="text-center align-middle">
              <td>{reg.fecha}</td>
              <td><strong>{reg.tren}</strong></td>
              <td>{reg.horaInicio || '-'}</td>
              <td>{reg.horaLlegada || '-'}</td>
              <td>{reg.empresa}</td>
              <td><small>{reg.origen} → {reg.destino}</small></td>
              <td className="fw-bold text-primary">{reg.toneladasBrutas}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => navigate(`/tarjetas/edit/${reg.id}`)}><FontAwesomeIcon icon={faEdit} /></Button>
                  <Button variant="outline-danger" size="sm" onClick={() => eliminarRegistro(reg.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};