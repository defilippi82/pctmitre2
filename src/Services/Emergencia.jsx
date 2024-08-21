import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { Form, Table, Button } from 'react-bootstrap';
import loadingGif from '/loading.gif'; // Asegúrate de tener un archivo GIF en la carpeta `assets`

export const Emergencia = () => {
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(false); // Estado de carga
    const [horaActual, setHoraActual] = useState('05:50'); // Valor inicial para pruebas
    const [linea, setLinea] = useState('SuarezElec');
    const [diasSeleccionados, setDiasSeleccionados] = useState({
        Lav: false,
        Sab: false,
        Dom: false
    });

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setDiasSeleccionados(prevState => ({
            ...prevState,
            [value]: checked
        }));
    };

    const handleButtonClick = async (value) => {
        setLinea(value);
        await obtenerDatos(value);
    };

    const obtenerDatos = async (linea) => {
        setLoading(true); // Activar la carga
        const horaActualDate = new Date(`1970-01-01T${horaActual}`);
        const horaInicioRango = horaActualDate.getTime() - 30 * 60 * 1000; // 30 minutos antes
        const horaFinRango = horaActualDate.getTime() + 30 * 60 * 1000; // 30 minutos después
    
        let dias = Object.keys(diasSeleccionados).filter(dia => diasSeleccionados[dia]);
    
        let datosFinales = [];
        for (const dia of dias) {
            let Suffix1 = linea;
            let Suffix2 = dia;
    
            const condCollectionName = `servicio${Suffix1}Cond${Suffix2}`;
            const diagramaCollectionName = `diagrama${Suffix1}${Suffix2}`;
    
            const condSnapshot = await getDocs(collection(db, condCollectionName));
    
            for (const doc of condSnapshot.docs) {
                const condData = doc.data();
                
                // Obtener los datos del tren para el conductor
                const trenDataQueryCond = query(
                    collection(db, diagramaCollectionName),
                    where('servicio', '==', condData.servicio)
                );
                const trenDataSnapshotCond = await getDocs(trenDataQueryCond);
                const trenData = trenDataSnapshotCond.docs[0]?.data();
                
                if (trenData?.servicioG) { // Verificar que servicioG no es undefined
                    // Obtener los datos del guardatren utilizando el servicioG
                    const guardaCollection = collection(db, 'guardatren');
                    const guardaQuery = query(guardaCollection, where('servicio', '==', trenData.servicioG));
                    const guardaSnapshot = await getDocs(guardaQuery);
                    const guardaData = guardaSnapshot.docs[0]?.data();

                      // Convertir horaPartida a timestamp para la comparación
                const horaPartidaDate = new Date(`1970-01-01T${trenData.horaPartida}`).getTime();

                if (horaPartidaDate >= horaInicioRango && horaPartidaDate <= horaFinRango) {
                    datosFinales.push({
                        servicio: condData.servicio,
                        tren: trenData.tren || 'Desconocido',
                        horaPartida: trenData.horaPartida || 'Desconocido',
                        horaLlegada: trenData.horaLlegada || 'Desconocido',
                        conductor: condData.apellido || 'Desconocido',
                        horaTomada: condData.horaTomada || 'Desconocido',
                        horaDejada: condData.horaDejada || 'Desconocido',
                        serviciog: trenData.servicioG || 'Desconocido',
                        guarda: guardaData?.apellido || 'Desconocido',
                        horaTomadaGuarda: guardaData?.horaTomada || 'Desconocido',
                        horaDejadaGuarda: guardaData?.horaDejada || 'Desconocido',
                    });
                }
            }
        }
    }
    
        setDatos(datosFinales);
        setLoading(false); // Desactivar la carga
    };
    

    useEffect(() => {
        //obtenerDatos(linea);
    }, []);

    return (
        <div>
            <h1>Emergencia - Personal a Bordo</h1>

            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <img src={loadingGif} alt="Cargando..." style={{ width: '100px', height: '100px' }} />
                    <p>Cargando datos...</p>
                </div>
            ) : (
                <>
                    <div>
                        <label>Hora Actual: </label>
                        <input
                            type="time"
                            value={horaActual}
                            onChange={(e) => setHoraActual(e.target.value)}
                        />
                    </div>

                    <div>
                        <h4>Días: </h4>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                value="Lav"
                                checked={diasSeleccionados.Lav}
                                onChange={handleCheckboxChange}
                            />
                            Lunes a Viernes
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Sab"
                                checked={diasSeleccionados.Sab}
                                onChange={handleCheckboxChange}
                            />
                            Sábados
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                value="Dom"
                                checked={diasSeleccionados.Dom}
                                onChange={handleCheckboxChange}
                            />
                            Domingo y Feriados
                        </label>
                    </div>

                    <div>
                        <h4>Servicio: </h4>
                    </div>
                    <div>
                        <Button variant='dark' onClick={() => handleButtonClick('SuarezElec')}>Electrico Suarez</Button>
                        <Button variant='dark' onClick={() => handleButtonClick('SuarezDies')}>Diesel Suarez</Button>
                        <Button variant='warning' onClick={() => handleButtonClick('TigreElec')}>Electrico Tigre</Button>
                        <Button variant='warning' onClick={() => handleButtonClick('TigreDies')}>Diesel Tigre</Button>
                    </div>

                    <h3>Emergencia - Personal en Circulación</h3>

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Tren</th>
                                <th>Hs Partida</th>
                                <th>Hs Llegada</th>
                                <th>Serv. Cond.</th>
                                <th>Conductor</th>
                                <th>Tomada Cond.</th>
                                <th>Dejada Cond.</th>
                                <th>Serv. Guarda.</th>
                                <th>Guarda</th>
                                <th>Tomada Guarda</th>
                                <th>Dejada Guarda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datos.map((fila, index) => (
                                <tr key={index}>
                                    <td>{fila.tren}</td>
                                    <td>{fila.horaPartida}</td>
                                    <td>{fila.horaLlegada}</td>
                                    <td>{fila.servicio}</td>
                                    <td>{fila.conductor}</td>
                                    <td>{fila.horaTomada}</td>
                                    <td>{fila.horaDejada}</td>
                                    <td>{fila.serviciog}</td>
                                    <td>{fila.guarda}</td>
                                    <td>{fila.horaTomadaGuarda}</td>
                                    <td>{fila.horaDejadaGuarda}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <h3>Emergencia - Personal a Ordenes</h3>

<Table striped bordered hover responsive variant='dark'>
    <thead>
        <tr>
            <th>Base</th>
             <th>Serv. Cond.</th>
            <th>Conductor</th>
            <th>Tomada Cond.</th>
            <th>Dejada Cond.</th>
            <th>Serv. Guarda.</th>
            <th>Guarda</th>
            <th>Tomada Guarda</th>
            <th>Dejada Guarda</th>
        </tr>
    </thead>
    <tbody>
        {datos.map((fila, index) => (
            <tr key={index}>
                <td>{fila.tren}</td>
                <td>{fila.servicio}</td>
                <td>{fila.conductor}</td>
                <td>{fila.horaTomada}</td>
                <td>{fila.horaDejada}</td>
                <td>{fila.serviciog}</td>
                <td>{fila.guarda}</td>
                <td>{fila.horaTomadaGuarda}</td>
                <td>{fila.horaDejadaGuarda}</td>
            </tr>
        ))}
    </tbody>
</Table>
                </>
            )}
        </div>
    );
};
