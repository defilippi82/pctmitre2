import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, writeBatch, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase'; 
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faTrash, faEdit, faUser, faFileCsv, faCloudUploadAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MySwal = withReactContent(Swal);

// Nombre actualizado a Modulacion
export const Modulacion = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState([]); // Base de datos local (pendientes)
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]); // Lo que se ve efectivamente en la tabla
  
  const hoy = new Date().toISOString().split('T')[0];
  
  const [nuevoRegistro, setNuevoRegistro] = useState({
    fecha: hoy,
    tren: '',
    equipo: '',
    ubicacion: '',
    hora: '',
    linea: '', 
    operador: '',
    exportado: false 
  });
  
  // Estados para los campos del buscador
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroOperador, setFiltroOperador] = useState('');
  const [filtroLinea, setFiltroLinea] = useState('');

  // 1. Carga inicial de datos desde Firebase (Solo los que no fueron a BigQuery)
  const fetchModulaciones = async () => {
    try {
      const q = query(
        collection(db, 'Modulaciones'), 
        where('exportado', '==', false),
        orderBy('fecha', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setRegistros(data);
      setResultadosBusqueda(data); // Inicialmente mostramos todo lo pendiente
    } catch (error) {
      console.error("Error al obtener Modulaciones: ", error);
      MySwal.fire('Error', 'No se pudieron cargar los registros.', 'error');
    }
  };

  useEffect(() => {
    fetchModulaciones();
  }, []);

  // 2. Función de búsqueda (Se ejecuta SOLO al hacer click en el botón BUSCAR)
  const ejecutarBusqueda = () => {
    const filtrados = registros.filter(reg => {
      const coincideFecha = filtroFecha ? reg.fecha === filtroFecha : true;
      const coincideOperador = filtroOperador ? reg.operador.toLowerCase().includes(filtroOperador.toLowerCase()) : true;
      const coincideLinea = filtroLinea ? reg.linea === filtroLinea : true;
      return coincideFecha && coincideOperador && coincideLinea;
    });
    setResultadosBusqueda(filtrados);
  };

  // 3. Exportar CSV (Usa los resultados filtrados que están en pantalla)
  const exportarCSV = () => {
    if (resultadosBusqueda.length === 0) {
      return MySwal.fire('Sin datos', 'No hay registros en la tabla para exportar', 'info');
    }

    const headers = ["Linea", "Fecha", "Tren", "Equipo", "Ubicacion", "Hora", "Operador"];
    const rows = resultadosBusqueda.map(reg => [
      reg.linea, reg.fecha, reg.tren, reg.equipo, reg.ubicacion, reg.hora, reg.operador
    ]);

    const csvContent = [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Modulaciones_Export_${hoy}.csv`);
    link.click();
  };

  // 4. Exportación Masiva a BigQuery (Cierre de Lote)
  const exportarABigQuery = async () => {
    if (registros.length === 0) {
      MySwal.fire('Atención', 'No hay registros pendientes de cierre.', 'info');
      return;
    }

    MySwal.fire({
      title: '¿Confirmar Exportación Masiva?',
      text: `Se marcarán ${registros.length} registros como exportados. La extensión los moverá a BigQuery automáticamente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      confirmButtonText: 'Sí, cerrar y exportar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          MySwal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => MySwal.showLoading() });
          
          const batch = writeBatch(db);
          registros.forEach((reg) => {
            const docRef = doc(db, "Modulaciones", reg.id);
            batch.update(docRef, { exportado: true });
          });
          
          await batch.commit();
          MySwal.fire('¡Éxito!', 'Los datos se han enviado a BigQuery. La tabla se ha limpiado.', 'success');
          fetchModulaciones(); // Recargamos (traerá 0 si todo se exportó)
        } catch (error) {
          MySwal.fire('Error', 'Hubo un fallo en la comunicación con Firebase.', 'error');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Modulaciones'), { ...nuevoRegistro, exportado: false });
      MySwal.fire({ title: 'Guardado', icon: 'success', timer: 800, showConfirmButton: false });
      // Limpiamos campos de tren pero mantenemos operador y línea para rapidez
      setNuevoRegistro(prev => ({ ...prev, tren: '', equipo: '', ubicacion: '', hora: '' }));
      fetchModulaciones();
    } catch (error) {
      MySwal.fire('Error', 'No se pudo guardar la modulación.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro(prev => ({ ...prev, [name]: value }));
  };

  const eliminarRegistro = async (id) => {
    const result = await MySwal.fire({ title: '¿Borrar registro?', icon: 'warning', showCancelButton: true });
    if (result.isConfirmed) {
      await deleteDoc(doc(db, "Modulaciones", id));
      fetchModulaciones();
    }
  };

  return (
    <Container className="mt-5" style={{paddingTop: '30px'}}>
      
      {/* FORMULARIO DE CARGA */}
      <Card className="p-4 shadow-sm mb-4 border-left-danger">
        <h2 className="text-danger mb-4 border-bottom pb-2">Carga de Modulaciones</h2>
        <Form onSubmit={handleSubmit}>
          <Row className="bg-light p-3 rounded mb-3 border">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Línea</Form.Label>
                <Form.Select name="linea" value={nuevoRegistro.linea} onChange={handleChange} required className="border-primary fw-bold">
                    <option value="">-- SELECCIONAR --</option>
                    <option value="Suárez">SUÁREZ</option>
                    <option value="Tigre">TIGRE</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold"><FontAwesomeIcon icon={faUser} /> Operador</Form.Label>
                <Form.Control type="text" name="operador" value={nuevoRegistro.operador} onChange={handleChange} required placeholder="Nombre..." className="border-primary fw-bold" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-bold">Fecha de Carga</Form.Label>
                <Form.Control type="date" name="fecha" value={nuevoRegistro.fecha} onChange={handleChange} required />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={2}><Form.Group className="mb-3"><Form.Label>N° Tren</Form.Label><Form.Control type="text" name="tren" value={nuevoRegistro.tren} onChange={handleChange} required /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3"><Form.Label>Equipo / Loc.</Form.Label><Form.Control type="text" name="equipo" value={nuevoRegistro.equipo} onChange={handleChange} /></Form.Group></Col>
            <Col md={4}><Form.Group className="mb-3"><Form.Label>Ubicación</Form.Label><Form.Control type="text" name="ubicacion" value={nuevoRegistro.ubicacion} onChange={handleChange} /></Form.Group></Col>
            <Col md={3}><Form.Group className="mb-3"><Form.Label>Hora</Form.Label><Form.Control type="time" name="hora" value={nuevoRegistro.hora} onChange={handleChange} required /></Form.Group></Col>
          </Row>

          <Button variant="danger" type="submit" className="w-100 fw-bold py-2 shadow-sm">
            REGISTRAR TREN
          </Button>
        </Form>
      </Card>
      
      {/* BOTÓN EXPORTACIÓN A BIGQUERY (CIERRE) */}
      <Card className="p-4 mb-4 shadow-sm border-success bg-white">
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="text-success mb-0">Pendientes de Cierre</h4>
              <p className="text-muted mb-0">Hay {registros.length} registros que aún no se han enviado a BigQuery.</p>
            </Col>
            <Col md={4} className="text-end">
                <Button variant="success" size="lg" onClick={exportarABigQuery} className="fw-bold shadow">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" />
                  CERRAR Y ENVIAR A BQ
                </Button>
            </Col>
          </Row>
      </Card>

      {/* BUSCADOR Y FILTROS */}
      <Card className="p-3 mb-4 bg-light shadow-sm border-info">
          <Row className="align-items-end">
            <Col md={3}>
                <Form.Label className="small fw-bold text-info">Filtrar Línea:</Form.Label>
                <Form.Select size="sm" value={filtroLinea} onChange={(e) => setFiltroLinea(e.target.value)}>
                    <option value="">TODAS</option>
                    <option value="Suárez">Suárez</option>
                    <option value="Tigre">Tigre</option>
                </Form.Select>
            </Col>
            <Col md={2}>
                <Form.Label className="small fw-bold text-info">Operador:</Form.Label>
                <Form.Control size="sm" type="text" value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)} placeholder="Buscar..." />
            </Col>
            <Col md={2}>
                <Form.Label className="small fw-bold text-info">Fecha:</Form.Label>
                <Form.Control size="sm" type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
            </Col>
            <Col md={3}>
                <Button variant="info" size="sm" className="w-100 text-white fw-bold" onClick={ejecutarBusqueda}>
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  BUSCAR EN TABLA
                </Button>
            </Col>
            <Col md={2}>
                <Button variant="outline-success" size="sm" className="w-100 fw-bold" onClick={exportarCSV}>
                  <FontAwesomeIcon icon={faFileCsv} className="me-2" />
                  EXPORTAR CSV
                </Button>
            </Col>
          </Row>
      </Card>

      {/* TABLA DE MODULACIONES */}
      <Table responsive striped bordered hover className="shadow-sm border-danger">
        <thead className="table-dark text-center">
          <tr>
            <th>Línea</th><th>Fecha</th><th>Tren</th><th>Ubicación</th><th>Hora</th><th>Operador</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {resultadosBusqueda.map((reg) => (
            <tr key={reg.id}>
              <td><span className={`badge ${reg.linea === 'Suárez' ? 'bg-primary' : 'bg-success'}`}>{reg.linea}</span></td>
              <td>{reg.fecha}</td>
              <td className="fw-bold text-danger">{reg.tren}</td>
              <td>{reg.ubicacion}</td>
              <td>{reg.hora} hs</td>
              <td><small className="text-muted">{reg.operador}</small></td>
              <td>
                <Button variant="link" className="text-primary p-0 me-2" onClick={() => navigate(`/peditina/edit/${reg.id}`)}><FontAwesomeIcon icon={faEdit} /></Button>
                <Button variant="link" className="text-danger p-0" onClick={() => eliminarRegistro(reg.id)}><FontAwesomeIcon icon={faTrash} /></Button>
              </td>
            </tr>
          ))}
          {resultadosBusqueda.length === 0 && (
            <tr><td colSpan="7" className="text-center p-4 text-muted">No hay modulaciones pendientes con esos criterios.</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};