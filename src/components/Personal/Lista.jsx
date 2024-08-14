import React, { useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import SweetAlert from 'sweetalert2';
import jsPDF from 'jspdf';

export const Lista = () => {
    const [linea, setLinea] = useState('');
    const [servicio, setServicio] = useState('');
    const [personal, setPersonal] = useState('');
    const [dias, setDias] = useState([]);
    const [resultados, setResultados] = useState([]);

    const db = getFirestore();

    const handleSearch = async () => {
        let coleccion = '';
        if (linea === 'Suarez' && servicio === 'Electrico' && personal === 'Conductores') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioSuarezElecCondSab';
            } else if (dias.includes('Domingo')) {
                coleccion = 'servicioSuarezElecCondDom';
            } else {
                coleccion = 'servicioSuarezElecCondLav';
            }
        } else if (linea === 'Suarez' && servicio === 'Electrico' && personal === 'Guardas') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioSuarezElecGuarSab';
            } else if (dias.includes('Domingo')) {
                coleccion = 'servicioSuarezElecGuarDom';
            } else {
                coleccion = 'servicioSuarezElecGuarLav';
            }
        }

        const q = query(collection(db, coleccion));
        const querySnapshot = await getDocs(q);
        const data = [];

        for (const doc of querySnapshot.docs) {
            const docData = doc.data();
            const conductorRef = query(
                collection(db, personal === 'Conductores' ? 'conductores' : 'guardatren'),
                where('servicio', '==', docData.servicio)
            );
            const conductorSnapshot = await getDocs(conductorRef);
            const conductorData = conductorSnapshot.docs[0]?.data();

            data.push({
                servicio: docData.servicio,
                tren: docData.tren,
                conductor: conductorData?.apellido || 'Desconocido',
                observaciones: '',
                horaTomada: docData.horaTomada,
                horaDejada: docData.horaDejada,
            });
        }

        setResultados(data);
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setDias(prev =>
            prev.includes(value) ? prev.filter(day => day !== value) : [...prev, value]
        );
    };

    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        doc.text('Personal a Bordo', 20, 20);
        let y = 30;
        resultados.forEach((item, index) => {
            doc.text(
                `${index + 1}. Servicio: ${item.servicio}, Tren: ${item.tren}, Conductor: ${item.conductor}, Toma Serv.: ${item.horaTomada}, Deja Serv.: ${item.horaDejada}`,
                20,
                y
            );
            y += 10;
        });
        doc.save('personal_a_bordo.pdf');
    };

    return (
        <div>
            <h2>Lista de Personal</h2>
            <div>
                <label>Linea:</label>
                <select value={linea} onChange={(e) => setLinea(e.target.value)}>
                    <option value="">Seleccione</option>
                    <option value="Suarez">Suarez</option>
                    <option value="Tigre">Tigre</option>
                </select>
                <label>Servicio:</label>
                <select value={servicio} onChange={(e) => setServicio(e.target.value)}>
                    <option value="">Seleccione</option>
                    <option value="Electrico">Electrico</option>
                    <option value="Diesel">Diesel</option>
                </select>
                <label>Personal:</label>
                <select value={personal} onChange={(e) => setPersonal(e.target.value)}>
                    <option value="">Seleccione</option>
                    <option value="Conductores">Conductores</option>
                    <option value="Guardas">Guardas</option>
                </select>
            </div>
            <div>
                <label>Días de la Semana:</label>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                    <div key={dia}>
                        <input
                            type="checkbox"
                            value={dia}
                            onChange={handleCheckboxChange}
                        />
                        <label>{dia}</label>
                    </div>
                ))}
            </div>
            <button onClick={handleSearch}>Buscar</button>
            <button onClick={handleGeneratePDF}>Generar PDF</button>
            <table>
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Tren</th>
                        <th>Conductor</th>
                        <th>Observaciones</th>
                        <th>Toma Serv.</th>
                        <th>Deja Serv.</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {resultados.map((item, index) => (
                        <tr key={index}>
                            <td>{item.servicio}</td>
                            <td>{item.tren}</td>
                            <td>{item.conductor}</td>
                            <td>
                                <input
                                    type="text"
                                    value={item.observaciones}
                                    onChange={(e) =>
                                        setResultados(prev => {
                                            const newResults = [...prev];
                                            newResults[index].observaciones = e.target.value;
                                            return newResults;
                                        })
                                    }
                                />
                            </td>
                            <td>{item.horaTomada}</td>
                            <td>{item.horaDejada}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        SweetAlert.fire({
                                            title: 'Editar Observaciones',
                                            input: 'text',
                                            inputValue: item.observaciones,
                                            showCancelButton: true,
                                            confirmButtonText: 'Guardar',
                                            cancelButtonText: 'Cancelar',
                                            preConfirm: (newObservacion) => {
                                                setResultados(prev => {
                                                    const newResults = [...prev];
                                                    newResults[index].observaciones = newObservacion;
                                                    return newResults;
                                                });
                                            }
                                        });
                                    }}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


