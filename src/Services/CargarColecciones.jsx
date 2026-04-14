import React, { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const CargarColecciones = () => {
    const [jsonFiles, setJsonFiles] = useState([]);
    const [collectionName, setCollectionName] = useState('Peditinas');

    const db = getFirestore();

    const handleFileChange = (event) => {
        setJsonFiles(Array.from(event.target.files));
    };

    // Función para procesar y limpiar el formato específico de tu JSON
    const processAndUpload = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const rawData = JSON.parse(e.target.result);
                    const colRef = collection(db, collectionName);

                    const uploadPromises = rawData.map(async (item) => {
                        // Extraemos la clave larga (ej: "fecha;tren;equipo...")
                        const fullKey = Object.keys(item)[0];
                        const fullValue = item[fullKey];

                        if (!fullValue || fullValue.trim() === "" || fullValue.includes(";;;;")) {
                            return; // Salta filas vacías
                        }

                        // Separamos los valores por punto y coma
                        const values = fullValue.split(';');
                        const keys = fullKey.split(';');

                        // Reconstruimos el objeto limpio
                        const cleanDoc = {};
                        keys.forEach((key, index) => {
                            if (key && values[index]) {
                                cleanDoc[key.trim()] = values[index].trim();
                            }
                        });

                        return addDoc(colRef, {
                            ...cleanDoc,
                            timestamp: serverTimestamp()
                        });
                    });

                    await Promise.all(uploadPromises);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    };

    const handleUpload = async () => {
        if (jsonFiles.length === 0) {
            Swal.fire('Error', 'Selecciona al menos un archivo JSON', 'error');
            return;
        }

        Swal.fire({
            title: 'Subiendo a Firestore...',
            text: `Destino: ${collectionName}`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            for (const file of jsonFiles) {
                await processAndUpload(file);
            }
            Swal.fire('¡Éxito!', `Datos cargados en la colección ${collectionName}`, 'success');
            setJsonFiles([]);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Hubo un fallo en la carga de datos', 'error');
        }
    };

    return (
        <div style={{ padding: '25px', maxWidth: '500px', margin: 'auto' }}>
            <h3>Panel de Carga Masiva</h3>
            
            <div style={{ marginBottom: '20px' }}>
                <label>**Colección de Destino:**</label>
                <input 
                    type="text" 
                    className="form-control"
                    value={collectionName} 
                    onChange={(e) => setCollectionName(e.target.value)}
                    placeholder="Ej: Peditinas_2026"
                    style={{ width: '100%', padding: '8px', display: 'block' }}
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>**Archivos JSON:**</label>
                <input 
                    type="file" 
                    accept=".json" 
                    multiple 
                    onChange={handleFileChange}
                    style={{ display: 'block' }}
                />
            </div>

            {jsonFiles.length > 0 && (
                <div style={{ marginBottom: '15px', fontSize: '0.8em' }}>
                    <strong>Seleccionados:</strong> {jsonFiles.length} archivo(s).
                </div>
            )}

            <button 
                onClick={handleUpload}
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Subir Datos a {collectionName}
            </button>
        </div>
    );
};