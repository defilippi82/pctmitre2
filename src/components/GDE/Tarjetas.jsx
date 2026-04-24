import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// TABLA DE KILOMETRAJE SEGÚN EXCEL
const TABLA_KM = {
  "Retiro-Zárate": 92, "Zárate-Retiro": 92,
  "Dv. Minetti-Zárate": 5, "Zárate-Dv. Minetti": 5,
  "Campana-Dv. Minetti": 7, "Dv. Minetti-Campana": 7,
  "Dv. Minetti-La Bota": 45, "La Bota-Dv. Minetti": 45,
  "Zárate-La Bota": 50, "La Bota-Zárate": 50,
  "Emp. Norte-Retiro": 1, "Retiro-Emp. Norte": 1,
  "Retiro-Campana": 80, "Campana-Retiro": 80,
  "Escobar-Zárate": 40, "Zárate-Escobar": 40,
  "Campana-Zárate": 12, "Zárate-Campana": 12,
  "Retiro-La Bota": 43, "La Bota-Retiro": 43,
  "Emp. Norte-Zárate": 93, "Zárate-Emp. Norte": 93,
  "Retiro-Puerto": 1, "Puerto-Retiro": 1,
  "Retiro-Ugarteche": 4, "Ugarteche-Retiro": 4,
  "Zárate-Colegiales": 83, "Colegiales-Zárate": 83
};

const ESTACIONES = ["Retiro", "Zárate", "Dv. Minetti", "La Bota", "Campana", "Emp. Norte", "Ugarteche", "Puerto", "Escobar", "Colegiales"];
const EMPRESAS = ["Trenes Argentinos", "NCA", "BCYL S.A", "Ferrosur Roca", "Belgrano Cargas", "Fepsa"];

export const Tarjetas = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTren, setFiltroTren] = useState('');
  
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    fechaIngreso: '',
    horaIngreso: '',
    fechaEgreso: '',
    horaEgreso: '',
    tren: '',
    locomotora: '',
    empresa: '',
    origen: '',
    destino: '',
    toneladas: '',
    cantVagones: '',
    cantEjes: 0,
    sentido: '',
    km: 0,
    tiempoRed: '',
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

  // LÓGICA DE CÁLCULOS AUTOMÁTICOS
  const calcularAutomaticos = (datos) => {
    let updates = { ...datos };

    // 1. Cálculo de Ejes (Vagones * 4)
    if (datos.cantVagones) {
      updates.cantEjes = Number(datos.cantVagones) * 4;
    }

    // 2. Lógica de Sentido (Basado en tu fórmula SI de Excel)
    const { origen, destino } = datos;
    const combinacion = `${origen} ${destino}`;
    
    if (origen === "Retiro") updates.sentido = "Asc";
    else if (origen === "Zárate") updates.sentido = "Desc";
    else if (destino === "Retiro") updates.sentido = "Desc";
    else if (destino === "Zárate") updates.sentido = "Asc";
    else if (combinacion === "Dv. Minetti La Bota") updates.sentido = "Desc";
    else if (combinacion === "Campana Dv. Minetti") updates.sentido = "Asc";
    else updates.sentido = "";

    // 3. Kilometraje
    const keyKM = `${origen}-${destino}`;
    updates.km = TABLA_KM[keyKM] || 0;

    // 4. Tiempo de Red (Diferencia entre Ingreso y Egreso)
    if (datos.fechaIngreso && datos.horaIngreso && datos.fechaEgreso && datos.horaEgreso) {
      const inicio = new Date(`${datos.fechaIngreso}T${datos.horaIngreso}`);
      const fin = new Date(`${datos.fechaEgreso}T${datos.horaEgreso}`);
      const diffMs = fin - inicio;
      if (diffMs > 0) {
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        updates.tiempoRed = `${String(diffHrs).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}`;
      } else {
        updates.tiempoRed = "00:00";
      }
    }

    return updates;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaTarjeta(prev => {
      const updated = { ...prev, [name]: value };
      return calcularAutomaticos(updated);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Tarjetas"), nuevaTarjeta);
      Swal.fire('Éxito', 'Tarjeta de carga guardada', 'success');
      setNuevaTarjeta({
        fechaIngreso: '', horaIngreso: '', fechaEgreso: '', horaEgreso: '',
        tren: '', locomotora: '', empresa: '', origen: '', destino: '',
        toneladas: '', cantVagones: '', cantEjes: 0, sentido: '', km: 0, tiempoRed: '',
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
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    });
    if (result.isConfirmed) {
      await deleteDoc(doc(db, "Tarjetas", id));
      fetchRegistros();
      Swal.fire('Borrado', 'Registro eliminado', 'success');
    }
  };

  const registrosFiltrados = registros.filter(reg => {
    const coincideFecha = filtroFecha ? reg.fechaIngreso === filtroFecha : true;
    const coincideTren = filtroTren ? reg.tren.includes(filtroTren) : true;
    return coincideFecha && coincideTren;
  });

  return (
    <div className="container mt-5" style={{paddingTop: '50px'}}>
      <Card className="p-4 shadow-sm mb-4 bg-light">
        <h4 className="text-primary mb-3">Tarjeta de Trenes de Carga</h4>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3}><Form.Group className="mb-2"><Form.Label>Ingreso (Fecha/Hora)</Form.Label>
              <div className="d-flex gap-1">
                <Form.Control type="date" name="fechaIngreso" value={nuevaTarjeta.fechaIngreso} onChange={handleChange} required />
                <Form.Control type="time" name="horaIngreso" value={nuevaTarjeta.horaIngreso} onChange={handleChange} required />
              </div>
            </Form.Group></Col>
            <Col md={3}><Form.Group className="mb-2"><Form.Label>Egreso (Fecha/Hora)</Form.Label>
              <div className="d-flex gap-1">
                <Form.Control type="date" name="fechaEgreso" value={nuevaTarjeta.fechaEgreso} onChange={handleChange} required />
                <Form.Control type="time" name="horaEgreso" value={nuevaTarjeta.horaEgreso} onChange={handleChange} required />
              </div>
            </Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>N° Tren</Form.Label><Form.Control type="text" name="tren" value={nuevaTarjeta.tren} onChange={handleChange} required /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Locomotora</Form.Label><Form.Control type="text" name="locomotora" value={nuevaTarjeta.locomotora} onChange={handleChange} /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Empresa</Form.Label><Form.Select name="empresa" value={nuevaTarjeta.empresa} onChange={handleChange} required><option value="">Seleccione...</option>{EMPRESAS.map(e => <option key={e} value={e}>{e}</option>)}</Form.Select></Form.Group></Col>
          </Row>
          <Row>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Origen</Form.Label><Form.Select name="origen" value={nuevaTarjeta.origen} onChange={handleChange} required><option value="">Seleccione...</option>{ESTACIONES.map(e => <option key={e} value={e}>{e}</option>)}</Form.Select></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Destino</Form.Label><Form.Select name="destino" value={nuevaTarjeta.destino} onChange={handleChange} required><option value="">Seleccione...</option>{ESTACIONES.map(e => <option key={e} value={e}>{e}</option>)}</Form.Select></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Toneladas</Form.Label><Form.Control type="number" name="toneladas" value={nuevaTarjeta.toneladas} onChange={handleChange} /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Vagones</Form.Label><Form.Control type="number" name="cantVagones" value={nuevaTarjeta.cantVagones} onChange={handleChange} /></Form.Group></Col>
            <Col md={1}><Form.Group className="mb-2"><Form.Label>Ejes</Form.Label><Form.Control type="number" value={nuevaTarjeta.cantEjes} disabled className="bg-white text-center fw-bold" /></Form.Group></Col>
            <Col md={1}><Form.Group className="mb-2"><Form.Label>KM</Form.Label><Form.Control type="number" value={nuevaTarjeta.km} disabled className="bg-white text-center" /></Form.Group></Col>
            <Col md={2}><Form.Group className="mb-2"><Form.Label>Sentido / Tiempo</Form.Label>
              <div className="d-flex gap-1">
                <Form.Control type="text" value={nuevaTarjeta.sentido} disabled className="text-center fw-bold" />
                <Form.Control type="text" value={nuevaTarjeta.tiempoRed} disabled className="text-center bg-warning-subtle" />
              </div>
            </Form.Group></Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3 w-100 fw-bold">GUARDAR EN BASE DE DATOS</Button>
        </Form>
      </Card>

      <Table responsive striped bordered hover className="shadow-sm">
        <thead className="table-dark text-center">
          <tr>
            <th>Tren</th><th>Ingreso</th><th>Egreso</th><th>Origen/Destino</th><th>KM</th><th>Tiempo</th><th>Toneladas</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id} className="text-center align-middle">
              <td><strong>{reg.tren}</strong> <br/><small>{reg.sentido}</small></td>
              <td>{reg.fechaIngreso} <br/> {reg.horaIngreso}</td>
              <td>{reg.fechaEgreso} <br/> {reg.horaEgreso}</td>
              <td><small>{reg.origen} → {reg.destino}</small></td>
              <td>{reg.km}</td>
              <td className="fw-bold">{reg.tiempoRed}</td>
              <td>{reg.toneladas}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
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