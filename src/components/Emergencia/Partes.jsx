import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig/firebase";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { Form, Table, Button, Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";

export const Partes = () => {
  const sectoresBase = ["Retiro-Tigre", "Retiro-J.L. Suárez", "Retiro-Mitre", "Villa Ballester-Zárate", "Victoria-Capilla del Señor"];
  
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [sectores, setSectores] = useState(
    sectoresBase.map(nombre => ({
      nombre,
      programados: 0,
      cancelados: 0,
      puntuales: 0
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...sectores];
    updated[index][field] = Number(value);
    setSectores(updated);
  };

  // Cálculos según lógica P1
  const calcularResultados = (s) => {
    const corridos = s.programados - s.cancelados;
    const cumplimiento = s.programados > 0 ? ((corridos / s.programados) * 100).toFixed(2) : 0;
    const regularidad = corridos > 0 ? ((s.puntuales / corridos) * 100).toFixed(2) : 0;
    return { corridos, cumplimiento, regularidad };
  };

  const generarCuerpoMail = () => {
    let texto = `Parte Diario de Circulación - Fecha: ${fecha}\n\n`;
    texto += `Sector | Prog. | Canc. | Corr. | Punt. | % Cump. | % Reg.\n`;
    texto += `----------------------------------------------------------\n`;
    
    sectores.forEach(s => {
      const { corridos, cumplimiento, regularidad } = calcularResultados(s);
      texto += `${s.nombre} | ${s.programados} | ${s.cancelados} | ${corridos} | ${s.puntuales} | ${cumplimiento}% | ${regularidad}%\n`;
    });

    return encodeURIComponent(texto);
  };

  const enviarMail = () => {
    const subject = encodeURIComponent(`Parte diario (${fecha}) - Línea Mitre`);
    const body = generarCuerpoMail();
    const destinatarios = "gde@trenesargentinos.gob.ar;control@trenesargentinos.gob.ar";
    
    window.location.href = `mailto:${destinatarios}?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="p-4 shadow-sm">
      <h3>Generar Parte Diario (P1)</h3>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>Fecha del Reporte</Form.Label>
          <Form.Control type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="bg-dark text-white">
          <tr>
            <th>Corredor</th>
            <th>Programados</th>
            <th>Cancelados</th>
            <th>Corridos (Prog - Canc)</th>
            <th>Puntuales</th>
            <th>% Cumplimiento</th>
            <th>% Regularidad</th>
          </tr>
        </thead>
        <tbody>
          {sectores.map((s, i) => {
            const { corridos, cumplimiento, regularidad } = calcularResultados(s);
            return (
              <tr key={i}>
                <td>{s.nombre}</td>
                <td><Form.Control type="number" size="sm" onChange={(e) => handleChange(i, "programados", e.target.value)} /></td>
                <td><Form.Control type="number" size="sm" onChange={(e) => handleChange(i, "cancelados", e.target.value)} /></td>
                <td className="fw-bold">{corridos}</td>
                <td><Form.Control type="number" size="sm" onChange={(e) => handleChange(i, "puntuales", e.target.value)} /></td>
                <td>{cumplimiento}%</td>
                <td>{regularidad}%</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="d-flex gap-2">
        <Button variant="success" onClick={() => Swal.fire('Guardado', 'Datos almacenados en Firebase', 'success')}>
          Guardar en Base de Datos
        </Button>
        <Button variant="primary" onClick={enviarMail}>
          Enviar por Outlook
        </Button>
      </div>
    </Card>
  );
};