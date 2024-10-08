import React, { useState } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Form, Table, Button, Row, Col, Card } from 'react-bootstrap';
import SweetAlert from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { auto } from '@popperjs/core';
//import PDF, { Text, AddPage, Line, Image, Table, Html } from 'jspdf-react'


export const Lista = () => {
    const [linea, setLinea] = useState('');
    const [servicio, setServicio] = useState('');
    const [personal, setPersonal] = useState('');
    const [dias, setDias] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [selectedDate, setSelectedDate] = useState(''); // Nuevo estado para la fecha


    const db = getFirestore();

    const handleSearch = async () => {
        let coleccion = '';
    
        if (linea === 'Suarez' && servicio === 'Electrico' && personal === 'Conductores') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioSuarezElecCondSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioSuarezElecCondDom';
            } else {
                coleccion = 'servicioSuarezElecCondLav';
            }
        } else if (linea === 'Suarez' && servicio === 'Electrico' && personal === 'Guardas') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioSuarezElecGuarSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioSuarezElecGuarDom';
            } else {
                coleccion = 'servicioSuarezElecGuarLav';
            }
        } else if (linea === 'Suarez' && servicio === 'Diesel' && personal === 'Conductores') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioSuarezDiesCondSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioSuarezDiesCondDom';
            } else {
                coleccion = 'servicioSuarezDiesCondLav';
            }
        } else if (linea === 'Suarez' && servicio === 'Diesel' && personal === 'Guardas') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioSuarezDiesGuarSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioSuarezDiesGuarDom';
            } else {
                coleccion = 'servicioSuarezDiesGuarLav';
            }
        } else if (linea === 'Tigre' && servicio === 'Electrico' && personal === 'Conductores') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioTigreElecCondSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioTigreElecCondDom';
            } else {
                coleccion = 'servicioTigreElecCondLav';
            }
        } else if (linea === 'Tigre' && servicio === 'Electrico' && personal === 'Guardas') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioTigreElecGuarSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioTigreElecGuarDom';
            } else {
                coleccion = 'servicioTigreElecGuarLav';
            }
        } else if (linea === 'Tigre' && servicio === 'Diesel' && personal === 'Conductores') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioTigreDiesCondSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioTigreDiesCondDom';
            } else {
                coleccion = 'servicioTigreDiesCondLav';
            }
        } else if (linea === 'Tigre' && servicio === 'Diesel' && personal === 'Guardas') {
            if (dias.includes('Sabado')) {
                coleccion = 'servicioTigreDiesGuarSab';
            } else if (dias.includes('Domingo y Feriados')) {
                coleccion = 'servicioTigreDiesGuarDom';
            } else {
                coleccion = 'servicioTigreDiesGuarLav';
            }
        
    
        // Lógica para utilizar la variable `coleccion`
    };
    

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
        doc.setFontSize(12);
        doc.text('Personal a Bordo', 80, 10);
       // Formatear la fecha seleccionada
       doc.setFontSize(10);
       const dateObj = new Date(selectedDate + 'T00:00:00'); // Agregar la hora para evitar la conversión de UTC

       //const selectedDay = dias.length > 0 ? dias[0] : 'No seleccionado';
       const formattedDate = dateObj.toLocaleDateString('es-ES', {
           weekday: 'long',
           year: 'numeric',
           month: 'long',
           day: 'numeric'
       });

       // Agregar la fecha y selección al PDF
       doc.text(`Personal: ${personal}- Serv: ${servicio} -Línea: ${linea}`, 60, 15);
         doc.text(`Fecha:  ${formattedDate}`, 80, 18);


        // Definimos las columnas de la tabla
        const columns = [
            { title: "Servicio", dataKey: "servicio" },
            { title: "Tren", dataKey: "tren" },
            { title: "Conductor", dataKey: "conductor" },
            { title: "Observaciones", dataKey: "observaciones" },
            { title: "Toma Serv.", dataKey: "horaTomada" },
            { title: "Deja Serv.", dataKey: "horaDejada" }
        ];

        // Insertamos los datos en filas
        const rows = resultados.map(item => ({
            servicio: item.servicio,
            tren: item.tren,
            conductor: item.conductor,
            observaciones: item.observaciones || '', // Observaciones pueden estar vacías
            horaTomada: item.horaTomada,
            horaDejada: item.horaDejada,
        }));

        // Generamos la tabla con jsPDF-AutoTable
        doc.autoTable({
            head: [columns.map(col => col.title)], // Encabezados de la tabla
            body: rows.map(row => columns.map(col => row[col.dataKey])), // Datos de la tabla
            startY: 20, // Espacio donde comienza la tabla en el eje Y
            theme: 'grid',
            headStyles: {
                fillColor: [100, 100, 100]  // Dark gray color for header
            },
            styles: {
                cellPadding: auto,
                cellWidth: auto,
                cellHeight: auto,
                fontSize: 8,
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.25,
                textColor: 20,
                lineColor: [0, 0, 0],  // Black color for borders
            }
        });
        
       
        doc.save('personal_a_bordo.pdf');
    };

    return (
        <div>
            <h2>Lista de Personal a bordo</h2>
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
                <label>Fecha:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            <div>
                            
            </div><div style={{ display: 'flex', alignItems: 'center' }}>
    <label>Días de la Semana:</label>
    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo y Feriados'].map((dia) => (
        <div key={dia} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <input
                type="checkbox"
                value={dia}
                onChange={handleCheckboxChange}
            />
            <label style={{ marginLeft: '5px' }}>{dia}</label>
        </div>
    ))}
</div>

            <Button variant='success' onClick={handleSearch}>Generar Lista</Button>
            <Button variant='warning' onClick={handleGeneratePDF}>imprimir</Button>
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
                                    <FontAwesomeIcon icon={faEdit}/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};


