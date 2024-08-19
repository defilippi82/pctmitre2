import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebaseConfig/firebase'; // Asegúrate de configurar Firebase
import { collection, addDoc, onSnapshot, query, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { Form, Table, Button,Row, Col,FloatingLabel, Card} from 'react-bootstrap';
import Swal from 'sweetalert2';


export const Precauciones = () => {
  const [secciones, setSecciones] = useState([]);
  const [horaInicio, setHoraInicio] = useState('');
  const [senales, setSenales] = useState('');
  const [adv, setAdv] = useState("");
  const [barreras, setBarreras] = useState("");
  const [precauciones, setPrecauciones] = useState([]);
  const [editId, setEditId] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const senalImg = new Image();
  senalImg.src = '/senal.png'; // Cambia esta ruta a la imagen que deseas usar para representar los trabajos
  const advImg = new Image();
  advImg.src = '/adv.png';

  useEffect(() => {
    const q = query(collection(db, "precauciones"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const precaucionesData = [];
      querySnapshot.forEach((doc) => {
        precaucionesData.push({ id: doc.id, ...doc.data() });
      });
      setPrecauciones(precaucionesData);
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

      // Renderizar las precauciones sobre la imagen
      precauciones.forEach(precaucion => {
          // Ajusta las coordenadas proporcionalmente
          const secciones = precaucion.secciones;
          secciones.forEach(seccion => {
          const scaleX = canvas.width / 900;
          const scaleY = canvas.height / 600;
          switch (seccion) {
            case "8":
              ctx.drawImage(senalImg, 0 * scaleX, 120 * scaleY ,25 * scaleX, 25 * scaleY);
              break;
            case "7":
              ctx.drawImage(senalImg, 0 * scaleX, 130 * scaleY ,25 * scaleX, 25 * scaleY);
              break;
            case "6":
              ctx.drawImage(senalImg, 0 * scaleX, 140 * scaleY ,25 * scaleX, 25 * scaleY);
              break;
            case "5":
              ctx.drawImage(senalImg, 0 * scaleX, 150 * scaleY, 25 * scaleX, 25 * scaleY);
              break;
            case "4":
              ctx.drawImage(senalImg, 0 * scaleX, 170 * scaleY, 25 * scaleX, 25 * scaleY);
              break;
            case "3":
              ctx.drawImage(senalImg, 0 * scaleX, 180 * scaleY, 25 * scaleX, 25 * scaleY);
              break;
            case "2":
              ctx.drawImage(senalImg, 0 * scaleX, 190 * scaleY, 25* scaleX, 25 * scaleY);
              break;
            case "1":
              ctx.drawImage(senalImg, 0 * scaleX, 200 * scaleY, 25* scaleX, 25 * scaleY);
              break;
            case "10/14":
              ctx.drawImage(senalImg, 190 * scaleX, 190 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "11/15":
              ctx.drawImage(senalImg, 190 * scaleX, 180 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "13/17":
              ctx.drawImage(senalImg, 190 * scaleX, 160 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "12/16":
              ctx.drawImage(senalImg, 180 * scaleX, 170 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "18/19":
              ctx.drawImage(senalImg, 280 * scaleX, 190 * scaleY, 35 * scaleX, 35 * scaleY);
              break;
            case "40/41":
              ctx.drawImage(senalImg, 265 * scaleX, 160 * scaleY, 35* scaleX, 35 * scaleY);
              ctx.drawImage(senalImg, 50 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "20/21":
              ctx.drawImage(senalImg, 550 * scaleX, 190 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "42/43":
              ctx.drawImage(senalImg, 200 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "22/23":
              ctx.drawImage(senalImg, 700 * scaleX, 190 * scaleY, 35 * scaleX, 35 * scaleY);
              ctx.drawImage(senalImg, 200 * scaleX, 280 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "44/45":
              ctx.drawImage(senalImg, 275 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "24/25":
              ctx.drawImage(senalImg, 375 * scaleX, 280 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "46/47":
              ctx.drawImage(senalImg, 450 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "26/27":
              ctx.drawImage(senalImg, 500 * scaleX, 280 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "48/49":
              ctx.drawImage(senalImg, 650 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "28/29":
              ctx.drawImage(senalImg, 625 * scaleX, 290 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "60/61":
              ctx.drawImage(senalImg, 775 * scaleX, 390 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "50/51":
              ctx.drawImage(senalImg, 350 * scaleX, 480 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "52/53":
              ctx.drawImage(senalImg, 550 * scaleX, 480 * scaleY, 35* scaleX, 35 * scaleY);
              break;
            case "Dep. Victoria":
              ctx.drawImage(senalImg, 450 * scaleX, 250 * scaleY, 50* scaleX, 50 * scaleY);
              break;
            case "Dep. Suárez":
              ctx.drawImage(senalImg, 850 * scaleX, 395 * scaleY, 50* scaleX, 50 * scaleY);
              break;
              case "Vía Puerto":
              ctx.drawImage(senalImg, 80 * scaleX, 200 * scaleY, 50* scaleX, 50 * scaleY);
              break;
              case "Todas las Plataformas":
                ctx.drawImage(advImg, 0 * scaleX, 130 * scaleY, 75* scaleX, 75 * scaleY);
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
    setSecciones((prevSecciones) =>
      checked ? [...prevSecciones, value] : prevSecciones.filter((sec) => sec !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (secciones.length === 0 || !horaInicio || !senales) {
      Swal.fire('Error', 'Por favor complete todos los campos', 'error');
      return;
    }

    const conflictingJobs = trabajos.filter(trabajo =>
      trabajo.secciones.some(sec => secciones.includes(sec))
    );

    if (conflictingJobs.length > 0) {
      Swal.fire('Alerta', 'Hay precauciones en las mismas secciones', 'warning');
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "precauciones", editId), {
          secciones,
          horaInicio,
          senales,
          adv,
          barreras,
        });
        setEditId(null);
      } else {
        await addDoc(collection(db, "precauciones"), {
          secciones,
          horaInicio,
          senales,
          adv,
          barreras,
        });
      }
      setSecciones([]);
      setHoraInicio('');
      setsenales('');
      setAdv("");
      setBarreras("");
      Swal.fire('Éxito', 'Precaución guardada con éxito', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo guardar la precaucion', 'error');
    }
  };

  const handleEdit = (precaucion) => {
    setSecciones(precaucion.secciones);
    setHoraInicio(precaucion.horaInicio);
    setsenales(precaucion.senales);
    setAdv(precaucion.adv);
    setBarreras(precaucion.barreras);
    setEditId(precaucion.id);
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
      await deleteDoc(doc(db, "precauciones", id));
      Swal.fire('Borrado', 'La vía se encuentra expedita', 'success');
    }
  };
  const getConflictingSections = () => {
    const sectionCount = {};
    trabajos.forEach(trabajo => {
      trabajo.secciones.forEach(seccion => {
        sectionCount[seccion] = (sectionCount[seccion] || 0) + 1;
      });
    });
    return Object.keys(sectionCount).filter(seccion => sectionCount[seccion] >= 2);
  };

  const conflictingSections = getConflictingSections();


  return (
    <Container>
      <h1>Corte de Secciones</h1>
      <Form onSubmit={handleSubmit}>
      <Row>
          
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
                        <option value="">Seleccione </option>
                        <option value="senales">Señales</option>
                        <option value="adv">ADV</option>
                        <option value="barreras">Barreras</option>
                    </Form.Control>
                </Form.Group>
        <Form.Group>
          <Row className="d-flex justify-content-start">
          <Col>
                {currentView === '1rn' && 'senales' (
  <Card className=" mb-3">
    <Card.Header as="h3">Señales</Card.Header>
    <Card.Body>
      <Form.Group>
        {["M1","S1", "M2","S2", "M3","S3", "M4","S4","M5","S5","M6", "S7","M7","S7","M8","S8","M9","S9", "M10", "S10","M11","S11","M12","S12","M13", 13,"M14",14,"M15",15, "M16",16,"M17", 17, "M18",18, "M19", 19, "M21", 21,"M22",22, "M23","M24",24,"M25",25,"M26",26, "M27",27,"M28",28,"M29",29,"M31",31,"M32",32,"M33",34,"M35","M39",39,"M43",43,"M47",47,54,2,10,54,"C5", "Todas las Plataformas"].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec}`}
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
  )}
</Col>
          <Col>
          {currentView === '1rn' && 'adv' (
            <Card className="mb-3">
              <Card.Header as="h3">ADV</Card.Header>
              <Card.Body>
                <Form.Group>
                  {["6A", "6B", "6B",  "30A", "30B", "34A","34B","25B", "20B", "20A", "20C","19C","19B","19A","8B","8A","10A","10B","12A","12B","14A","14B","16A","16B","18.", "36A","36B","23A","23B","31A","31B","37A","37B","28A","28B","21A","21B","27.","22.","33.","35.","42A","42B", "39A","39B","41A","41B","40A","40B","43.","44.","46.","47A","47B","48A","48B","49."].map(sec => (
                    <Form.Check
                      key={sec}
                      type="checkbox"
                      id={`checkbox-${sec.replace(/\//g, '')}`}
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
          </Col>
<Col>
{currentView === '2rn' && 'adv' (
  <Card className="mb-3">
    <Card.Header as="h3">ADV</Card.Header>
    <Card.Body>
      <Form.Group>
        {["RN Carga"].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec.replace(/\//g, '')}`}
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
</Col>
<Form.Group>
          <Row className="d-flex justify-content-start">
          <Col>
                {currentView === '2rn' && 'senales' (
  <Card className=" mb-3">
    <Card.Header as="h3">Señales</Card.Header>
    <Card.Body>
      <Form.Group>
        {[11,9,6,7].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec}`}
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
  )}
</Col>
<Form.Group>
          <Row className="d-flex justify-content-start">
          <Col>
                {currentView === 'empMaldonado' && 'senales' (
  <Card className=" mb-3">
    <Card.Header as="h3">Señales</Card.Header>
    <Card.Body>
      <Form.Group>
        {["E1","E5","N5","N6","F1","O5","F5","P2/A","P2/B","P6",24,28,25,27,21,5,6,4,7,8,3,1,23,29,"SLA129","A101","A102",].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec}`}
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
  )}
</Col>

<Col>
{currentView === 'empMaldonado' && 'adv' (
  <Card className="mb-3">
    <Card.Header as="h3">ADV</Card.Header>
    <Card.Body>
      <Form.Group>
        {["17a","17b","16b","16a",18,19,15,14,11,12].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec.replace(/\//g, '')}`}
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
</Col>
<Col>
{currentView === 'tf' && 'adv' (
  <Card className="mb-3">
    <Card.Header as="h3">ADV</Card.Header>
    <Card.Body>
      <Form.Group>
        {[].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec.replace(/\//g, '')}`}
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
</Col>
<Form.Group>
          <Row className="d-flex justify-content-start">
          <Col>
                {currentView === 'tf' && 'senales' (
  <Card className=" mb-3">
    <Card.Header as="h3">Señales</Card.Header>
    <Card.Body>
      <Form.Group>
        {[32,19].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec}`}
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
  )}
</Col>

<Col>
  <Card className="mb-3">
    <Card.Header as="h3">AP</Card.Header>
    <Card.Body>
      <Form.Group>
        {["10/14", "11/15", "18/19", "20/21", "22/23", "24/25", "26/27", "28/29", "Dep. Victoria"].map(sec => (
          <Form.Check
            key={sec}
            type="checkbox"
            id={`checkbox-${sec.replace(/\//g, '')}`}
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
          <Form.Group controlId='fromhoraInicio'>
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
          <legend>Ingrese senales</legend>
          <Form.Group controlId= "fromsenales">
            <Form.Label htmlFor="senales">senales:</Form.Label>
            <Form.Control
              type="text"
              id="senales"
              name="senales"
              value={senales}
              onChange={(e) => setsenales(e.target.value)}
              />
          </Form.Group>
        </Form.Group>
              </Col>
              </Row> 
        <Button type="submit" className="btn btn-success mt-3">senales</Button>
        </Row>
      </Form>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Secciones</th>
            <th>Hora de Inicio</th>
            <th>senales</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {trabajos.map((trabajo) => {
            const hasConflict = trabajo.secciones.some(seccion => conflictingSections.includes(seccion));
            return (
              <tr key={trabajo.id} style={hasConflict ? { backgroundColor: 'red', color: 'black' } : {}}>
                <td>{trabajo.secciones.join(", ")}</td>
                <td>{trabajo.horaInicio}</td>
                <td>{trabajo.senales}</td>
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
    </Container>
  );
};
