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

    const processAndUpload = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const rawData = JSON.parse(e.target.result);
                    const colRef = collection(db, collectionName);

                    // Iteramos sobre cada elemento del array para que sean documentos separados
                    const uploadPromises = rawData.map(async (item) => {
                        // 1. Detectamos la clave del objeto (que contiene los nombres de los campos)
                        const rawKey = Object.keys(item)[0];
                        const rawValue = item[rawKey];

                        // 2. Si la fila está vacía (como los ;;;;;; finales del archivo), la ignoramos
                        if (!rawValue || rawValue.trim() === "" || rawValue.startsWith(";;")) {
                            return; 
                        }

                        // 3. Separamos los encabezados y los valores por ";"
                        const headers = rawKey.split(';');
                        const values = rawValue.split(';');

                        // 4. Construimos el objeto final limpio
                        const docToUpload = {};
                        headers.forEach((header, index) => {
                            if (header && header.trim() !== "") {
                                // Limpiamos espacios y quitamos las comillas extras si existen
                                docToUpload[header.trim()] = values[index] ? values[index].replace(/"/g, '').trim() : "";
                            }
                        });

                        // 5. Subimos como un documento nuevo
                        return addDoc(colRef, {
                            ...docToUpload,
                            fecha_proceso: serverTimestamp() // Opcional: para saber cuándo se subió
                        });
                    });

                    await Promise.all(uploadPromises);
                    resolve();
                } catch (error) {
                    console.error("Error procesando archivo:", error);
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    };

    const handleUpload = async () => {
        if (jsonFiles.length === 0) {
            Swal.fire('Error', 'Selecciona el archivo JSON', 'error');
            return;
        }

        Swal.fire({
            title: 'Subiendo datos...',
            text: `Creando documentos individuales en ${collectionName}`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            for (const file of jsonFiles) {
                await processAndUpload(file);
            }
            Swal.fire('¡Éxito!', 'Cada fila se ha subido como un documento independiente.', 'success');
            setJsonFiles([]);
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al procesar el JSON.', 'error');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px' }}>
            <h3>Cargar Base de Datos</h3>
            <input 
                type="text" 
                placeholder="Nombre de la colección"
                value={collectionName} 
                onChange={(e) => setCollectionName(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            />
            <input 
                type="file" 
                accept=".json" 
                multiple 
                onChange={handleFileChange}
                style={{ marginBottom: '10px' }}
            />
            <button 
                onClick={handleUpload}
                style={{ width: '100%', padding: '10px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                Subir documentos
            </button>
        </div>
    );
};