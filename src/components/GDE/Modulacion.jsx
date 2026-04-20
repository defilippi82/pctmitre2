import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, writeBatch, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase'; 
import { UserContext } from '../../Services/UserContext';
import { Form, Table, Button, Row, Col, Container, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { faTrash, faEdit, faUser, faFileExcel, faCloudUploadAlt, faSearch, faHistory } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as XLSX from 'xlsx'; // Usamos XLSX para descargar Excel real

// Importamos la lista de operadores que creamos aparte
import { listaOperadores } from './Operadores'; 

const MySwal = withReactContent(Swal);

export const Modulacion = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [registros, setRegistros] = useState([]); 
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]); 
  
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
  
  // Estados para los campos del buscador de la tabla activa
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroOperador, setFiltroOperador] = useState('');
  const [filtroLinea, setFiltroLinea] = useState('');

  // Estados para la Exportación Histórica Mensual
  const [histLinea, setHistLinea] = useState('');
  const [histMes, setHistMes] = useState('');
  const [histAnio, setHistAnio] = useState(new Date().getFullYear().toString());

  // Función auxiliar para generar el formato 'abril-2026'
  const obtenerNombreMes = (fechaISO) => {
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const [year, month] = fechaISO.split('-');
    return `${meses[parseInt(month, 10) - 1]}-${year}`;
  };

  const fetchModulaciones = async () => {
    try {
      const q = query(collection(db, 'Modulaciones'), where('exportado', '==', false), orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setRegistros(data);
      setResultadosBusqueda(data); 
    } catch (error) {
      console.error("Error al obtener Modulaciones: ", error);
      MySwal.fire('Error', 'No se pudieron cargar los registros.', 'error');
    }
  };

  useEffect(() => {
    fetchModulaciones();
  }, []);

  const ejecutarBusqueda = () => {
    const filtrados = registros.filter(reg => {
      const coincideFecha = filtroFecha ? reg.fecha === filtroFecha : true;
      const coincideOperador = filtroOperador ? reg.operador.toLowerCase().includes(filtroOperador.toLowerCase()) : true;
      const coincideLinea = filtroLinea ? reg.linea === filtroLinea : true;
      return coincideFecha && coincideOperador && coincideLinea;
    });
    setResultadosBusqueda(filtrados);
  };

  const exportarABigQuery = async () => {
    if (registros.length === 0) {
      return MySwal.fire('Atención', 'No hay registros pendientes de cierre.', 'info');
    }

    MySwal.fire({
      title: '¿Confirmar Cierre de Lote?',
      text: `Se marcarán ${registros.length} registros como exportados para ser leídos por Looker Studio.`,
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
          MySwal.fire('¡Éxito!', 'Los datos se cerraron correctamente.', 'success');
          fetchModulaciones(); 
        } catch (error) {
          MySwal.fire('Error', 'Hubo un fallo en la comunicación con Firebase.', 'error');
        }
      }
    });
  };

  // NUEVA FUNCIÓN: Descargar Excel Histórico por Mes y Línea
  const descargarExcelHistorico = async () => {
    if (!histLinea || !histMes || !histAnio) {
      return MySwal.fire('Atención', 'Debe seleccionar Línea, Mes y Año para exportar.', 'warning');
    }

    const mesFiltro = `${histMes}-${histAnio}`; // Ej: 'abril-2026'

    try {
      MySwal.fire({ title: 'Generando Excel...', allowOutsideClick: false, didOpen: () => MySwal.showLoading() });

      // Buscamos TODOS los registros de ese mes y línea (exportados o no)
      const q = query(
        collection(db, 'Modulaciones'),
        where('linea', '==', histLinea),
        where('mes', '==', mesFiltro)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return MySwal.fire('Sin resultados', `No se encontraron modulaciones en ${histLinea} para ${mesFiltro}.`, 'info');
      }

      const datos = querySnapshot.docs.map(doc => doc.data());

      // Mapeamos al formato exacto del Excel de la red interna
      const filasExcel = datos.map(reg => ({
        "Fecha": reg.fecha.split('-').reverse().join('/'), // Convierte 2026-04-12 a 12/04/2026
        "N° de Tren": reg.tren,
        "Equipo": reg.equipo,
        "Ubicación": reg.ubicacion,
        "Horario": reg.hora + ':00',
        "Operador": reg.operador,
        "Mes": reg.mes
      }));

      // Creamos y descargamos el archivo Excel
      const worksheet = XLSX.utils.json_to_sheet(filasExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, `Base de datos ${histLinea}`);
      XLSX.writeFile(workbook, `Modulaciones_${histLinea}_${mesFiltro}.xlsx`);

      MySwal.close();
    } catch (error) {
      console.error(error);
      MySwal.fire('Error', 'Hubo un problema al generar el archivo.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Agregamos automáticamente la columna "mes" al guardar
      const registroFinal = {
        ...nuevoRegistro,
        mes: obtenerNombreMes(nuevoRegistro.fecha),
        exportado: false
      };

      await addDoc(collection(db, 'Modulaciones'), registroFinal);
      MySwal.fire({ title: 'Guardado', icon: 'success', timer: 800, showConfirmButton: false });
      
      // Limpiamos tren/equipo/ubicacion/hora, mantenemos fecha, línea y operador
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
      
      {/* 1. FORMULARIO DE CARGA */}
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
                <Form.Control 
                  list="lista-operadores"
                  type="text" 
                  name="operador" 
                  value={nuevoRegistro.operador} 
                  onChange={handleChange} 
                  required 
                  placeholder="Escribí para buscar..." 
                  className="border-primary fw-bold" 
                  autoComplete="off"
                />
                {/* Datalist enlazado al input para autocompletado */}
                <datalist id="lista-operadores">
                  {listaOperadores.map((op, index) => (
                    <option key={index} value={op} />
                  ))}
                </datalist>
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
      
      {/* 2. BOTÓN EXPORTACIÓN A BIGQUERY (CIERRE DIARIO) */}
      <Card className="p-4 mb-4 shadow-sm border-success bg-white">
          <Row className="align-items-center">
            <Col md={8}>
              <h4 className="text-success mb-0">Pendientes de Cierre</h4>
              <p className="text-muted mb-0">Hay {registros.length} registros que aún no se han enviado a BigQuery/Looker.</p>
            </Col>
            <Col md={4} className="text-end">
                <Button variant="success" size="lg" onClick={exportarABigQuery} className="fw-bold shadow">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" />
                  CERRAR Y ENVIAR
                </Button>
            </Col>
          </Row>
      </Card>

      {/* 3. BUSCADOR EN TABLA ACTIVA */}
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
            <Col md={3}>
                <Form.Label className="small fw-bold text-info">Operador:</Form.Label>
                <Form.Control size="sm" type="text" value={filtroOperador} onChange={(e) => setFiltroOperador(e.target.value)} placeholder="Buscar..." />
            </Col>
            <Col md={3}>
                <Form.Label className="small fw-bold text-info">Fecha:</Form.Label>
                <Form.Control size="sm" type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
            </Col>
            <Col md={3}>
                <Button variant="info" size="sm" className="w-100 text-white fw-bold" onClick={ejecutarBusqueda}>
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  BUSCAR EN TABLA
                </Button>
            </Col>
          </Row>
      </Card>

      {/* 4. TABLA DE MODULACIONES ACTIVAS */}
      <Table responsive striped bordered hover className="shadow-sm border-danger mb-5">
        <thead className="table-dark text-center">
          <tr>
            <th>Línea</th><th>Fecha</th><th>Tren</th><th>Ubicación</th><th>Hora</th><th>Operador</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody className="text-center align-middle">
          {resultadosBusqueda.map((reg) => (
            <tr key={reg.id}>
              <td><span className={`badge ${reg.linea === 'Suárez' ? 'bg-primary' : 'bg-success'}`}>{reg.linea}</span></td>
              <td>{reg.fecha.split('-').reverse().join('/')}</td>
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

      {/* 5. NUEVA SECCIÓN: ARCHIVO HISTÓRICO (EXCEL PARA GDE) */}
      <Card className="p-4 shadow-sm mb-5 border-secondary bg-white">
        <h4 className="text-secondary mb-3 border-bottom pb-2">
          <FontAwesomeIcon icon={faHistory} className="me-2" />
          Descargar Archivo Histórico Mensual
        </h4>
        <p className="text-muted small mb-3">Seleccioná los parámetros para generar el Excel estructurado de meses anteriores.</p>
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Línea</Form.Label>
              <Form.Select value={histLinea} onChange={(e) => setHistLinea(e.target.value)}>
                <option value="">Seleccionar...</option>
                <option value="Suárez">Suárez</option>
                <option value="Tigre">Tigre</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-bold">Mes</Form.Label>
              <Form.Select value={histMes} onChange={(e) => setHistMes(e.target.value)}>
                <option value="">Seleccionar...</option>
                <option value="enero">Enero</option>
                <option value="febrero">Febrero</option>
                <option value="marzo">Marzo</option>
                <option value="abril">Abril</option>
                <option value="mayo">Mayo</option>
                <option value="junio">Junio</option>
                <option value="julio">Julio</option>
                <option value="agosto">Agosto</option>
                <option value="septiembre">Septiembre</option>
                <option value="octubre">Octubre</option>
                <option value="noviembre">Noviembre</option>
                <option value="diciembre">Diciembre</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label className="fw-bold">Año</Form.Label>
              <Form.Control type="number" value={histAnio} onChange={(e) => setHistAnio(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button variant="outline-dark" className="w-100 fw-bold shadow-sm" onClick={descargarExcelHistorico}>
              <FontAwesomeIcon icon={faFileExcel} className="me-2 text-success" />
              GENERAR EXCEL MENSUAL
            </Button>
          </Col>
        </Row>
      </Card>

    </Container>
  );
};