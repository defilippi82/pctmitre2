import React, { useState } from 'react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const CargarColecciones = () => {
    const [jsonFile, setJsonFile] = useState(null);
    const [collectionName, setCollectionName] = useState('');

    const db = getFirestore();

    const handleFileChange = (event) => {
        setJsonFile(event.target.files[0]);
    };

    const handleCollectionNameChange = (event) => {
        setCollectionName(event.target.value);
    };

    const handleUpload = async () => {
        if (!jsonFile || !collectionName) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, selecciona un archivo JSON y proporciona un nombre de colección.',
            });
            return;
        }

        try {
            const fileReader = new FileReader();
            fileReader.onload = async (event) => {
                const jsonData = JSON.parse(event.target.result);

                jsonData.forEach(async (docData) => {
                    const legajoId = docData.legajo; // Usa el campo "legajo" como ID del documento
                    await setDoc(doc(db, collectionName, legajoId), docData);
                    console.log(`Documento con ID ${legajoId} añadido a la colección ${collectionName}.`);
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Datos subidos',
                    text: 'Los datos se han subido correctamente a Firestore.',
                });
            };
            fileReader.readAsText(jsonFile);
        } catch (error) {
            console.error('Error al subir los datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al subir los datos. Por favor, revisa la consola para más detalles.',
            });
        }
    };

    return (
        <div>
            <h2>Subir Datos a Firestore</h2>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <input 
                type="text" 
                placeholder="Nombre de la Colección" 
                value={collectionName} 
                onChange={handleCollectionNameChange} 
            />
            <button onClick={handleUpload}>Subir Datos</button>
        </div>
    );
};

