import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig/firebase";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";
import { Form, Table, Button, Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";

export const Partes = () => {
  const franjasHorarias = [
    "00:00 - 06:00",
    "06:00 - 08:30",
    "08:30 - 12:00",
    "12:00 - 16:00",
    "16:00 - 18:30",
  ];

  const sectoresBase = ["AP", "BP", "CP", "DP", "EP", "Tren de la Costa"];

  const [franjaSeleccionada, setFranjaSeleccionada] = useState("");
  const [sectores, setSectores] = useState([]);
  const [partes, setPartes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "partes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPartes(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (franjaSeleccionada) {
      setSectores(
        sectoresBase.map((nombre) => ({
          nombre,
          programados: 0,
          circulacion: 0,
          demorados: 0,
          cancelados: 0,
        }))
      );
    }
  }, [franjaSeleccionada]);

  const handleChange = (index, field, value) => {
    const updated = [...sectores];
    updated[index][field] = Number(value);
    setSectores(updated);
  };

  const calcularRegularidad = (programados, cancelados) => {
    if (programados === 0) return 0;
    return (((programados - cancelados) / programados) * 100).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!franjaSeleccionada) {
      Swal.fire("Error", "Seleccione una franja horaria", "error");
      return;
    }

    try {
      await addDoc(collection(db, "partes"), {
        franja: franjaSeleccionada,
        sectores,
        fecha: new Date(),
      });

      Swal.fire("Éxito", "Parte guardado correctamente", "success");
      setFranjaSeleccionada("");
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el parte", "error");
    }
  };

  // 🔴 Cálculo acumulativo
  const calcularAcumulado = (franjaActual) => {
    let totalProg = 0;
    let totalCancel = 0;

    partes.forEach((parte) => {
      if (
        franjasHorarias.indexOf(parte.franja) <=
        franjasHorarias.indexOf(franjaActual)
      ) {
        parte.sectores.forEach((sec) => {
          totalProg += sec.programados;
          totalCancel += sec.cancelados;
        });
      }
    });

    return calcularRegularidad(totalProg, totalCancel);
  };

  return (
    <div>
      <h1>Partes de Regularidad</h1>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Seleccione Franja Horaria</Form.Label>
              <Form.Select
                value={franjaSeleccionada}
                onChange={(e) => setFranjaSeleccionada(e.target.value)}
              >
                <option value="">Seleccione...</option>
                {franjasHorarias.map((fr) => (
                  <option key={fr}>{fr}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {sectores.length > 0 && (
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Sector</th>
                <th>Programados</th>
                <th>Circulación</th>
                <th>Demorados</th>
                <th>Cancelados</th>
                <th>Regularidad %</th>
              </tr>
            </thead>
            <tbody>
              {sectores.map((sector, i) => (
                <tr key={i}>
                  <td>{sector.nombre}</td>
                  <td>
                    <Form.Control
                      type="number"
                      onChange={(e) =>
                        handleChange(i, "programados", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      onChange={(e) =>
                        handleChange(i, "circulacion", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      onChange={(e) =>
                        handleChange(i, "demorados", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      onChange={(e) =>
                        handleChange(i, "cancelados", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    {calcularRegularidad(
                      sector.programados,
                      sector.cancelados
                    )} %
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {sectores.length > 0 && (
          <Button type="submit" className="btn btn-success">
            Guardar Parte
          </Button>
        )}
      </Form>

      <hr />

      <h3>Reportes Guardados</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Franja</th>
            <th>Regularidad Acumulada %</th>
          </tr>
        </thead>
        <tbody>
          {partes.map((parte) => (
            <tr key={parte.id}>
              <td>{parte.franja}</td>
              <td>{calcularAcumulado(parte.franja)} %</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};