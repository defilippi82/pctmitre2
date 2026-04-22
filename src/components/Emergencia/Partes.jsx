import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export const PartesDiarios = () => {
  // --- CONFIGURACIÓN DE PROGRAMADOS POR FRANJA ---
  // Modificá estos números según el cronograma vigente
  const programadosPorFranja = {
    "00:00 - 06:30": { "Retiro-Tigre": 25, "Retiro-J.L. Suárez": 20, "Retiro-Mitre": 10, "V. Ballester-Zárate": 5, "Victoria-Capilla": 4, "Tren de la Costa": 3 },
    "06:30 - 08:00": { "Retiro-Tigre": 35, "Retiro-J.L. Suárez": 30, "Retiro-Mitre": 15, "V. Ballester-Zárate": 8, "Victoria-Capilla": 6, "Tren de la Costa": 2 },
    "08:00 - 13:00": { "Retiro-Tigre": 60, "Retiro-J.L. Suárez": 55, "Retiro-Mitre": 25, "V. Ballester-Zárate": 12, "Victoria-Capilla": 10, "Tren de la Costa": 2 },
    "13:00 - 18:00": { "Retiro-Tigre": 70, "Retiro-J.L. Suárez": 65, "Retiro-Mitre": 30, "V. Ballester-Zárate": 15, "Victoria-Capilla": 12, "Tren de la Costa": 2 }
  };

  const franjas = Object.keys(programadosPorFranja);
  const sectoresBase = ["Retiro-Tigre", "Retiro-J.L. Suárez", "Retiro-Mitre", "V. Ballester-Zárate", "Victoria-Capilla", "tren de la Costa"];

  const [franja, setFranja] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [datos, setDatos] = useState(
    sectoresBase.map(nombre => ({
      nombre,
      prog: 0,
      dem: 0,
      cancParcial: 0,
      cancTotal: 0
    }))
  );

  // Efecto para actualizar programados cuando cambia la franja
  useEffect(() => {
    if (franja) {
      const nuevosDatos = datos.map(sector => ({
        ...sector,
        prog: programadosPorFranja[franja][sector.nombre] || 0
      }));
      setDatos(nuevosDatos);
    }
  }, [franja]);

  const handleChange = (index, field, value) => {
    const updated = [...datos];
    updated[index][field] = Number(value);
    setDatos(updated);
  };

  const calcularFila = (s) => {
    const cancSuma = s.cancParcial + s.cancTotal;
    const corridos = s.prog - cancSuma;
    // Fórmula: Prog - Demorados - Cancelados Totales - Cancelados Parciales
    const puntuales = s.prog - s.dem - cancSuma;
    const cumplimiento = s.prog > 0 ? ((corridos / s.prog) * 100).toFixed(2) : 0;
    const regularidad = corridos > 0 ? ((puntuales / corridos) * 100).toFixed(2) : 0;
    
    return { corridos, puntuales, cumplimiento, regularidad, cancSuma };
  };

 const enviarMail = () => {
    // Función auxiliar para mantener las columnas perfectamente alineadas
    const alinear = (txt, largo) => txt.toString().padEnd(largo, ' ');

    let cuerpo = `PARTE DIARIO - LÍNEA MITRE/ TdC\n`;
    cuerpo += `__________________________________________________________\n\n`;
    cuerpo += `Fecha: ${fecha} | Franja: ${franja}\n`;
    cuerpo += `__________________________________________________________\n\n`;

    // Encabezado de la tabla con anchos fijos
    cuerpo += `${alinear("SECTOR", 19)}| PRG | DEM | CAN | COR | PUN | %REG  |\n`;
    cuerpo += `-------------------|-----|-----|-----|-----|-----|-------|\n`;

    // Cuerpo de la tabla
    datos.forEach(s => {
      const { corridos, puntuales, regularidad, cancSuma } = calcularFila(s);
      
      cuerpo += `${alinear(s.nombre, 19)}| ` +
                `${alinear(s.prog, 3)} | ` +
                `${alinear(s.dem, 3)} | ` +
                `${alinear(cancSuma, 3)} | ` +
                `${alinear(corridos, 3)} | ` +
                `${alinear(puntuales, 3)} | ` +
                `${alinear(regularidad + '%', 5)} |\n`;
    });

    cuerpo += `__________________________________________________________\n`;
    cuerpo += `Generado por Grupo de Estudio - Mitre`;

    // Armado y envío del correo
    const subject = `Parte diario - Mitre/TdC (${fecha}) - ${franja}`;
    const mailtoUrl = `mailto:Mariano.DaRiva@trenesargentinos.gob.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Card className="p-4 shadow-sm border-0">
      <h3 className="text-primary mb-4">Carga de Parte Diario </h3>
      
      <Row className="mb-4">
        <Col md={3}>
          <Form.Label className="fw-bold">Fecha</Form.Label>
          <Form.Control type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </Col>
        <Col md={4}>
          <Form.Label className="fw-bold">Seleccionar Franja Horaria</Form.Label>
          <Form.Select value={franja} onChange={(e) => setFranja(e.target.value)}>
            <option value="">Seleccione franja...</option>
            {franjas.map(f => <option key={f} value={f}>{f}</option>)}
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive className="align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>Sector</th>
            <th>Prog. (Auto)</th>
            <th>Demorados</th>
            <th>Canc. Parcial</th>
            <th>Canc. Total</th>
            <th>Corr.</th>
            <th>Punt.</th>
            <th>Cump.</th>
            <th>Reg.</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((s, i) => {
            const { corridos, puntuales, cumplimiento, regularidad } = calcularFila(s);
            return (
              <tr key={i}>
                <td className="text-start fw-bold">{s.nombre}</td>
                <td>
                  <Form.Control 
                    type="number" 
                    size="sm" 
                    value={s.prog} 
                    onChange={e => handleChange(i, "prog", e.target.value)} 
                    className="text-center fw-bold"
                  />
                </td>
                <td><Form.Control type="number" size="sm" onChange={e => handleChange(i, "dem", e.target.value)} /></td>
                <td><Form.Control type="number" size="sm" onChange={e => handleChange(i, "cancParcial", e.target.value)} /></td>
                <td><Form.Control type="number" size="sm" onChange={e => handleChange(i, "cancTotal", e.target.value)} /></td>
                <td className="bg-light">{corridos}</td>
                <td className="bg-light">{puntuales}</td>
                <td className="text-primary fw-bold">{cumplimiento}%</td>
                <td className="text-success fw-bold">{regularidad}%</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end gap-3 mt-3">
        <Button variant="success" onClick={enviarMail} disabled={!franja}>
          Generar Correo Outlook
        </Button>
      </div>
    </Card>
  );
};