import React, { useState, useEffect } from 'react';
import { getFirestore, collection, setDoc, doc, getDocs, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';

export const RegistroDiagrama = () => {
    const [numeroTren, setNumeroTren] = useState('');
    const [tipoDiagrama, setTipoDiagrama] = useState('Suarez');
    const [partida, setPartida] = useState('');
    const [llegada, setLlegada] = useState('');
    const [servicio, setServicio] = useState('');
    const [horaPartida, setHoraPartida] = useState('');
    const [horaLlegada, setHoraLlegada] = useState('');
   
    

    const db = getFirestore();

   

    const handleGuardarDiagrama = async () => {
        if (!numeroTren || !partida || !llegada || !servicio || !horaPartida || !horaLlegada ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor complete todos los campos',
            });
            return;
        }

        const coleccion = tipoDiagrama === 'Suarez' ? 'diagramaSuarez' : 'diagramaTigre';

       

        try {
            await setDoc(doc(db, coleccion, numeroTren), {
                partida,
                llegada,
                servicio: Number(servicio),
                horaPartida,
                horaLlegada,
                
            });

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Diagrama registrado correctamente',
            });

            // Limpiar campos
            setNumeroTren('');
            setPartida('');
            setLlegada('');
            setServicio('');
            setHoraPartida('');
            setHoraLlegada('');
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar el diagrama',
            });
        }
    };

    const opcionesPartidaLlegada = tipoDiagrama === 'Suarez'
        ? ['Suarez', 'Mitre', 'Retiro']
        : ['Tigre', 'Victoria', 'Retiro'];

    return (
        <div>
            <h2>Registro de Diagrama</h2>
            <div>
                <label>Seleccione Linea</label>
                <select value={tipoDiagrama} onChange={(e) => setTipoDiagrama(e.target.value)}>
                    <option value="Suarez">Suarez</option>
                    <option value="Tigre">Tigre</option>
                </select>
            </div>
            <div>
                <label>Tren: </label>
                <input
                    type="text"
                    value={numeroTren}
                    onChange={(e) => setNumeroTren(e.target.value)}
                />
            </div>
            <div>
                <label>Partida</label>
                <select value={partida} onChange={(e) => setPartida(e.target.value)}>
                    <option value="">Seleccione la partida</option>
                    {opcionesPartidaLlegada.map((opcion, index) => (
                        <option key={index} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Hora de Partida</label>
                <input
                    type="time"
                    value={horaPartida}
                    onChange={(e) => setHoraPartida(e.target.value)}
                />
            </div>
            <div>
                <label>Llegada</label>
                <select value={llegada} onChange={(e) => setLlegada(e.target.value)}>
                    <option value="">Seleccione la llegada</option>
                    {opcionesPartidaLlegada.map((opcion, index) => (
                        <option key={index} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Hora de Llegada</label>
                <input
                    type="time"
                    value={horaLlegada}
                    onChange={(e) => setHoraLlegada(e.target.value)}
                    />
            </div>
            <div>
                <label>Servicio</label>
                <input
                    type="number"
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                />
            </div>
                    <h2>Se vincula por Servicio con el personal</h2>
            
            <button className='btn btn-success' onClick={handleGuardarDiagrama}>Guardar Diagrama</button>
        </div>
    );
};


