import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export const Emergencia = () => {
    const [horaActual, setHoraActual] = useState("05:50");
    const [linea, setLinea] = useState("Suarez Elect");
    const [dia, setDia] = useState("L a V");
    const [conductores, setConductores] = useState([]);
    const [guardasTren, setGuardatrenes] = useState([]);
    

    const db = getFirestore();

    useEffect(() => {
        const obtenerDatos = async () => {
            const horaPartidaLimit = new Date(`1970-01-01T${horaActual}`).getTime() - 40 * 60 * 1000; // 40 minutos antes

            let collectionSuffix = '';
            if (linea.includes("Elect")) {
                if (dia === "L a V") collectionSuffix = "Lav";
                else if (dia === "Sab") collectionSuffix = "Sab";
                else collectionSuffix = "Dom";
            }

            const condCollectionName = `servicioElecCond${collectionSuffix}`;
            const guardCollectionName = `servicioElecGuard${collectionSuffix}`;
            const diagramaCollectionName = `diagramaSuarez${collectionSuffix}Cond`;

            // Obtener datos de Conductores
            const qCond = query(collection(db, condCollectionName));
            const condSnapshot = await getDocs(qCond);
            const conductoresData = [];

            for (const doc of condSnapshot.docs) {
                const condData = doc.data();
                const trenDataQuery = query(
                    collection(db, diagramaCollectionName),
                    where('servicio', '==', condData.servicio)
                );
                const trenDataSnapshot = await getDocs(trenDataQuery);
                const trenData = trenDataSnapshot.docs[0]?.data();

                if (trenData) {
                    const horaPartida = new Date(`1970-01-01T${trenData.horaPartida}`).getTime();
                    if (horaPartida >= horaPartidaLimit) {
                        const conductorQuery = query(
                            collection(db, 'conductores'),
                            where('servicio', '==', condData.servicio)
                        );
                        const conductorSnapshot = await getDocs(conductorQuery);
                        const conductor = conductorSnapshot.docs[0]?.data();

                        conductoresData.push({
                            servicio: condData.servicio,
                            tren: trenData.tren || 'Desconocido',
                            horaPartida: trenData.horaPartida || 'Desconocido',
                            horaLlegada: trenData.horaLlegada || 'Desconocido',
                            personal: conductor?.apellido || 'Desconocido',
                            horaTomada: condData.horaTomada || 'Desconocido',
                            horaDejada: condData.horaDejada || 'Desconocido',
                        });
                    }
                }
            }
            setConductores(conductoresData);

            // Obtener datos de Guardas
            const qGuard = query(collection(db, guardCollectionName));
            const guardSnapshot = await getDocs(qGuard);
            const guardasData = [];

            for (const doc of guardSnapshot.docs) {
                const guardData = doc.data();
                const trenDataQuery = query(
                    collection(db, diagramaCollectionName),
                    where('servicio', '==', guardData.servicio)
                );
                const trenDataSnapshot = await getDocs(trenDataQuery);
                const trenData = trenDataSnapshot.docs[0]?.data();

                if (trenData) {
                    const horaPartida = new Date(`1970-01-01T${trenData.horaPartida}`).getTime();
                    if (horaPartida >= horaPartidaLimit) {
                        const guardaQuery = query(
                            collection(db, 'guardatren'),
                            where('servicio', '==', guardData.servicio)
                        );
                        const guardaSnapshot = await getDocs(guardaQuery);
                        const guarda = guardaSnapshot.docs[0]?.data();

                        guardasData.push({
                            servicio: guardData.servicio,
                            tren: trenData.tren || 'Desconocido',
                            horaPartida: trenData.horaPartida || 'Desconocido',
                            horaLlegada: trenData.horaLlegada || 'Desconocido',
                            personal: guarda?.apellido || 'Desconocido',
                            horaTomada: guardData.horaTomada || 'Desconocido',
                            horaDejada: guardData.horaDejada || 'Desconocido',
                        });
                    }
                }
            }
            setGuardatrenes(guardasData);
        };

        obtenerDatos();
    }, [horaActual, linea, dia, db]);

    return (
        <div>
            <h2>Emergencia - Personal a Bordo</h2>

            <div>
                <label>Hora Actual: </label>
                <input
                    type="time"
                    value={horaActual}
                    onChange={(e) => setHoraActual(e.target.value)}
                />
            </div>

            <div>
                <label>Línea: </label>
                <select value={linea} onChange={(e) => setLinea(e.target.value)}>
                    <option value="Suarez Elect">Suarez Elect</option>
                    <option value="Suarez Diesel">Suarez Diesel</option>
                    <option value="Tigre Elect">Tigre Elect</option>
                    <option value="Tigre Diesel">Tigre Diesel</option>
                </select>
            </div>

            <div>
                <label>Día: </label>
                <select value={dia} onChange={(e) => setDia(e.target.value)}>
                    <option value="L a V">L a V</option>
                    <option value="Sab">Sáb</option>
                    <option value="Dom y Feriados">Dom y Feriados</option>
                </select>
            </div>

            <h3>Conductores</h3>
            <table>
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Tren</th>
                        <th>Hora Partida</th>
                        <th>Hora Llegada</th>
                        <th>Personal</th>
                        <th>Hora Tomada</th>
                        <th>Hora Dejada</th>
                    </tr>
                </thead>
                <tbody>
                    {conductores.map((item, index) => (
                        <tr key={index}>
                            <td>{item.servicio}</td>
                            <td>{item.tren}</td>
                            <td>{item.horaPartida}</td>
                            <td>{item.horaLlegada}</td>
                            <td>{item.personal}</td>
                            <td>{item.horaTomada}</td>
                            <td>{item.horaDejada}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Guardas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Tren</th>
                        <th>Hora Partida</th>
                        <th>Hora Llegada</th>
                        <th>Personal</th>
                        <th>Hora Tomada</th>
                        <th>Hora Dejada</th>
                    </tr>
                </thead>
                <tbody>
                    {guardasTren.map((item, index) => (
                        <tr key={index}>
                            <td>{item.servicio}</td>
                            <td>{item.tren}</td>
                            <td>{item.horaPartida}</td>
                            <td>{item.horaLlegada}</td>
                            <td>{item.personal}</td>
                            <td>{item.horaTomada}</td>
                            <td>{item.horaDejada}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


