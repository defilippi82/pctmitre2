import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';


export const Corrida = () => {
    const [responsable, setResponsable] = useState('');
    const [trabajo, setTrabajo] = useState('');
    const [secciones, setSecciones] = useState([]);
    const [conductor, setConductor] = useState(0);
    const [guarda, setGuarda] = useState(0);
    const [piloto, setPiloto] = useState(0);
    const [observaciones, setObservaciones] = useState('');
    const [conductorFields, setConductorFields] = useState([]);
    const [relevoConductorFields, setRelevoConductorFields] = useState([]);
    const [guardaFields, setGuardaFields] = useState([]);
    const [relevoGuardaFields, setRelevoGuardaFields] = useState([]);
    const [pilotoFields, setPilotoFields] = useState([]);
    const [relevoPilotoFields, setRelevoPilotoFields] = useState([]);
    const [userData, setUserData] = useState();

    useEffect(() => {
        const userDataFromStorage = localStorage.getItem('userData');
        if (userDataFromStorage) {
          setUserData(JSON.parse(userDataFromStorage));
        }
      }, []);
      // Otros efectos que dependan de userData
  useEffect(() => {
    // Lógica adicional que depende de userData
  }, [userData]);


    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setSecciones((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const generarCampos = (type, count) => {
        const fields = [];
        const relevoFields = [];
        for (let i = 0; i < count; i++) {
            fields.push(
                <div key={`${type}-${i}`} className="row g-3">
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Legajo`}</label>
                        <input type="number" className="form-control" placeholder="Legajo" />
                    </div>
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Nombre`}</label>
                        <input type="text" className="form-control" placeholder="Nombre" />
                    </div>
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Ingreso`}</label>
                        <input type="time" className="form-control" placeholder="Horario de Ingreso" />
                    </div>
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Dejada`}</label>
                        <input type="time" className="form-control" placeholder="Horario de Dejada" />
                    </div>
                </div>
            );
            relevoFields.push(
                <div key={`relevo-${type}-${i}`} className="row g-3">
                    <div className="col-md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Legajo`}</label>
                        <input type="number" className="form-control" placeholder="Legajo" />
                    </div>
                    <div className="col-md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Nombre`}</label>
                        <input type="text" className="form-control" placeholder="Nombre" />
                    </div>
                    <div className="col-md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Ingreso`}</label>
                        <input type="time" className="form-control" placeholder="Horario de Ingreso" />
                    </div>
                    <div className="col-md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Dejada`}</label>
                        <input type="time" className="form-control" placeholder="Horario de Dejada" />
                    </div>
                </div>
            );
        }
        return relevoFields;        
        

    };

    const handleConductorChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setConductor(count);
        generarCampos('conductor', count, setConductorFields, setRelevoConductorFields);
    };

    const handleGuardaChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setGuarda(count);
        generarCampos('guarda', count, setGuardaFields, setRelevoGuardaFields);
    };

    const handlePilotoChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setPiloto(count);
        generarCampos('piloto', count, setPilotoFields, setRelevoPilotoFields);
    };

    const limpiarCampos = () => {
        setResponsable('');
        setTrabajo('');
        setSecciones([]);
        setConductor(0);
        setGuarda(0);
        setPiloto(0);
        setObservaciones('');
        setConductorFields([]);
        setRelevoConductorFields([]);
        setGuardaFields([]);
        setRelevoGuardaFields([]);
        setPilotoFields([]);
        setRelevoPilotoFields([]);
    };

   const imprimirPDF = () => {
    const doc = new jsPDF();
    doc.text('Formulario de Corrida', 10, 10);
    doc.text(`Operador Responsable: ${responsable}`, 10, 20);
    doc.text(`Nº de Trabajo: ${trabajo}`, 10, 30);
    doc.text(`Secciones: ${secciones.join(', ')}`, 10, 40);

    const yStart = 50;
    let yPos = yStart;

    const agregarDetallesPersonal = (tipo, fields, relevoFields) => {
        fields.forEach((field, index) => {
            const legajo = document.querySelector(`[name="${tipo}-legajo-${index}"]`).value;
            const nombre = document.querySelector(`[name="${tipo}-nombre-${index}"]`).value;
            const ingreso = document.querySelector(`[name="${tipo}-ingreso-${index}"]`).value;
            const dejada = document.querySelector(`[name="${tipo}-dejada-${index}"]`).value;
            doc.text(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1} - Legajo: ${legajo}, Nombre: ${nombre}, Ingreso: ${ingreso}, Dejada: ${dejada}`, 10, yPos);
            yPos += 10;

            const relevoLegajo = document.querySelector(`[name="relevo-${tipo}-legajo-${index}"]`).value;
            const relevoNombre = document.querySelector(`[name="relevo-${tipo}-nombre-${index}"]`).value;
            const relevoIngreso = document.querySelector(`[name="relevo-${tipo}-ingreso-${index}"]`).value;
            const relevoDejada = document.querySelector(`[name="relevo-${tipo}-dejada-${index}"]`).value;

            if (relevoLegajo || relevoNombre || relevoIngreso || relevoDejada) {
                doc.text(`Relevo ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1} - Legajo: ${relevoLegajo}, Nombre: ${relevoNombre}, Ingreso: ${relevoIngreso}, Dejada: ${relevoDejada}`, 10, yPos);
                yPos += 10;
            }
        });
    };

    agregarDetallesPersonal('conductor', conductorFields, relevoConductorFields);
    agregarDetallesPersonal('guarda', guardaFields, relevoGuardaFields);
    agregarDetallesPersonal('piloto', pilotoFields, relevoPilotoFields);

    doc.text(`Observaciones: ${observaciones}`, 10, yPos + 10);
    doc.save('corrida.pdf');
};

    return (
        <div>
            <header>
                <nav className="navbar navbar-dark bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">Mesa Personal</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item"><a className="nav-link" href="#/conductores/create">Registro Conductor</a></li>
                                <li className="nav-item"><a className="nav-link" href="#/guardastren/create">Registro GuardaTren</a></li>
                                <li className="nav-item"><a className="nav-link" href="#/corrida">Corridas</a></li>
                                <li className="nav-item"><a className="nav-link" href="#/listaspersonal">Listas</a></li>
                                <li className="nav-item"><a className="nav-link" href="#/administracion">Base de datos</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <h1>Personal para Corrida</h1>
                <div className="container">
                    <form id="formulario" className="row g-3" action="/register" method="POST">
                        <div className="d-flex justify-content-start">
                            <p>
                                <label>Operador responsable</label>
                                <input
                                    type="text"
                                    id="responsable"
                                    name="responsable"
                                    placeholder="Nombre y Apellido"
                                    pattern="[A-Z\s-a-z]{3,20}"
                                     value={userData ? userData.nombre : ''}
                                    onChange={(e) => setResponsable(e.target.value)}
                                    required
                                />
                            </p>
                            <p>
                                <label htmlFor="trabajo">Nº de Trabajo</label>
                                <input
                                    type="number"
                                    id="trabajo"
                                    name="trabajo"
                                    maxLength="6"
                                    className="input-number"
                                    value={trabajo}
                                    onChange={(e) => setTrabajo(e.target.value)}
                                    required
                                />
                            </p>
                        </div>
                        <div className="d-flex justify-content-start">
                            <br />
                            <h3>Sector que ocupa</h3>
                            <p>
                                <fieldset>
                                    <div className="d-flex justify-content-start">
                                        <li className="list-group-item">
                                            {['ap', 'bp', 'cp', 'dp', 'ep', 'rosario', 'ug', 'e1', 'e2', 'puerto'].map((section) => (
                                                <label key={section} htmlFor={`checkbox-${section}`}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="secciones"
                                                        value={section}
                                                        id={`checkbox-${section}`}
                                                        checked={secciones.includes(section)}
                                                        onChange={handleCheckboxChange}
                                                    /> {section.toUpperCase()}
                                                </label>
                                            ))}
                                        </li>
                                    </div>
                                </fieldset>
                            </p>
                            <br />
                        </div>
                        <div className="d-flex justify-content-start">
                            <p>
                                <label htmlFor="conductor">Nº de Conductores</label>
                                <input
                                    type="number"
                                    id="conductor"
                                    name="conductor"
                                    maxLength="2"
                                    className="input-number"
                                    value={conductor}
                                    onChange={handleConductorChange}
                                    required
                                />
                            </p>
                            <p>
                                <label htmlFor="guarda">Nº de Guardas</label>
                                <input
                                    type="number"
                                    id="guarda"
                                    name="guarda"
                                    maxLength="2"
                                    className="input-number"
                                    value={guarda}
                                    onChange={handleGuardaChange}
                                    required
                                />
                            </p>
                            <p>
                                <label htmlFor="piloto">Nº de Pilotos</label>
                                <input
                                    type="number"
                                    id="piloto"
                                    name="piloto"
                                    maxLength="2"
                                    className="input-number"
                                    value={piloto}
                                    onChange={handlePilotoChange}
                                    required
                                />
                            </p>
                        </div>
                        <div id="conductorCampos" className="row g-3">
                            {conductorFields}
                        </div>
                        <div id="guardaCampos" className="row g-3">
                            {guardaFields}
                        </div>
                        <div id="pilotoCampos" className="row g-3">
                            {pilotoFields}
                        </div>
                        <div>
                            <h4>Observaciones</h4>
                            <textarea
                                className="form-control"
                                id="observaciones"
                                name="observaciones"
                                rows="3"
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="col-md-12" style={{ display: 'inline-block' }}>
                            <button type="button" className="btn btn-success" id="btnImprimir" onClick={imprimirPDF}>Imprimir</button>
                            <button type="button" className="btn btn-warning" onClick={limpiarCampos} id="btnCancelar">Cancelar</button>
                        </div>
                    </form>
                </div>
            </main>

        </div>
    );
};






/*import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

export const Corrida = () => {
    const [observaciones, setObservaciones] = useState('');
    const [conductorCount, setConductorCount] = useState(0);
    const [guardaCount, setGuardaCount] = useState(0);
    const [pilotoCount, setPilotoCount] = useState(0);
    const [conductores, setConductores] = useState([]);
    const [guardas, setGuardas] = useState([]);
    const [pilotos, setPilotos] = useState([]);
    const [relevorConductores, setRelevorConductores] = useState([]);
    const [relevorGuardas, setRelevorGuardas] = useState([]);
    const [relevorPilotos, setRelevorPilotos] = useState([]);
    
    const [userData, setUserData]  = useState();
    useEffect(() => {
        const userDataFromStorage = localStorage.getItem('userData');
        if (userDataFromStorage) {
          setUserData(JSON.parse(userDataFromStorage));
        }
      }, []);
      // Otros efectos que dependan de userData
  useEffect(() => {
    // Lógica adicional que depende de userData
  }, [userData]);

    const generarCampos = (tipo, count, setCount, setPersonal, setPersonalRelevo) => {
        const personal = [];
        const personalRelevo = [];
        for (let i = 0; i < count; i++) {
            personal.push({ legajo: '', nombre: '', horaInicio: '', horaSalida: '' });
            personalRelevo.push({ legajo: '', nombre: '', horaInicio: '', horaSalida: '' });
        }
        setPersonal(personal);
        setPersonalRelevo(personalRelevo);
    };

    const handleConductorCount = (e) => {
        const count = parseInt(e.target.value);
        setConductorCount(count);
        generarCampos('conductor', count, setConductores, setRelevorConductores);
    };

    const handleGuardaCount = (e) => {
        const count = parseInt(e.target.value);
        setGuardaCount(count);
        generarCampos('guarda', count, setGuardas, setRelevorGuardas);
    };

    const handlePilotoCount = (e) => {
        const count = parseInt(e.target.value);
        setPilotoCount(count);
        generarCampos('piloto', count, setPilotos, setRelevorPilotos);
    };

    const imprimirPDF = () => {
        const documento = new jsPDF();
        documento.setFontSize(12);

        // Agregar Encabezado
        documento.text(20, 10, "Trenes Argentinos");
        documento.line(20, 10, 100, 10); // (x1, y1, x2, y2)
        let yPosition = 20;

        const responsable = document.getElementById('responsable').value.trim();
        const numTrabajo = document.getElementById('trabajo').value.trim();

        if (!responsable || !numTrabajo) {
            alert('Por favor, ingrese el Responsable y/o el Número de Trabajo.');
            return;
        }

        const secciones = Array.from(document.querySelectorAll('input[name="secciones"]:checked')).map(seccion => seccion.value);

        // Función para agregar detalles al PDF si el campo no está vacío
        const agregarDetalle = (texto) => {
            if (texto) {
                documento.text(20, yPosition, texto);
                yPosition += 10;
            }
        }

        agregarDetalle(`Operador de Personal: ${responsable}`);
        agregarDetalle(`Número de Trabajo: ${numTrabajo}`);
        agregarDetalle(`Secciones a ocupar : ${secciones.join(', ')}`);

        const agregarDetallesPersonal = (tipo, personal, personalRelevo) => {
            personal.forEach((p, i) => {
                let detalle = `${tipo} ${i + 1}:`;
                if (p.legajo) detalle += ` Legajo ${p.legajo},`;
                if (p.nombre) detalle += ` Nombre ${p.nombre}`;
                if (p.horaInicio) detalle += `, Hora de Inicio ${p.horaInicio}`;
                if (p.horaSalida) detalle += `, Hora de Salida ${p.horaSalida}`;
                agregarDetalle(detalle);

                const relevo = personalRelevo[i];
                if (relevo.legajo || relevo.nombre || relevo.horaInicio || relevo.horaSalida) {
                    let detalleRelevo = `Relevo de ${tipo} ${i + 1}:`;
                    if (relevo.legajo) detalleRelevo += ` Legajo ${relevo.legajo},`;
                    if (relevo.nombre) detalleRelevo += ` Nombre ${relevo.nombre}`;
                    if (relevo.horaInicio) detalleRelevo += `, Hora de Inicio ${relevo.horaInicio}`;
                    if (relevo.horaSalida) detalleRelevo += `, Hora de Salida ${relevo.horaSalida}`;
                    agregarDetalle(detalleRelevo);
                }
            });
        };

        agregarDetallesPersonal('Conductor', conductores, relevorConductores);
        agregarDetallesPersonal('Guarda', guardas, relevorGuardas);
        agregarDetallesPersonal('Piloto', pilotos, relevorPilotos);

        // Agregar sección de observaciones
        if (observaciones) {
            agregarDetalle('Observaciones: ' + observaciones);
        }

        // Cambiar el estilo para el pie de página
        documento.setFontStyle("italic");

        // Agregar Pie de Página
        documento.text(20, documento.internal.pageSize.height - 20, "Generado de la Mesa de Personal.");

        documento.save('formulario.pdf');
    }

    const limpiarCampos = () => {
        setConductorCount(0);
        setGuardaCount(0);
        setPilotoCount(0);
        setConductores([]);
        setGuardas([]);
        setPilotos([]);
        setRelevorConductores([]);
        setRelevorGuardas([]);
        setRelevorPilotos([]);
        setObservaciones('');

        const elementos = document.querySelectorAll('input[type="number"], input[type="text"]');
        elementos.forEach(elemento => {
            elemento.value = "";
        });
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    };
    return (
        <main>
            <h1>Personal para Corrida</h1>
            <div className="container">
                <form id="formulario" className="row g-3" action="/register" method="POST">
                    
                    <div className="d-flex justify-content-start">
                        <p>
                            <input type="text" className='form-control' id="responsable" value={userData ? userData.nombre : ''} name="responsable" placeholder="Nombre y Apellido" pattern="[A-Z\sa-z]{3,20}" required />
                            <label htmlFor="floatingInputDisabled responsable">Operador responsable</label>
                        </p>
                        <p>
                            <label htmlFor="trabajo">Nº de Trabajo</label>
                            <input type="number" id="trabajo" name="trabajo" maxLength="6" className="input-number" required />
                        </p>
                    </div>
                    <div className="d-flex justify-content-start">
                        <br />
                        <h3>Sector que ocupa</h3>
                        <p>
                            <fieldset>
                                <div className="d-flex justify-content-start">
                                    <li className="list-group-item">
                                        <label htmlFor="checkbox-ap">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="ap" id="checkbox-secciones flexCheckDefault" /> AP
                                        </label>
                                        <label htmlFor="checkbox-bp">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="bp" id="checkbox-secciones flexCheckDefault" /> BP
                                        </label>
                                        <label htmlFor="checkbox-cp">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="cp" id="checkbox-secciones flexCheckDefault" /> CP
                                        </label>
                                        <label htmlFor="checkbox-dp">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="dp" id="checkbox-secciones flexCheckDefault" /> DP
                                        </label>
                                        <label htmlFor="checkbox-ep">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="ep" id="checkbox-secciones flexCheckDefault" /> EP
                                        </label>
                                        <label htmlFor="checkbox-rosario">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="rosario" id="checkbox-secciones flexCheckDefault" /> ROSARIO
                                        </label>
                                        <label htmlFor="checkbox-ug">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="ug" id="checkbox-secciones flexCheckDefault" /> UGARTECHE
                                        </label>
                                        <label htmlFor="checkbox-e1">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="e1" id="checkbox-secciones flexCheckDefault" /> Plat.1-4
                                        </label>
                                        <label htmlFor="checkbox-e2">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="e2" id="checkbox-secciones flexCheckDefault" /> Plat.4-8
                                        </label>
                                        <label htmlFor="checkbox-puerto">
                                            <input className="form-check-input" type="checkbox" name="secciones" value="puerto" id="checkbox-secciones flexCheckDefault" /> PUERTO/FEPSA
                                        </label>
                                    </li>
                                </div>
                            </fieldset>
                        </p>
                        <br />
                    </div>
    
                    <div className="d-flex justify-content-start">
                        <p>
                            <label htmlFor="conductor">Nº de Conductores</label>
                            <input type="number" id="conductor" name="conductor" maxLength="2" className="input-number" onChange={handleConductorCount} value={conductorCount} required />
                        </p>
                        <p>
                            <label htmlFor="guarda">Nº de Guardas</label>
                            <input type="number" id="guarda" name="guarda" maxLength="2" className="input-number" onChange={handleGuardaCount} value={guardaCount} required />
                        </p>
                        <p>
                            <label htmlFor="piloto">Nº de Pilotos</label>
                            <input type="number" id="piloto" name="piloto" maxLength="2" className="input-number" onChange={handlePilotoCount} value={pilotoCount} required />
                        </p>
                    </div>
    
                    {conductores.map((conductor, index) => (
                        <div key={`conductor-${index}`} className="row g-3">
                            <h4>Conductor {index + 1}</h4>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control input-number conductor-legajo"
                                        name={`conductor_legajo[]`}
                                        maxLength={6}
                                        id={`floatingInputGrid_conductor_legajo_${index}`}
                                        data-index={index}
                                        value={conductor.legajo}
                                        onChange={(e) => {
                                            const updatedConductores = [...conductores];
                                            updatedConductores[index].legajo = e.target.value;
                                            setConductores(updatedConductores);
                                        }}
                                    />
                                    <label htmlFor={`floatingInputGrid_conductor_legajo_${index}`}>Legajo</label>
                                </div>

                            </div>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control input-text conductor-nombre"
                                        name={`conductor_nombre[]`}
                                        id={`floatingInputGrid_conductor_nombre_${index}`}
                                        data-index={index}
                                        value={conductor.nombre}
                                        onChange={(e) => {
                                            const updatedConductores = [...conductores];
                                            updatedConductores[index].nombre = e.target.value;
                                            setConductores(updatedConductores);
                                        }}
                                    />
                                    <label htmlFor={`floatingInputGrid_conductor_nombre_${index}`}>Nombre</label>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <input
                                        type="time"
                                        className="form-control input-time conductor-horaInicio"
                                        name={`conductor_horaInicio[]`}
                                        id={`floatingInputGrid_conductor_horaInicio_${index}`}
                                        data-index={index}
                                        value={conductor.horaInicio}
                                        onChange={(e) => {
                                            const updatedConductores = [...conductores];
                                            updatedConductores[index].horaInicio = e.target.value;
                                            setConductores(updatedConductores);
                                        }}
                                    />
                                    <label htmlFor={`floatingInputGrid_conductor_horaInicio_${index}`}>Hora de Ingreso</label>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <input
                                        type="time"
                                        className="form-control input-time conductor-horaSalida"
                                        name={`conductor_horaSalida[]`}
                                        id={`floatingInputGrid_conductor_horaSalida_${index}`}
                                        data-index={index}
                                        value={conductor.horaSalida}
                                        onChange={(e) => {
                                            const updatedConductores = [...conductores];
                                            updatedConductores[index].horaSalida = e.target.value;
                                            setConductores(updatedConductores);
                                        }}
                                    />
                                    <label htmlFor={`floatingInputGrid_conductor_horaSalida_${index}`}>Hora de Salida</label>
                                </div>
                            </div>
                        </div>
                    ))}
    
                    {relevorConductores.map((relevo, index) => (
                        <div key={`relevo-conductor-${index}`} className="row g-3">
                            <h5>Relevo de Conductor {index + 1}</h5>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control input-number relevo-conductor-legajo"
                                        name={`relevo_conductor_legajo[]`}
                                        maxLength={6}
                                        id={`floatingInputGrid_relevo_conductor_legajo_${index}`}
                                        data-index={index}
                                        value={relevo.legajo}
                                        onChange={(e) => {
                                            const updatedRelevorConductores = [...relevorConductores];
                                            updatedRelevorConductores[index].legajo = e.target.value;
                                            setRelevorConductores(updatedRelevorConductores);
                                        }}
                                    />
                                    <label htmlFor={`floatingInputGrid_relevo_conductor_legajo_${index}`}>Legajo</label>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control input-text relevo-conductor-nombre"
                                        name={`relevo_conductor_nombre[]`}
                                        id={`floatingInputGrid_relevo_conductor_nombre_${index}`}
                                        data-index={index}
                                        value={relevo.nombre}
                                        onChange={(e) => {
                                            const updatedRelevorConductores = [...relevorConductores];
                                            updatedRelevorConductores[index].nombre = e.target.value;
                                            setRelevorConductores(updatedRelevorConductores);
                                        }}
                                    />
                                    <label htmlFor={`floatingInputGrid_relevo_conductor_nombre_${index}`}>Nombre</label>
                                </div>
                            </div>
                            
                        </div>
                    ))}
    
                    {relevorConductores.map((relevo, index) => (
                        <div key={`relevo-conductor-${index}`} className="row g-3">
                            <h5>Relevo de Conductor {index + 1}</h5>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control input-number relevo-conductor-legajo"
                                        name={`relevo_conductor_legajo[]`}
                                        maxLength={6}
                                        id={`floatingInputGrid_relevo_conductor_legajo_${index}`}
                                        data-index={index}
                                        value={relevo.legajo}
                                        onChange={(e) => {
                                            const updatedRelevorConductores = [...relevorConductores];
                                            updatedRelevorConductores[index].legajo = e.target.value;
                                            setRelevorConductores(updatedRelevorConductores);
                                        }}
                                    />
                                    <label htmlFor={`floatingInputGrid_relevo_conductor_legajo_${index}`}>Legajo</label>
                                </div>
                            </div>
                            
                    ))}
    
                    
    
                </form>
            </div>
            <div>
    <h4>Observaciones</h4>
    <textarea
        className="form-control"
        id="observaciones"
        name="observaciones"
        rows="3"
        value={observaciones}
        onChange={(e) => setObservaciones(e.target.value)}
    />
</div>
<div className="col-md-12" style={{ display: 'inline-block' }}>
    <button
        type="button"
        className="btn btn-success"
        id="btnImprimir"
        onClick={imprimirPDF}
    >
        Imprimir
    </button>
    <button
        type="button"
        className="btn btn-warning"
        onClick={limpiarCampos}
        id="btnCancelar"
    >
        Cancelar
    </button>
</div>
</main>
  )};*/