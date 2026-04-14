import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import { Card, Button, Form, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';

export const CargarColecciones = () => {
    const [archivos, setArchivos] = useState([]);
    const [coleccionDestino, setColeccionDestino] = useState('Peditinas');
    const [progreso, setProgreso] = useState(0);
    const dropRef = useRef(null);
    const storage = getStorage();

    // Manejo del Drag & Drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current.style.backgroundColor = '#e9ecef';
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current.style.backgroundColor = 'white';
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropRef.current.style.backgroundColor = 'white';
        
        const files = Array.from(e.dataTransfer.files);
        filtrarArchivos(files);
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);
        filtrarArchivos(files);
    };

    // Solo permitir PDF y Excel
    const filtrarArchivos = (files) => {
        const validos = files.filter(f => 
            f.type === 'application/pdf' || 
            f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            f.name.endsWith('.csv')
        );
        
        if (validos.length !== files.length) {
            Swal.fire('Aviso', 'Solo se admiten archivos PDF, Excel o CSV.', 'warning');
        }
        setArchivos(prev => [...prev, ...validos]);
    };

    const subirArchivos = async () => {
        if (archivos.length === 0) return Swal.fire('Error', 'Arrastra archivos primero', 'error');

        let subidos = 0;

        for (const file of archivos) {
            // Guardamos en Firebase Storage organizados por Carpeta (Colección) y Fecha
            const path = `Importaciones_BQ/${coleccionDestino}/${new Date().toISOString().split('T')[0]}_${file.name}`;
            const storageRef = ref(storage, path);
            
            const uploadTask = uploadBytesResumable(storageRef, file);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgreso(progress);
                    }, 
                    (error) => reject(error), 
                    () => resolve()
                );
            });
            subidos++;
        }

        Swal.fire('¡Recibido!', `Se enviaron ${subidos} ya se pueden analizar desde Power BI.`, 'success');
        setArchivos([]);
        setProgreso(0);
    };

    return (
        <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: '600px', marginTop: '20px' }}>
            <h4 className="text-primary mb-3">Subida de Documentos a BigQuery</h4>
            
            <Form.Group className="mb-3">
                <Form.Label fw="bold">Destino de los reportes:</Form.Label>
                <Form.Select 
                    value={coleccionDestino} 
                    onChange={(e) => setColeccionDestino(e.target.value)}
                >
                    <option value="Peditinas">Modulaciones (Histórico)</option>
                    <option value="Partes">Partes (P1,P2,P15)</option>
                </Form.Select>
            </Form.Group>

            {/* Zona de Drag & Drop */}
            <div 
                ref={dropRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    border: '2px dashed #0d6efd',
                    borderRadius: '10px',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: '0.3s'
                }}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <FontAwesomeIcon icon={faCloudUploadAlt} size="3x" className="text-primary mb-2" />
                <h5>Arrastra tus archivos aquí</h5>
                <p className="text-muted mb-0">o haz clic para seleccionar (PDF, Excel, CSV)</p>
                <input 
                    type="file" 
                    id="fileInput" 
                    multiple 
                    accept=".pdf, .xlsx, .csv" 
                    style={{ display: 'none' }} 
                    onChange={handleFileInput}
                />
            </div>

            {/* Lista de archivos listos para subir */}
            {archivos.length > 0 && (
                <div className="mt-3">
                    <h6>Archivos preparados:</h6>
                    <ul className="list-unstyled">
                        {archivos.map((f, i) => (
                            <li key={i} className="mb-1 text-secondary">
                                <FontAwesomeIcon icon={f.name.endsWith('.pdf') ? faFilePdf : faFileExcel} className="me-2 text-danger" />
                                {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                            </li>
                        ))}
                    </ul>
                    
                    {progreso > 0 && progreso < 100 && (
                        <ProgressBar animated now={progreso} className="mb-3" />
                    )}

                    <Button variant="success" className="w-100" onClick={subirArchivos}>
                        Confirmar y Enviar a Procesamiento
                    </Button>
                </div>
            )}
        </Card>
    );
};