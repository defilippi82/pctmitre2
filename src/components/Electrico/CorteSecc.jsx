import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebaseConfig/firebase'; // Asegúrate de configurar Firebase
import { collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { Form, Table, Button,Row, Col,FloatingLabel, Card} from 'react-bootstrap';
import Swal from 'sweetalert2';


export const CorteSecc = () => {
  const [secciones, setSecciones] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [responsable, setResponsable] = useState('');
  const [trabajos, setTrabajos] = useState([]);
  const [editId, setEditId] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const trabajoImg = new Image();
  trabajoImg.src = '/trabajo.png'; // Cambia esta ruta a la imagen que deseas usar para representar los trabajos
  const trabajoImg2 = new Image();
  trabajoImg2.src = '/trabajo2.png';

  useEffect(() => {
    const q = query(collection(db, "trabajos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trabajosData = [];
      querySnapshot.forEach((doc) => {
        trabajosData.push({ id: doc.id, ...doc.data() });
      });
      setTrabajos(trabajosData);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = '/diagramaN.png';

    const resizeCanvas = () => {
      const { width } = container.getBoundingClientRect();
      const height = width * (600 / 900); // Mantiene la proporción original
      
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      drawCanvas();
    };

    const drawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Renderizar los trabajos sobre la imagen
      trabajos.forEach(trabajo => {
          // Ajusta las coordenadas proporcionalmente
          const secciones = trabajo.secciones;
          secciones.forEach(seccion => {
          const scaleX = canvas.width / 900;
          const scaleY = canvas.height / 600;
          
          switch (seccion) {
            case "8":
              ctx.drawImage(trabajoImg, 0 * scaleX, 120 * scaleY ,25 * scaleX, 25 * scaleY);
              break;
            case "7":
              ctx.drawImage(trabajoImg, 0 * scaleX, 130 * scaleY ,25 * scaleX, 25 * scaleY);
              break;
            case "6":
              ctx.drawImage(trabajoImg, 0 * scaleX, 140 * scaleY ,25 * scaleX, 25 * scaleY);
              break;
            case "5":
              ctx.drawImage(trabajoImg, 0 * scaleX, 150 * scaleY, 25 * scaleX, 25 * scaleY);
              break;
            case "4":
              ctx.drawImage(trabajoImg, 0 * scaleX, 170 * scaleY, 25 * scaleX, 25 * scaleY);
              break;
            case "3":
              ctx.drawImage(trabajoImg, 0 * scaleX, 180 * scaleY, 25 * scaleX, 25 * scaleY);
              break;
            case "2":
              ctx.drawImage(trabajoImg, 0 * scaleX, 190 * scaleY, 25* scaleX, 25 * scaleY);
              break;
            case "1":
              ctx.drawImage(trabajoImg, 0 * scaleX, 200 * scaleY, 25* scaleX, 25 * scaleY);
              break;
            case "10/14":
              ctx.drawImage(trabajoImg, 190 * scaleX, 190 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "11/15":
              ctx.drawImage(trabajoImg, 190 * scaleX, 180 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "13/17":
              ctx.drawImage(trabajoImg, 190 * scaleX, 160 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "12/16":
              ctx.drawImage(trabajoImg, 180 * scaleX, 170 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "18/19":
              ctx.drawImage(trabajoImg, 280 * scaleX, 190 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "40/41":
              ctx.drawImage(trabajoImg, 265 * scaleX, 160 * scaleY, 35* scaleX, 35 * scaleY);
              ctx.drawImage(trabajoImg, 50 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "20/21":
              ctx.drawImage(trabajoImg, 550 * scaleX, 190 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "42/43":
              ctx.drawImage(trabajoImg, 200 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "22/23":
              ctx.drawImage(trabajoImg, 700 * scaleX, 190 * scaleY, 35 * scaleX, 35 * scaleY);
              ctx.drawImage(trabajoImg, 200 * scaleX, 280 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "44/45":
              ctx.drawImage(trabajoImg, 275 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "24/25":
              ctx.drawImage(trabajoImg, 375 * scaleX, 280 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "46/47":
              ctx.drawImage(trabajoImg, 450 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "26/27":
              ctx.drawImage(trabajoImg, 500 * scaleX, 280 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "48/49":
              ctx.drawImage(trabajoImg, 650 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "28/29":
              ctx.drawImage(trabajoImg, 625 * scaleX, 290 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "60/61":
              ctx.drawImage(trabajoImg, 775 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "50/51":
              ctx.drawImage(trabajoImg, 350 * scaleX, 480 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "52/53":
              ctx.drawImage(trabajoImg, 550 * scaleX, 480 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "Dep. Victoria":
              ctx.drawImage(trabajoImg, 450 * scaleX, 250 * scaleY, 50* scaleX, 50 * scaleY);
              break;
            case "Dep. Suárez":
              ctx.drawImage(trabajoImg, 850 * scaleX, 395 * scaleY, 50* scaleX, 50 * scaleY);
              break;
              case "Vía Puerto":
              ctx.drawImage(trabajoImg, 80 * scaleX, 200 * scaleY, 50* scaleX, 50 * scaleY);
              break;
              case "Todas las Plataformas":
                ctx.drawImage(trabajoImg2, 0 * scaleX, 130 * scaleY, 75* scaleX, 75 * scaleY);
                break;
            default:
              break;
          }
        });
      });
    };
    image.onload = () => {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    };

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [trabajos]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
  
    if (value === "Todas las Plataformas") {
      if (checked) {
        // Selecciona todas las secciones
        setSecciones([...secciones, "1", "2", "3", "4", "5", "6", "7", "8"]);
      } else {
        // Desmarca todas las secciones
        setSecciones(secciones.filter(sec => sec !== "Todas las Plataformas" && !["1", "2", "3", "4", "5", "6", "7", "8"].includes(sec)));
      }
    } else {
      setSecciones((prevSecciones) =>
        checked ? [...prevSecciones, value] : prevSecciones.filter((sec) => sec !== value)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (secciones.length === 0 || !horaInicio || !responsable) {
      Swal.fire('Error', 'Por favor complete todos los campos', 'error');
      return;
    }

    const conflictingJobs = trabajos.filter(trabajo =>
      trabajo.secciones.some(sec => secciones.includes(sec))
    );

    if (conflictingJobs.length > 0) {
      await Swal.fire('Alerta', 'Hay trabajos en las mismas secciones', 'warning');
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "trabajos", editId), {
          secciones,
          horaInicio,
          responsable,
        });
        setEditId(null);
      } else {
        await addDoc(collection(db, "trabajos"), {
          secciones,
          horaInicio,
          responsable,
        });
      }
      setSecciones([]);
      setHoraInicio('');
      setResponsable('');
      Swal.fire('Éxito', 'Trabajo guardado con éxito', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar el trabajo', 'error');
    }
  };

  const handleEdit = (trabajo) => {
    setSecciones(trabajo.secciones);
    setHoraInicio(trabajo.horaInicio);
    setResponsable(trabajo.responsable);
    setEditId(trabajo.id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, bórralo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "trabajos", id));
      Swal.fire('Borrado', 'La vía se encuentra expedita', 'success');
    }
  };
  const getConflictingSections = () => {
    const sectionMap = {}; // Mapea secciones a arrays de IDs de trabajos
  
    trabajos.forEach(trabajo => {
      trabajo.secciones.forEach(seccion => {
        if (!sectionMap[seccion]) {
          sectionMap[seccion] = [];
        }
        sectionMap[seccion].push(trabajo.id);
      });
    });
  
    // Filtra secciones que tienen más de un trabajo asociado
    const conflictingSections = Object.keys(sectionMap).filter(seccion => sectionMap[seccion].length > 1);
  
    // Devuelve un objeto que mapea cada sección conflictiva a los IDs de los trabajos
    return conflictingSections.reduce((result, seccion) => {
      result[seccion] = sectionMap[seccion];
      return result;
    }, {});
  };
  
  const conflictingSections = getConflictingSections();
  


  return (
    <div>
      <h1>Corte de Secciones</h1>
      <Form onSubmit={handleSubmit}>
      <Row>
          
        <Form.Group>
          <legend>Seleccione las secciones</legend>
          <Row className="d-flex justify-content-start">
          <Col>
  <Card style={{ width: '18rem' }} bg='info' border='dark' className=" mb-3">
    <Card.Header border='dark' as="h3">Retiro</Card.Header>
    <Card.Body>
      <Form.Group>
        {[1, 2, 3, 4, 5, 6, 7, 8, "Todas las Plataformas", "Vía Puerto"].map(sec => (
          <Form.Check
            key={sec}
            type="switch"
            id={`switch-${sec}`}
            label={sec}
            value={sec}
            onChange={handleCheckboxChange}
            checked={secciones.includes(`${sec}`)}
            className="mb-2"
          />
        ))}
      </Form.Group>
    </Card.Body>
  </Card>
</Col>
<Col>
  <Card bg='info' className="mb-3">
    <Card.Header as="h3">BP-CP</Card.Header>
    <Card.Body>
      <Form.Group>
        {["12/16", "13/17", "40/41", "42/43", "44/45", "46/47", "48/49", "60/61", "50/51", "52/53", "Dep. Suárez"].map(sec => (
          <Form.Check
            key={sec}
            type="switch"
            id={`switch-${sec.replace(/\//g, '')}`}
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
</Col>

<Col>
  <Card bg='info' className="mb-3">
    <Card.Header as="h3">AP</Card.Header>
    <Card.Body>
      <Form.Group>
        {["10/14", "11/15", "18/19", "20/21", "22/23", "24/25", "26/27", "28/29", "Dep. Victoria"].map(sec => (
          <Form.Check
            key={sec}
            type="switch"
            id={`switch-${sec.replace(/\//g, '')}`}
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
</Col>
            
            </Row>
        </Form.Group>
        <Row>
          <Col>
        <Form.Group>
          <legend>Ingrese Hora de Inicio</legend>
          <Form.Group Id='fromhoraInicio'>
            <Form.Label htmlFor="horaInicio">Hora de Inicio:</Form.Label>
            <Form.Control
              type="time"
              id="horaInicio"
              name="horaInicio"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              />
          </Form.Group>
        </Form.Group>
              </Col>
              <Col>
        <Form.Group>
          <legend>Ingrese Responsable</legend>
          <Form.Group Id= "fromresponsable">
            <Form.Label htmlFor="responsable">Responsable:</Form.Label>
            <Form.Control
              type="text"
              id="responsable"
              name="responsable"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              />
          </Form.Group>
        </Form.Group>
              </Col>
              </Row> 
        <Button type="submit" className="btn btn-success mt-3">Responsable</Button>
        </Row>
      </Form>

      <Table striped bordered hover responsive className="mt-4">
  <thead>
    <tr>
      <th>Secciones</th>
      <th>Hora de Inicio</th>
      <th>Responsable</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {trabajos.map(trabajo => {
      const isConflicting = trabajo.secciones.some(sec => conflictingSections[sec]);
      return (
        <tr key={trabajo.id} className={isConflicting ? 'table-danger' : ''}>
          <td>{trabajo.secciones.join(', ')}</td>
          <td>{trabajo.horaInicio}</td>
          <td>{trabajo.responsable}</td>
          <td>
                  <Button variant="warning" onClick={() => handleEdit(trabajo)}><i className="fas fa-edit"></i></Button>
                  <Button variant="danger" onClick={() => handleDelete(trabajo.id)}><i className="fas fa-trash-alt"></i></Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div ref={containerRef} style={{ width: '100%', maxWidth: '100vw', margin: '0 auto' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
};
