import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore'; 
import { db } from '../firebaseConfig/firebase'; 
import { Table, Button, Container, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySwal = withReactContent(Swal);

export const Pendientes = () => {
  const [pendientes, setPendientes] = useState([]);

  const fetchPendientes = async () => {
    try {
      const q = query(collection(db, 'Barreras'), where("estado", "==", "Pendiente"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenar por fecha y hora (más antiguos primero, que son los que más urgen)
      data.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
      setPendientes(data);
    } catch (error) {
      console.error("Error al cargar pendientes:", error);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

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
        MySwal.fire('¡Resuelto!', 'La incidencia fue normalizada.', 'success');
        fetchPendientes(); // Recarga la tabla para que desaparezca
      } catch (error) {
        MySwal.fire('Error', 'No se pudo normalizar', 'error');
      }
    }
  };

  return (
    <Container className="mt-5" style={{paddingTop: '30px'}}>
      <Card className="p-4 shadow-sm border-left-danger">
        <h4 className="text-danger mb-4 fw-bold">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          Monitor de Novedades Pendientes
        </h4>
        
        <Table responsive striped bordered hover className="shadow-sm">
          <thead className="table-dark text-center">
            <tr>
              <th>Fecha/Hora</th><th>Ramal</th><th>PAN/PP</th><th>Señal/Circ./ADV</th><th>Estación</th><th>Falla</th><th>N° Novedad</th><th>Acción</th>
            </tr>
          </thead>
          <tbody className="align-middle text-center">
            {pendientes.length === 0 ? (
              <tr><td colSpan="8" className="text-success fw-bold py-4">Excelente. No hay incidencias pendientes.</td></tr>
            ) : (
              pendientes.map((reg) => (
                <tr key={reg.id}>
                  <td className="fw-bold">{reg.fecha} <br/><small className="text-danger">{reg.hora} hs</small></td>
                  <td><span className="badge bg-secondary">{reg.ramal}</span></td>
                  <td className="fw-bold">{reg.panPp || '-'}</td>
                  <td className="fw-bold text-primary">{reg.senalamiento || '-'}</td>
                  <td>{reg.estacion}</td>
                  <td className="text-danger fw-bold">{reg.motivo}</td>
                  <td>{reg.novedad}</td>
                  <td>
                    <Button variant="success" size="sm" onClick={() => handleNormalizar(reg.id)}>
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" /> Normalizar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};