import React, { useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Button, Table } from 'react-bootstrap';
import SweetAlert from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import loadingGif from '/loading.gif';

export const Lista = () => {
    const [linea, setLinea] = useState('');
    const [loading, setLoading] = useState(false); // Estado de carga
    const [servicio, setServicio] = useState('');
    const [personal, setPersonal] = useState('');
    const [dias, setDias] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [selectedDate, setSelectedDate] = useState(''); 

    const db = getFirestore();

    const handleSearch = async () => {
        let coleccion = '';
    
        // Definir la colección en función de los filtros seleccionados
        // El código para determinar 'coleccion' se mantiene igual
        // ...

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

    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text('Personal a Bordo y Personal a Ordenes', 80, 10);

        const dateObj = new Date(selectedDate + 'T00:00:00'); 
        const formattedDate = dateObj.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc.text(`Personal: ${personal} - Serv: ${servicio} - Línea: ${linea}`, 60, 15);
        doc.text(`Fecha:  ${formattedDate}`, 80, 18);

        // Función para generar tabla en PDF
        const generateTable = (title, data) => {
            doc.addPage();
            doc.text(title, 80, 10);
            doc.autoTable({
                head: [['Servicio', 'Tren', 'Conductor', 'Observaciones', 'Toma Serv.', 'Deja Serv.']],
                body: data.map(item => [
                    item.servicio,
                    item.tren,
                    item.conductor,
                    item.observaciones || '',
                    item.horaTomada,
                    item.horaDejada
                ]),
                startY: 20,
                theme: 'grid',
                headStyles: { fillColor: [100, 100, 100] },
                styles: {
                    cellPadding: 'auto',
                    fontSize: 8,
                    halign: 'center',
                    valign: 'middle',
                }
            });
        };

        const personalBordo = resultados.filter(item => item.servicio >= 101 && item.servicio <= 172);
        const personalOrdenes = resultados.filter(item => item.servicio >= 173 && item.servicio <= 195);

        generateTable('Personal a Bordo', personalBordo);
        generateTable('Personal a Ordenes', personalOrdenes);

        doc.save('personal_a_bordo_y_ordenes.pdf');
    };

    return (
        <div>
            <h2>Lista de Personal</h2>
            {loading ? (
                <div style={{ textAlign: 'center' }}>
                    <img src={loadingGif} alt="Cargando..." style={{ width: '100px', height: '100px' }} />
                    <p>Cargando datos...</p>
                </div>
            ) : (
                <>
            <div>
                {/* Los filtros de línea, servicio, personal y fecha */}
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
                <label>Fecha:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            <div>
                {/* Filtros para días de la semana */}
                <label>Días de la Semana:</label>
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo y Feriados'].map((dia) => (
                    <div key={dia} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                        <input
                            type="checkbox"
                            value={dia}
                            onChange={(e) => setDias(prev => prev.includes(e.target.value) ? prev.filter(day => day !== e.target.value) : [...prev, e.target.value])}
                        />
                        <label style={{ marginLeft: '5px' }}>{dia}</label>
                    </div>
                ))}
            </div>

            <Button variant='success' onClick={handleSearch}>Generar Lista</Button>
            <Button variant='warning' onClick={handleGeneratePDF}>Imprimir</Button>
            
            {/* Tabla de Personal a Bordo */}
            <h1>Personal a Bordo</h1>
            <Table variant='secondary'>
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
                    {resultados.filter(item => item.servicio >= 101 && item.servicio <= 172).map((item, index) => (
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
                                <Button variant='secondary'
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
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Tabla de Personal a Ordenes */}
            <h2>Personal a Ordenes</h2>
            <Table variant='dark'>
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
                    {resultados.filter(item => item.servicio >= 173 && item.servicio <= 195).map((item, index) => (
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
                                <Button variant='secondary'
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
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </>
        )}
        </div>
    );
};
