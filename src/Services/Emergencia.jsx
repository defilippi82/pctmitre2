import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export const Emergencia = () => {
    const [personalABordo, setPersonalABordo] = useState([]);

    const db = getFirestore();

    useEffect(() => {
        const obtenerDatos = async () => {
            const ahora = new Date();
            const horaActual =  "05:50";
            //ahora.toISOString().slice(0, 16);
            const cuarentaMinutosAntes = new Date(ahora.getTime() - 40 * 60 * 1000).toISOString().slice(0, 16);
            const cuarentaMinutosDespues = new Date(ahora.getTime() + 40 * 60 * 1000).toISOString().slice(0, 16);

            const q = query(collection(db, 'diagramaSuarez'), 
                where('horaPartida', '>=', cuarentaMinutosAntes),
                where('horaPartida', '<=', cuarentaMinutosDespues)
            );

            const querySnapshot = await getDocs(q);
            const datos = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();

                // Obtener el apellido del conductor desde la colección conductores
                const conductorRef = query(
                    collection(db, 'conductores'),
                    where('servicio', '==', data.servicio)
                );
                const conductorSnapshot = await getDocs(conductorRef);
                const conductorData = conductorSnapshot.docs[0]?.data();

                datos.push({
                    servicio: data.servicio,
                    tren: doc.id,
                    conductor: conductorData?.apellido || 'Desconocido',
                    horaPartida: data.horaPartida,
                    horaLlegada: data.horaLlegada,
                });
            }

            setPersonalABordo(datos);
        };

        obtenerDatos();
    }, [db]);

    return (
        <div>
            <h2>Personal a Bordo</h2>
            <table>
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Tren</th>
                        <th>Conductor</th>
                        <th>Hora Partida</th>
                        <th>Hora Llegada</th>
                    </tr>
                </thead>
                <tbody>
                    {personalABordo.map((item, index) => (
                        <tr key={index}>
                            <td>{item.servicio}</td>
                            <td>{item.tren}</td>
                            <td>{item.conductor}</td>
                            <td>{item.horaPartida}</td>
                            <td>{item.horaLlegada}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


