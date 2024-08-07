import React, { useState, useContext, useEffect } from 'react';
import { db } from '../../firebaseConfig/firebase';
import { collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { Form, Table, Button, Row, Col, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { UserContext } from '../../Services/UserContext';

export const Precauciones = () => {
  const [responsable, setResponsable] = useState('');
  const [userData, setUserData] = useState();
  const [precauciones, setPrecauciones] = useState([]);
  const [cabin, setCabin] = useState('');
  const [currentView, setCurrentView] = useState('');
  const [secciones, setSecciones] = useState([]);
  const [newPrecaucion, setNewPrecaucion] = useState({
    user: userData?.apellido || '',
    date: new Date().toISOString().split('T')[0],
    cabin: '',
    section: '',
    cause: '',
  });

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('userData');
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage));
    }
  }, []);
  // Otros efectos que dependan de userData
  useEffect(() => {
    if (userData && userData.nombre) {
        setResponsable(userData.apellido);
    }
  }, [userData]);

  useEffect(() => {
    const q = query(collection(db, 'precauciones'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const precaucionesArray = [];
      querySnapshot.forEach((doc) => {
        precaucionesArray.push({ id: doc.id, ...doc.data() });
      });
      setPrecauciones(precaucionesArray);
    });
    return () => unsubscribe();
  }, []);

  const handleCabinChange = (e) => {
    setCabin(e.target.value);
    setNewPrecaucion({ ...newPrecaucion, cabin: e.target.value });
  };

  const handleCurrentViewChange = (e) => {
    setCurrentView(e.target.value);
    setNewPrecaucion({ ...newPrecaucion, section: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSecciones((prev) =>
      checked ? [...prev, value] : prev.filter((sec) => sec !== value)
    );
  };

  const handleAddPrecaucion = async () => {
    const updatedPrecaucion = {
      ...newPrecaucion,
      secciones: secciones.join(', '),
      cause: currentView,
    };
    try {
      await addDoc(collection(db, 'precauciones'), updatedPrecaucion);
      Swal.fire('Agregado!', 'La precaución ha sido agregada.', 'success');
      setNewPrecaucion({
        user: userData?.apellido || '',
        date: new Date().toISOString().split('T')[0],
        cabin: '',
        section: '',
        cause: '',
      });
      setSecciones([]);
      setCabin('');
      setCurrentView('');
    } catch (error) {
      Swal.fire('Error', 'No se pudo agregar la precaución.', 'error');
    }
  };

  const handleEdit = async (precaucion) => {
    const { id, ...data } = precaucion;
    const { value: formValues } = await Swal.fire({
      title: 'Editar Precaución',
      html:
        `<input id="swal-input1" class="swal2-input" value="${data.secciones}">` +
        `<input id="swal-input2" class="swal2-input" value="${data.cabin}">` +
        `<input id="swal-input3" class="swal2-input" value="${data.section}">` +
        `<input id="swal-input4" class="swal2-input" value="${data.cause}">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value
        ];
      }
    });

    if (formValues) {
      try {
        await updateDoc(doc(db, 'precauciones', id), {
          secciones: formValues[0],
          cabin: formValues[1],
          section: formValues[2],
          cause: formValues[3],
        });
        Swal.fire('Actualizado!', 'La precaución ha sido actualizada.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar la precaución.', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bórralo!',
      cancelButtonText: 'No, cancélalo!',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'precauciones', id));
        Swal.fire('Borrado!', 'La precaución ha sido borrada.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo borrar la precaución.', 'error');
      }
    }
  };

  return (
    <div>
      <Form>
        <Form.Group controlId="cabinSelect">
          <Form.Label>Cabines</Form.Label>
          <Form.Control as="select" value={cabin} onChange={handleCabinChange}>
            <option value="">Seleccione un Cabin</option>
            <option value="1rn">Cab 1 RN</option>
            <option value="2rn">Cab 2 RN</option>
            <option value="empMaldonado">Empal. Maldonado</option>
            <option value="tf">Santa Fé</option>
            <option value="al">Colegiales</option>
            <option value="av">Aviles</option>
            <option value="nr">Belgrano "R"</option>
            <option value="ec">Emp. Coghlan</option>
            <option value="fd">Florida</option>
            <option value="bm">Bme. Mitre</option>
            <option value="dd">Drago</option>
            <option value="uz">Urquiza</option>
            <option value="py">Pueyrredón</option>
            <option value="mg">Cab 1 SM</option>
            <option value="sm1">Cab 2 SM</option>
            <option value="sm2">Cab 3 SM</option>
            <option value="bl">Ballester</option>
            <option value="jl">Suárez</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="currentViewSelect">
          <Form.Label>Sector</Form.Label>
          <Form.Control as="select" value={currentView} onChange={handleCurrentViewChange}>
            <option value="">Seleccione</option>
            <option value="senales">Señales</option>
            <option value="adv">ADV</option>
            <option value="barreras">Barreras</option>
          </Form.Control>
        </Form.Group>

        {currentView && (
          <Card className="mb-3">
            <Card.Header as="h3">{currentView === 'senales' ? 'Señales' : currentView === 'adv' ? 'ADV' : 'Barreras'}</Card.Header>
            <Card.Body>
              <Form.Group>
                {(currentView === 'senales' ? ["M1", "S1", "M2", "S2", "M3", "S3", "M4", "S4", "M5", "S5", "M6", "S7", "M7", "S7", "M8", "S8", "M9", "S9", "M10", "S10", "M11", "S11", "M12", "S12", "M13", 13, "M14", 14, "M15", 15, "M16", 16, "M17", 17, "M18", 18, "M19", 19, "M21", 21, "M22", 22, "M23", "M24", 24, "M25", 25, "M26", 26, "M27", 27, "M28", 28, "M29", 29, "M31", 31, "M32", 32, "M33", 34, "M35", "M39", 39, "M43", 43, "M47", 47, 54, 2, 10, 54, "C5", "Todas las Plataformas"]
                  : currentView === 'adv' ? ["6A", "6B", "6B", "30A", "30B", "34A", "34B", "25B", "20B", "20A", "20C", "19C", "19B", "19A", "8B", "8A", "10A", "10B", "12A", "12B", "14A", "14B", "16A", "16B", "18.", "36A", "36B", "23A", "23B", "31A", "31B", "37A", "37B", "28A", "28B", "21A", "21B", "27.", "22.", "33.", "35.", "42A", "42B", "39A", "39B", "41A", "41B", "40A", "40B", "43.", "44.", "46.", "47A", "47B", "48A", "48B", "49."]
                    : ["Barrera 1", "Barrera 2", "Barrera 3"]).map(sec => (
                      <Form.Check
                        key={sec}
                        type="checkbox"
                        id={`checkbox-${sec}`}
                        label={sec}
                        value={sec}
                        onChange={handleCheckboxChange}
                        checked={secciones.includes(sec)}
                        className="mb-2"
                      />
                    ))}
              </Form.Group>
            </Card.Body>
          </Card>
        )}

        <Button variant="primary" onClick={handleAddPrecaucion}>
          Agregar Precaución
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Secciones</th>
            <th>Dia de Inicio</th>
            <th>Sector</th>
            <th>Precaucion</th>
            <th>Operador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {precauciones.map((precaucion) => (
            <tr key={precaucion.id}>
              <td>{precaucion.secciones}</td>
              <td>{precaucion.date}</td>
              <td>{precaucion.cabin}</td>
              <td>{precaucion.cause}</td>
              <td>{precaucion.user}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(precaucion)}>
                  <i className="fas fa-edit"></i>
                </Button>
                <Button variant="danger" onClick={() => handleDelete(precaucion.id)}>
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};


