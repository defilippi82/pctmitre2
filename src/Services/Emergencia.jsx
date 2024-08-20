import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { Form, Table, Button, Row, Col, Card } from 'react-bootstrap';

export const Emergencia = () => {
    const [datos, setDatos] = useState([]);
    const [horaActual, setHoraActual] = useState('05:50'); // Valor inicial para pruebas
    const [linea, setLinea] = useState('SuarezElec');
    //const [dia, setDia] = useState('');
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
    const handleButtonClick = async(value) => {
        setLinea(value);
        await obtenerDatos(value);
      };

    

        const obtenerDatos = async (linea) => {
            const horaActualDate = new Date(`1970-01-01T${horaActual}`);
            const horaInicioRango = horaActualDate.getTime() - 30 * 60 * 1000; // 30 minutos antes
            const horaFinRango = horaActualDate.getTime() + 30 * 60 * 1000; // 30 minutos después

            let dias = Object.keys(diasSeleccionados).filter(dia => diasSeleccionados[dia]);

           
            let datosFinales = [];
             // Determinar los sufijos para las colecciones
             for (const dia of dias) {
                let Suffix1 = linea;
                let Suffix2 = dia;
           

            const condCollectionName = `servicio${Suffix1}Cond${Suffix2}`;
            const guardCollectionName = `servicio${Suffix1}Guar${Suffix2}`;
            const diagramaCondCollectionName = `diagrama${Suffix1}${Suffix2}Cond`;
            const diagramaGuardaCollectionName = `diagrama${Suffix1}${Suffix2}Guarda`;


        console.log("Colección de conductores:", condCollectionName);
        console.log("Colección de guardas:", guardCollectionName);
        console.log("Colección de diagrama de conductores:", diagramaCondCollectionName);
        console.log("Colección de diagrama de guardas:", diagramaGuardaCollectionName);


            const condSnapshot = await getDocs(collection(db, condCollectionName));
            
                
            for (const doc of condSnapshot.docs) {
                const condData = doc.data();
            
                const trenDataQuery = query(
                    collection(db, diagramaCondCollectionName),
                    where('servicio', '==', condData.servicio)
                );
                const trenDataSnapshot = await getDocs(trenDataQuery);
                const trenData = trenDataSnapshot.docs[0]?.data();
            
                if (trenData) {
                    const horaPartidaDate = new Date(`1970-01-01T${trenData.horaPartida}`).getTime();
                    if (horaPartidaDate >= horaInicioRango && horaPartidaDate <= horaFinRango) {
                        const conductorQuery = query(
                            collection(db, 'conductores'),
                            where('servicio', '==', condData.servicio)
                        );
                        const conductorSnapshot = await getDocs(conductorQuery);
                        const conductor = conductorSnapshot.docs[0]?.data();
            
                        // Obtener datos del guarda desde la colección de guardas
                        const guardaCollection = collection(db, guardCollectionName); // Usando la colección correcta para los guardas
                        const guardaSnapshot = await getDocs(query(guardaCollection, where('servicio', '==', condData.servicio)));
                        const guardaData = guardaSnapshot.docs[0]?.data();
            
                        // Obtener el nombre del guarda
                        const guardaQuery = query(
                            collection(db, 'guardatren'),
                            where('servicio', '==', guardaData?.servicio)
                        );
                        const guardaSnapshotFinal = await getDocs(guardaQuery);
                        const guarda = guardaSnapshotFinal.docs[0]?.data();
            
                        datosFinales.push({
                            servicio: condData.servicio,
                            tren: trenData.tren || 'Desconocido',
                            horaPartida: trenData.horaPartida || 'Desconocido',
                            horaLlegada: trenData.horaLlegada || 'Desconocido',
                            conductor: conductor?.apellido || 'Desconocido',
                            horaTomada: condData.horaTomada || 'Desconocido',
                            horaDejada: condData.horaDejada || 'Desconocido',
                            serviciog: guardaData?.servicio || 'Desconocido',
                            guarda: guarda?.apellido || 'Desconocido',
                            horaTomadaGuarda: guardaData?.horaTomada || 'Desconocido',
                            horaDejadaGuarda: guardaData?.horaDejada || 'Desconocido',
                        });
                    }
                }
            }
            
        }

            setDatos(datosFinales);
        };

        useEffect(() => {
            obtenerDatos(linea);
        }, [horaActual, diasSeleccionados]);

    return (
        <div>
            <h1>Emergencia - Personal a Bordo</h1>

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


            {/*<div>
                <label>Día: </label>
                <select value={dia} onChange={() => setDia(e.target.value)}>
                    <option value="Lav">L a V</option>
                    <option value="Sab">Sáb</option>
                    <option value="Dom">Dom y Feriados</option>
                </select>
            </div>*/}
            <div>
                <h4>Servicio: </h4>
                </div>
                <div>
                <Button variant='dark' onClick={() => handleButtonClick('SuarezElec')}>Electrico Suarez</Button>
                <Button variant='dark' onClick={() => handleButtonClick('SuarezDies')}>Diesel Suarez</Button>
                <Button variant='warning' onClick={() => handleButtonClick('TigreElec')}>Electrico Tigre</Button>
                <Button variant='warning' onClick={() => handleButtonClick('TigreDies')}>Diesel Tigre</Button>

               {/* Base 
                <select value={linea} onChange={(e) => setLinea(e.target.value)}>
                    <option value="SuarezElec">Suarez Elect</option>
                    <option value="SuarezDies">Suarez Diesel</option>
                    <option value="TigreElec">Tigre Elect</option>
                    <option value="TigreDies">Tigre Diesel</option>
                </select>
                    */}
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
            <h4>Emergencia - Personal a Ordenes</h4>

            <Table variant='dark' striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Base</th>
                        <th>Serv. Cond.</th>
                        <th>Conductor</th>
                        <th>Tomada Cond.</th>
                        <th>Dejada Cond.</th>
                        <th>Guarda</th>
                        <th>Tomada Guarda</th>
                        <th>Dejada Guarda</th>
                    </tr>
                </thead>
                <tbody>
                    {datos.map((fila, index) => (
                        <tr key={index}>
                            <td>{fila.base}</td>
                            <td>{fila.servicio}</td>
                            <td>{fila.conductor}</td>
                            <td>{fila.horaTomada}</td>
                            <td>{fila.horaDejada}</td>
                            <td>{fila.guarda}</td>
                            <td>{fila.horaTomadaGuarda}</td>
                            <td>{fila.horaDejadaGuarda}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
