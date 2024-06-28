import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';

export const CorteSecc = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [nuevoTrabajo, setNuevoTrabajo] = useState({
    sector: '',
    kmInicio: '',
    paloInicio: '',
    kmFinal: '',
    paloFinal: '',
    responsable: '',
  });
  const [hitos, setHitos] = useState([]);

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'trabajos'));
        const trabajosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrabajos(trabajosList);
      } catch (error) {
        console.error("Error cargando trabajos: ", error);
      }
    };

    const fetchHitos = () => {
      const query = `
        [out:json];
        node["railway"="milestone"]["railway:position"](-34.7,-59,-34.5,-58.5);
        out body;
      `;

      const queryParams = new URLSearchParams({ data: query });
      fetch(`https://overpass-api.de/api/interpreter?${queryParams}`)
        .then(response => response.json())
        .then(data => {
          console.log("Datos de hitos recibidos: ", data);
          setHitos(data.elements);
        })
        .catch(error => {
          console.error("Error en queryOverpass: ", error);
        });
    };

    fetchTrabajos();
    fetchHitos();
  }, []);

  const handleInputChange = (e) => {
    setNuevoTrabajo({ ...nuevoTrabajo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoTrabajo.sector || !nuevoTrabajo.kmInicio || !nuevoTrabajo.paloInicio || 
        !nuevoTrabajo.kmFinal || !nuevoTrabajo.paloFinal || !nuevoTrabajo.responsable) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      const hitoInicio = encontrarHito(nuevoTrabajo.kmInicio, nuevoTrabajo.paloInicio);
      const hitoFinal = encontrarHito(nuevoTrabajo.kmFinal, nuevoTrabajo.paloFinal);

      if (!hitoInicio || !hitoFinal) {
        Swal.fire('Error', 'No se encontraron los hitos especificados', 'error');
        return;
      }

      const nuevoTrabajoData = {
        ...nuevoTrabajo,
        horaInicio: new Date().toISOString(),
        numeroTrabajo: trabajos.length + 1,
        secciones: calcularSecciones(nuevoTrabajo),
        viaExpedita: null,
        latInicio: hitoInicio.lat,
        lngInicio: hitoInicio.lon,
        latFinal: hitoFinal.lat,
        lngFinal: hitoFinal.lon,
      };

      await addDoc(collection(db, 'trabajos'), nuevoTrabajoData);
      setTrabajos([...trabajos, nuevoTrabajoData]);
      setNuevoTrabajo({
        sector: '',
        kmInicio: '',
        paloInicio: '',
        kmFinal: '',
        paloFinal: '',
        responsable: '',
      });
      Swal.fire('Éxito', 'Trabajo añadido correctamente', 'success');
    } catch (error) {
      console.error("Error agregando trabajo: ", error);
      Swal.fire('Error', 'No se pudo añadir el trabajo', 'error');
    }
  };

  const calcularSecciones = (trabajo) => {
    return `${trabajo.kmInicio}/${trabajo.paloInicio} - ${trabajo.kmFinal}/${trabajo.paloFinal}`;
  };

  const encontrarHito = (km, palo) => {
    return hitos.find(hito => hito.tags['railway:position'] === `${km}/${palo}`);
  };

  return (
    <div className="container mt-4">
      <h2>Corte de Secciones</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Sector</Form.Label>
          <Form.Select name="sector" value={nuevoTrabajo.sector} onChange={handleInputChange} required>
            <option value="">Seleccione un sector</option>
            <option value="AP">AP</option>
            <option value="BP">BP</option>
            <option value="CP">CP</option>
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>KM Inicio</Form.Label>
          <Form.Control type="number" name="kmInicio" value={nuevoTrabajo.kmInicio} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Palo Inicio</Form.Label>
          <Form.Control type="number" name="paloInicio" value={nuevoTrabajo.paloInicio} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>KM Final</Form.Label>
          <Form.Control type="number" name="kmFinal" value={nuevoTrabajo.kmFinal} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Palo Final</Form.Label>
          <Form.Control type="number" name="paloFinal" value={nuevoTrabajo.paloFinal} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Responsable</Form.Label>
          <Form.Control type="text" name="responsable" value={nuevoTrabajo.responsable} onChange={handleInputChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Agregar Trabajo</Button>
      </Form>

      <MapContainer center={[-34.6037, -58.3816]} zoom={13} style={{ height: '400px', width: '100%', marginTop: '20px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {trabajos.map(trabajo => (
          <Polyline 
            key={trabajo.id} 
            positions={[[trabajo.latInicio, trabajo.lngInicio], [trabajo.latFinal, trabajo.lngFinal]]}
            color="red"
          >
            <Tooltip>{`${trabajo.sector} - ${trabajo.responsable}`}</Tooltip>
          </Polyline>
        ))}
        {hitos.map(hito => (
          <Marker 
            key={hito.id} 
            position={[hito.lat, hito.lon]}
          >
            <Tooltip>{hito.tags['railway:position']}</Tooltip>
          </Marker>
        ))}
      </MapContainer>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Nº Trabajo</th>
            <th>Sector</th>
            <th>Responsable</th>
            <th>Secciones</th>
            <th>Hora Inicio</th>
            <th>Via Expedita</th>
          </tr>
        </thead>
        <tbody>
          {trabajos.map(trabajo => (
            <tr key={trabajo.id}>
              <td>{trabajo.numeroTrabajo}</td>
              <td>{trabajo.sector}</td>
              <td>{trabajo.responsable}</td>
              <td>{trabajo.secciones}</td>
              <td>{new Date(trabajo.horaInicio).toLocaleString()}</td>
              <td>{trabajo.viaExpedita ? new Date(trabajo.viaExpedita).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
