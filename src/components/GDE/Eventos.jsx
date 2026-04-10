import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore'; 
import { db } from '../../firebaseConfig/firebase'; 
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faCheckCircle, faExclamationTriangle, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySwal = withReactContent(Swal);

export const Eventos = () => {
  const [pendientes, setPendientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  
  // Filtros para el historial
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroRamal, setFiltroRamal] = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');

  const RAMALES = ["MRT", "MRS", "MRM", "MVC", "MBZ"];

  // Función para cargar ambas tablas
  const fetchData = async () => {
    try {
      // 1. Cargar Pendientes
      const qPendientes = query(collection(db, 'Barreras'), where("estado", "==", "Pendiente"));
      const snapPendientes = await getDocs(qPendientes);
      const dataPendientes = snapPendientes.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dataPendientes.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
      setPendientes(dataPendientes);

      // 2. Cargar Historial (Normalizados)
      const qHistorial = query(collection(db, 'Barreras'), where("estado", "==", "Normalizado"));
      const snapHistorial = await getDocs(qHistorial);
      const dataHistorial = snapHistorial.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dataHistorial.sort((a, b) => new Date(`${b.fecha}T${b.hora}`) - new Date(`${a.fecha}T${a.hora}`)); // Más recientes primero
      setHistorial(dataHistorial);
      
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNormalizar = async (id) => {
    const { value: formValues } = await MySwal.fire({
      title: 'Normalizar Evento',
      html: `
        <label class="swal2-label fw-bold">Hora Normal:</label>
        <input id="swal-hora" type="time" class="swal2-input" style="max-width: 150px;">
        <label class="swal2-label fw-bold mt-3">Normalizado Por:</label>
        <input id="swal-por" type="text" class="swal2-input" placeholder="Ej: CAGI PABLO">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const hora = document.getElementById('swal-hora').value;
        const por = document.getElementById('swal-por').value;
        if (!hora || !por) return Swal.showValidationMessage('Completar ambos campos');
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
        MySwal.fire({title: '¡Normalizado!', icon: 'success', timer: 1500, showConfirmButton: false});
        fetchData(); // Recarga TODO para mover el registro de arriba hacia abajo
      } catch (error) {
        MySwal.fire('Error', 'No se pudo normalizar', 'error');
      }
    }
  };

  const registrosFiltrados = historial.filter(reg => {
    const matchFecha = filtroFecha ? reg.fecha === filtroFecha : true;
    const matchRamal = filtroRamal ? reg.ramal === filtroRamal : true;
    const combinacionUbicacion = `${reg.panPp || ''} ${reg.senalamiento || ''} ${reg.estacion || ''}`.toLowerCase();
    const matchUbicacion = filtroUbicacion ? combinacionUbicacion.includes(filtroUbicacion.toLowerCase()) : true;
    return matchFecha && matchRamal && matchUbicacion;
  });

  const exportarCSV = () => {
    const encabezados = "Fecha,Hora,Ramal,Aviso,PAN/PP,Senal/ADV,Estacion,Falla,Novedad,HoraNormal,NormalPor\n";
    const filas = registrosFiltrados.map(r => 
      `${r.fecha},${r.hora},${r.ramal},${r.aviso},${r.panPp},${r.senalamiento},${r.estacion},${r.motivo},${r.novedad},${r.horaNormal},${r.normalPor}`
    ).join("\n");
    const blob = new Blob([encabezados + filas], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Eventos_Historicos_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <Container fluid className="mt-5 px-4" style={{paddingTop: '30px'}}>
      
      {/* SECCIÓN 1: EVENTOS PENDIENTES */}
      <h4 className="text-danger fw-bold mb-3 border-bottom pb-2">
        <FontAwesomeIcon icon={faExclamationTriangle} className="me-2"/> Eventos Pendientes
      </h4>
      <Table responsive striped bordered hover className="shadow-sm mb-5">
        <thead className="table-danger text-center">
          <tr>
            <th>Hora Aviso</th><th>Ramal</th><th>PAN/PP</th><th>Señal/ADV</th><th>Estación</th><th>Falla</th><th>N° Novedad</th><th>Acción</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center bg-white">
          {pendientes.length === 0 ? (
            <tr><td colSpan="8" className="text-success fw-bold py-3">No hay eventos pendientes.</td></tr>
          ) : (
            pendientes.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.fecha} <br/><strong className="text-danger">{reg.hora} hs</strong></td>
                <td><span className="badge bg-dark">{reg.ramal}</span></td>
                <td className="fw-bold">{reg.panPp || '-'}</td>
                <td className="fw-bold text-primary">{reg.senalamiento || '-'}</td>
                <td>{reg.estacion}</td>
                <td className="text-danger fw-bold">{reg.motivo}</td>
                <td>{reg.novedad}</td>
                <td>
                  <Button variant="success" size="sm" onClick={() => handleNormalizar(reg.id)}>
                    <FontAwesomeIcon icon={faCheckCircle} /> Normalizar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* SECCIÓN 2: HISTORIAL Y BÚSQUEDA */}
      <h4 className="text-success fw-bold mb-3 border-bottom pb-2">
        <FontAwesomeIcon icon={faHistory} className="me-2"/> Historial de Eventos Normalizados
      </h4>
      
      <Card className="p-3 mb-3 bg-light shadow-sm">
        <Row className="align-items-end">
          <Col md={2}>
            <Form.Label className="small fw-bold">Fecha</Form.Label>
            <Form.Control type="date" size="sm" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
          </Col>
          <Col md={2}>
            <Form.Label className="small fw-bold">Ramal</Form.Label>
            <Form.Select size="sm" value={filtroRamal} onChange={(e) => setFiltroRamal(e.target.value)}>
                <option value="">TODOS</option>
                {RAMALES.map(r => <option key={r} value={r}>{r}</option>)}
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Label className="small fw-bold">Buscar Ubicación (Estación, PAN, Señal)</Form.Label>
            <Form.Control type="text" size="sm" placeholder="Ej: RUTA 25, Señal 144..." value={filtroUbicacion} onChange={(e) => setFiltroUbicacion(e.target.value)} />
          </Col>
          <Col md={4} className="text-end">
            <Button variant="outline-success" size="sm" className="w-100 fw-bold" onClick={exportarCSV}>Descargar Historial CSV</Button>
          </Col>
        </Row>
      </Card>

      <Table responsive striped bordered hover className="shadow-sm table-sm" style={{fontSize: '0.9rem'}}>
        <thead className="table-dark text-center">
          <tr>
            <th>Fecha Aviso</th><th>Ramal</th><th>Infraestructura (PAN / Señal)</th><th>Estación</th><th>Motivo</th><th>Novedad</th><th className="bg-success">H. Normal</th><th className="bg-success">Normal Por</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center bg-white">
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id}>
              <td>{reg.fecha} <br/><span className="text-muted">{reg.hora}hs</span></td>
              <td><span className="badge bg-secondary">{reg.ramal}</span></td>
              <td className="fw-bold">{reg.panPp} {reg.senalamiento ? ` / ${reg.senalamiento}` : ''}</td>
              <td>{reg.estacion}</td>
              <td>{reg.motivo}</td>
              <td><small>{reg.novedad}</small></td>
              <td className="fw-bold text-success">{reg.horaNormal}hs</td>
              <td className="text-success">{reg.normalPor}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};