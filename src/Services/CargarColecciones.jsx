import React, { useState, useRef, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase'; 
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Card, Button, Form, ProgressBar, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFileExcel, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

export const CargarColecciones = () => {
    const [archivos, setArchivos] = useState([]);
    const [coleccionDestino, setColeccionDestino] = useState('Peditinas');
    const [progreso, setProgreso] = useState(0);
    const [pendientes, setPendientes] = useState(0);
    const dropRef = useRef(null);
    const storage = getStorage();

    // 1. Cargar cantidad de registros pendientes en la App (los que no fueron a BQ aún)
    useEffect(() => {
        const checkPendientes = async () => {
            const q = query(collection(db, 'Peditinas'), where('exportado', '==', false));
            const snapshot = await getDocs(q);
            setPendientes(snapshot.size);
        };
        checkPendientes();
    }, []);

    const filtrarArchivos = (files) => {
        const validos = files.filter(f => 
            f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || f.name.endsWith('.csv')
        );
        if (validos.length !== files.length) {
            Swal.fire('Atención', 'Para actualizar la base GE, por favor subí el archivo Excel (.xlsx)', 'warning');
        }
        setArchivos(validos);
    };

    // Funciones auxiliares para formato GE
    const formatearFechaGE = (fechaISO) => {
        const [year, month, day] = fechaISO.split('-');
        return `${day}/${month}/${year}`;
    };

    const obtenerMesGE = (fechaISO) => {
        const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const fecha = new Date(fechaISO + "T12:00:00");
        return `${meses[fecha.getMonth()]}-${fecha.getFullYear()}`;
    };

    const procesarYSubir = async () => {
        if (archivos.length === 0) return Swal.fire('Error', 'Primero arrastrá el archivo Excel de la R:', 'error');

        const file = archivos[0];
        const reader = new FileReader();

        Swal.fire({ title: 'Procesando Base GE...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Determinamos qué hoja usar basado en el nombre del archivo
                const esTigre = file.name.toLowerCase().includes('tigre');
                const nombreHoja = esTigre ? "Base de datos Tigre" : "Base de datos Suarez";
                
                if (!workbook.SheetNames.includes(nombreHoja)) {
                    throw new Error(`No se encontró la hoja "${nombreHoja}" en el Excel.`);
                }

                // Obtener pendientes de Firestore
                const q = query(collection(db, 'Peditinas'), where('exportado', '==', false));
                const snapshot = await getDocs(q);
                const registrosNuevos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Mapear al formato exacto de tu Excel
                const filasNuevas = registrosNuevos.map(reg => ({
                    "Fecha": formatearFechaGE(reg.fecha),
                    "N° de Tren": reg.tren,
                    "Equipo": reg.equipo,
                    "Ubicación": reg.ubicacion,
                    "Horario": reg.hora,
                    "Operador": reg.operador,
                    "Mes": obtenerMesGE(reg.fecha)
                }));

                // Unir datos: Originales + Nuevos
                const hojaExistente = workbook.Sheets[nombreHoja];
                const datosOriginales = XLSX.utils.sheet_to_json(hojaExistente);
                const baseActualizada = [...datosOriginales, ...filasNuevas];

                // Crear nueva hoja y actualizar workbook
                const nuevaHoja = XLSX.utils.json_to_sheet(baseActualizada);
                workbook.Sheets[nombreHoja] = nuevaHoja;

                // Generar el nuevo archivo (Buffer)
                const excelFinal = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
                const blob = new Blob([excelFinal], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // SUBIDA A FIREBASE STORAGE (Para BigQuery)
                const path = `Importaciones_BQ/${coleccionDestino}/${new Date().getTime()}_${file.name}`;
                const storageRef = ref(storage, path);
                const uploadTask = uploadBytesResumable(storageRef, blob);

                uploadTask.on('state_changed', 
                    (snap) => setProgreso((snap.bytesTransferred / snap.totalBytes) * 100),
                    (err) => { throw err },
                    async () => {
                        // Marcar como exportados en Firestore para no duplicar mañana
                        const batch = writeBatch(db);
                        snapshot.docs.forEach(d => batch.update(doc(db, "Peditinas", d.id), { exportado: true }));
                        await batch.commit();

                        // Ofrecer descarga para guardar en R:\
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `ACTUALIZADO_${file.name}`;
                        a.click();

                        Swal.fire('¡Éxito!', 'Base actualizada. Se descargó la copia para la carpeta R: y se envió a BigQuery.', 'success');
                        setArchivos([]);
                        setPendientes(0);
                        setProgreso(0);
                    }
                );
            } catch (error) {
                Swal.fire('Error de Formato', error.message, 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <Card className="p-4 shadow-sm mx-auto border-primary" style={{ maxWidth: '700px', marginTop: '20px' }}>
            <div className="text-center mb-4">
                <h4 className="text-primary font-weight-bold">Sincronizador Base de Datos GE</h4>
                <p className="text-muted small">Proyecto Cloud: <strong>pctmitre</strong></p>
            </div>

            <Row className="mb-4">
                <Col className="text-center">
                    <div className="p-3 bg-light border rounded">
                        <h6 className="mb-1 text-danger">Pendientes en App</h6>
                        <h3 className="mb-0">{pendientes}</h3>
                        <small className="text-muted">Modulaciones listas para inyectar</small>
                    </div>
                </Col>
            </Row>

            <div 
                ref={dropRef}
                onDragOver={(e) => { e.preventDefault(); dropRef.current.style.backgroundColor = '#f8f9fa'; }}
                onDragLeave={(e) => { e.preventDefault(); dropRef.current.style.backgroundColor = 'white'; }}
                onDrop={(e) => { e.preventDefault(); filtrarArchivos(Array.from(e.dataTransfer.files)); }}
                style={{ border: '2px dashed #007bff', borderRadius: '15px', padding: '50px', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" className="text-primary mb-3" />
                <h5>Arrastrá el Excel de la R: aquí</h5>
                <p className="text-muted">Se detectará automáticamente si es Tigre o Suarez</p>
                <input type="file" id="fileInput" hidden onChange={(e) => filtrarArchivos(Array.from(e.target.files))} accept=".xlsx" />
            </div>

            {archivos.length > 1 && (
                <div className="mt-4 p-3 border rounded border-success shadow-sm">
                    <div className="d-flex align-items-center mb-3">
                        <FontAwesomeIcon icon={faFileExcel} size="2x" className="text-success me-3" />
                        <div>
                            <p className="mb-0 fw-bold">{archivos[0].name}</p>
                            <small className="text-muted">Listo para fusionar con {pendientes} registros nuevos</small>
                        </div>
                    </div>
                    
                    {progreso > 0 && <ProgressBar animated now={progreso} label={`${Math.round(progreso)}%`} className="mb-3" />}

                    <Button variant="success" className="w-100 fw-bold py-3" onClick={procesarYSubir}>
                        <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
                        ACTUALIZAR EXCEL Y ENVIAR A BIGQUERY
                    </Button>
                </div>
            )}
        </Card>
    );
};