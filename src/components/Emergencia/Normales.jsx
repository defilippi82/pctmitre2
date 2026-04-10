import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from '../../firebaseConfig/firebase'; 
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';

export const BarrerasNormalizadas = () => {
  const [historial, setHistorial] = useState([]);
  
  // Filtros
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroRamal, setFiltroRamal] = useState('');
  const [filtroPan, setFiltroPan] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');

  const fetchHistorial = async () => {
    try {
      const q = query(collection(db, 'Barreras'), where("estado", "==", "Normalizado"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenar por fecha y hora descendente para ver lo más reciente arriba
      data.sort((a, b) => new Date(`${b.fecha}T${b.hora}`) - new Date(`${a.fecha}T${a.hora}`));
      setHistorial(data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const registrosFiltrados = historial.filter(reg => {
    const matchFecha = filtroFecha ? reg.fecha === filtroFecha : true;
    const matchRamal = filtroRamal ? reg.ramal === filtroRamal : true;
    const matchPan = filtroPan ? (reg.panPp?.toLowerCase().includes(filtroPan.toLowerCase()) || reg.senalamiento?.toLowerCase().includes(filtroPan.toLowerCase())) : true;
    const matchUsuario = filtroUsuario ? reg.normalPor?.toLowerCase().includes(filtroUsuario.toLowerCase()) : true;
    return matchFecha && matchRamal && matchPan && matchUsuario;
  });

  const exportarCSV = () => {
    const encabezados = "Fecha,Hora,Ramal,Aviso,PAN/PP,Senalamiento,Estacion,Motivo,Novedad,HoraNormal,NormalPor\n";
    const filas = registrosFiltrados.map(r => 
      `${r.fecha},${r.hora},${r.ramal},${r.aviso},${r.panPp},${r.senalamiento},${r.estacion},${r.motivo},${r.novedad},${r.horaNormal},${r.normalPor}`
    ).join("\n");
    
    const blob = new Blob([encabezados + filas], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Historial_Normalizadas_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <Container className="mt-5" style={{paddingTop: '30px'}}>
      <Card className="p-4 shadow-sm mb-4 bg-light border-left-success">
        <h4 className="text-success mb-3 fw-bold">Historial de Barreras y Señales Normalizadas</h4>
        
        <Row className="align-items-end">
          <Col md={2}>
            <Form.Label className="small fw-bold">Fecha</Form.Label>
            <Form.Control type="date" size="sm" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
          </Col>
          <Col md={2}>
            <Form.Label className="small fw-bold">Ramal</Form.Label>
            <Form.Select size="sm" value={filtroRamal} onChange={(e) => setFiltroRamal(e.target.value)}>
                <option value="">TODOS</option>
                <option value="MRT">MRT</option>
                <option value="MRS">MRS</option>
                <option value="MRM">MRM</option>
                <option value="MVC">MVC</option>
                <option value="MBZ">MBZ</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label className="small fw-bold">Buscar PAN/Señal</Form.Label>
            <Form.Control type="text" size="sm" placeholder="Ej: RUTA 25..." value={filtroPan} onChange={(e) => setFiltroPan(e.target.value)} />
          </Col>
          <Col md={3}>
            <Form.Label className="small fw-bold">Normalizado Por (Usuario)</Form.Label>
            <Form.Control type="text" size="sm" placeholder="Ej: CAGI PABLO..." value={filtroUsuario} onChange={(e) => setFiltroUsuario(e.target.value)} />
          </Col>
          <Col md={2} className="text-end">
            <Button variant="outline-success" size="sm" className="w-100 fw-bold" onClick={exportarCSV}>Descargar CSV</Button>
          </Col>
        </Row>
      </Card>

      <Table responsive striped bordered hover className="shadow-sm table-sm" style={{fontSize: '0.9rem'}}>
        <thead className="table-dark text-center">
          <tr>
            <th>Fecha</th><th>Ramal</th><th>Infraestructura (PAN / Señal)</th><th>Estación</th><th>Motivo</th><th>N° Novedad</th><th className="bg-success">H. Normal</th><th className="bg-success">Normal Por</th>
          </tr>
        </thead>
        <tbody className="align-middle text-center">
          {registrosFiltrados.map((reg) => (
            <tr key={reg.id}>
              <td>{reg.fecha} <br/><small className="text-muted">{reg.hora}hs</small></td>
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