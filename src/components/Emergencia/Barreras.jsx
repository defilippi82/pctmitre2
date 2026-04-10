import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore'; 
import { db } from '../../firebaseConfig/firebase'; 
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySwal = withReactContent(Swal);

export const Barreras = () => {
  const { userData } = useContext(UserContext);
  const [pendientes, setPendientes] = useState([]);
  
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    ramal: '',
    aviso: '',
    panPp: '',
    senalamiento: '',
    estacion: '',
    motivo: '',
    sectorAviso: '',
    novedad: '',
    estado: 'Pendiente', // Clave para separar lo activo de lo resuelto
    operadorCarga: userData?.nombre || ''
  });

  const RAMALES = ["MRT", "MRS", "MRM", "MVC", "MBZ"];

  const fetchPendientes = async () => {
    try {
      const q = query(collection(db, 'Barreras'), where("estado", "==", "Pendiente"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPendientes(data);
    } catch (error) {
      console.error("Error al cargar pendientes:", error);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Barreras'), nuevoRegistro);
      MySwal.fire({ title: 'Cargado', text: 'Incidencia registrada', icon: 'success', timer: 1500, showConfirmButton: false });
      
      setNuevoRegistro(prev => ({
        ...prev,
        hora: '', aviso: '', panPp: '', senalamiento: '', estacion: '', motivo: '', sectorAviso: '', novedad: ''
      })); // Mantenemos fecha, ramal y operador
      
      fetchPendientes();
    } catch (error) {
      MySwal.fire('Error', 'No se pudo guardar la incidencia', 'error');
    }
  };

  const handleNormalizar = async (id) => {
    const { value: formValues } = await MySwal.fire({
      title: 'Normalizar Incidencia',
      html: `
        <label class="swal2-label fw-bold">Hora Normal:</label>
        <input id="swal-hora" type="time" class="swal2-input" style="max-width: 150px;">
        <label class="swal2-label fw-bold mt-3">Normalizado Por:</label>
        <input id="swal-por" type="text" class="swal2-input" placeholder="Ej: CAGI PABLO">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Confirmar Normalización',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const hora = document.getElementById('swal-hora').value;
        const por = document.getElementById('swal-por').value;
        if (!hora || !por) {
          Swal.showValidationMessage('Ambos campos son obligatorios');
        }
        return { horaNormal: hora, normalPor: por };
      }
    });

    if (formValues) {
      try {
        await updateDoc(doc(db, "Barreras", id), {
          estado: 'Normalizado',
          horaNormal: formValues.horaNormal,
          normalPor: formValues.normalPor
        });
        MySwal.fire('¡Resuelto!', 'La incidencia fue normalizada y archivada.', 'success');
        fetchPendientes();
      } catch (error) {
        MySwal.fire('Error', 'No se pudo normalizar', 'error');
      }
    }
  };

  return (
    <Container className="mt-5" style={{paddingTop: '30px'}}>
      <Card className="p-4 shadow-sm mb-4 border-left-warning">
        <h4 className="text-warning mb-4 border-bottom pb-2">Registrar Novedad (Barreras / Señales / ADV)</h4>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-2">
            <Col md={2}><Form.Label className="fw-bold">Fecha</Form.Label><Form.Control type="date" name="fecha" value={nuevoRegistro.fecha} onChange={handleChange} required /></Col>
            <Col md={2}><Form.Label className="fw-bold">Hora</Form.Label><Form.Control type="time" name="hora" value={nuevoRegistro.hora} onChange={handleChange} required /></Col>
            <Col md={2}>
                <Form.Label className="fw-bold">Ramal</Form.Label>
                <Form.Select name="ramal" value={nuevoRegistro.ramal} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {RAMALES.map(r => <option key={r} value={r}>{r}</option>)}
                </Form.Select>
            </Col>
            <Col md={3}><Form.Label className="fw-bold">Avisó</Form.Label><Form.Control type="text" name="aviso" value={nuevoRegistro.aviso} onChange={handleChange} placeholder="Quién avisó" required /></Col>
            <Col md={3}><Form.Label className="fw-bold">N° Novedad</Form.Label><Form.Control type="text" name="novedad" value={nuevoRegistro.novedad} onChange={handleChange} placeholder="Ej: 12/2884" /></Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={3}><Form.Label className="fw-bold text-danger">PAN / PP</Form.Label><Form.Control type="text" name="panPp" value={nuevoRegistro.panPp} onChange={handleChange} placeholder="Ej: PAN RUTA 25" /></Col>
            <Col md={3}><Form.Label className="fw-bold text-primary">Señal / Circuito / ADV</Form.Label><Form.Control type="text" name="senalamiento" value={nuevoRegistro.senalamiento} onChange={handleChange} placeholder="Ej: SEÑAL 144" /></Col>
            <Col md={3}><Form.Label className="fw-bold">Estación/Sector</Form.Label><Form.Control type="text" name="estacion" value={nuevoRegistro.estacion} onChange={handleChange} required /></Col>
            <Col md={3}><Form.Label className="fw-bold">Sector de Aviso</Form.Label><Form.Control type="text" name="sectorAviso" value={nuevoRegistro.sectorAviso} onChange={handleChange} placeholder="Ej: CAGI JUAN" /></Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}><Form.Label className="fw-bold">Motivo / Falla</Form.Label><Form.Control type="text" name="motivo" value={nuevoRegistro.motivo} onChange={handleChange} required placeholder="Ej: BRAZO ROTO, A PELIGRO, CAMPANILLA..." /></Col>
          </Row>

          <Button variant="warning" type="submit" className="w-100 fw-bold">REGISTRAR INCIDENCIA PENDIENTE</Button>
        </Form>
      </Card>

      <h5 className="text-danger mt-5 mb-3 fw-bold">Incidencias Pendientes de Normalización</h5>
      <Table responsive striped bordered hover className="shadow-sm">
        <thead className="table-dark text-center">
          <tr>
            <th>Fecha/Hora</th><th>Ramal</th><th>PAN/Señal</th><th>Estación</th><th>Falla</th><th>N° Novedad</th><th>Acción</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {pendientes.length === 0 ? (
            <tr><td colSpan="7" className="text-success fw-bold py-4">No hay incidencias pendientes</td></tr>
          ) : (
            pendientes.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.fecha} {reg.hora}</td>
                <td><span className="badge bg-secondary">{reg.ramal}</span></td>
                <td className="fw-bold">{reg.panPp || reg.senalamiento}</td>
                <td>{reg.estacion}</td>
                <td className="text-danger">{reg.motivo}</td>
                <td>{reg.novedad}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleNormalizar(reg.id)} title="Normalizar">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Normalizar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};