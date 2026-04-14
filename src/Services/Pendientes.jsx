import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore'; 
import { db } from '../firebaseConfig/firebase'; 
import { Table, Button, Container, Card, Row, Col, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faCheckCircle, faExclamationTriangle, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySwal = withReactContent(Swal);

export const Pendientes = () => {
  const [registrosRaw, setRegistrosRaw] = useState([]); // Todos los pendientes de la DB
  const [pendientesFiltrados, setPendientesFiltrados] = useState([]); // Lo que se muestra
  const [filtroRamal, setFiltroRamal] = useState('TODOS');

  const fetchPendientes = async () => {
    try {
      const q = query(collection(db, 'Barreras'), where("estado", "==", "Pendiente"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenamiento inicial por Ramal y luego por Fecha/Hora
      const ordenados = data.sort((a, b) => {
        const ramalA = a.ramal || "";
        const ramalB = b.ramal || "";
        if (ramalA < ramalB) return -1;
        if (ramalA > ramalB) return 1;
        return new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`);
      });

      setRegistrosRaw(ordenados);
      setPendientesFiltrados(ordenados);
    } catch (error) {
      console.error("Error al cargar pendientes:", error);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  // Función para filtrar por el ramal seleccionado
  useEffect(() => {
  if (filtroRamal === 'TODOS') {
    setPendientesFiltrados(registrosRaw);
  } else if (filtroRamal === 'DIESEL') {
    // Si es Diésel, filtramos por ambos ramales
    const filtrados = registrosRaw.filter(reg => reg.ramal === 'MVZ' || reg.ramal === 'MVC');
    setPendientesFiltrados(filtrados);
  } else {
    // Filtro normal para un solo ramal
    const filtrados = registrosRaw.filter(reg => reg.ramal === filtroRamal);
    setPendientesFiltrados(filtrados);
  }
}, [filtroRamal, registrosRaw]);

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
      confirmButtonText: 'Confirmar',
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
        MySwal.fire('¡Resuelto!', 'Incidencia normalizada.', 'success');
        fetchPendientes(); 
      } catch (error) {
        MySwal.fire('Error', 'No se pudo actualizar.', 'error');
      }
    }
  };

  return (
    <Container className="mt-5" style={{paddingTop: '30px'}}>
      <Card className="p-4 shadow-sm border-left-danger bg-white">
        
        <Row className="align-items-center mb-4">
          <Col md={7}>
            <h4 className="text-danger fw-bold mb-0">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Monitor de Novedades Pendientes
            </h4>
          </Col>
          <Col md={5}>
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faFilter} className="me-2 text-muted" />
              <Form.Select 
                className="fw-bold border-danger"
                value={filtroRamal}
                onChange={(e) => setFiltroRamal(e.target.value)}
              >
                <option value="TODOS">MOSTRAR TODOS LOS RAMALES</option>
                <option value="MRS">MRS (Retiro - Suárez)</option>
                <option value="MRM">MRM (Retiro - Mitre)</option>
                <option value="MRT">MRT (Retiro - Tigre)</option>
                <option value="MVC">MVC (Victoria - Capilla)</option>
                <option value="MVZ">MVZ (Villa Ballester - Zárate)</option>
                <option value="DIESEL">Diésel(MVZ + MVC )</option>
              </Form.Select>
            </div>
          </Col>
        </Row>
        
        <Table responsive striped bordered hover className="shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Ramal</th><th>Fecha/Hora</th><th>PAN/PP</th><th>Señal/Circ./ADV</th><th>Estación</th><th>Falla</th><th>Acción</th>
            </tr>
          </thead>
          <tbody className="align-middle text-center">
            {pendientesFiltrados.length === 0 ? (
              <tr><td colSpan="7" className="text-muted fw-bold py-4">No hay incidencias pendientes en {filtroRamal}.</td></tr>
            ) : (
              pendientesFiltrados.map((reg) => (
                <tr key={reg.id}>
                  <td><span className="badge bg-dark px-3 py-2">{reg.ramal}</span></td>
                  <td className="fw-bold">{reg.fecha} <br/><small className="text-danger">{reg.hora} hs</small></td>
                  <td className="fw-bold text-uppercase">{reg.panPp || '-'}</td>
                  <td className="fw-bold text-primary">{reg.senalamiento || '-'}</td>
                  <td>{reg.estacion}</td>
                  <td className="text-danger fw-bold">{reg.motivo}</td>
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
        <div className="text-end mt-2">
            <small className="text-muted">Total pendientes en vista: {pendientesFiltrados.length}</small>
        </div>
      </Card>
    </Container>
  );
};