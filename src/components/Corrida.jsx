import React, { useState, useEffect, useRef } from 'react';
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
    const conductorRefs = useRef([]);
    const relevoConductorRefs = useRef([]);
    const guardaRefs = useRef([]);
    const relevoGuardaRefs = useRef([]);
    const pilotoRefs = useRef([]);
    const relevoPilotoRefs = useRef([]);

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

    const fields = [];
    const relevoFields = [];
    const generarCampos = (type, count) => {
        for (let i = 0; i < count; i++) {
            fields.push(
                <div key={`${type}-${i}`} className="row g-3" ref={(el) => type === 'conductor' ? (conductorRefs.current[i] = el) : type === 'guarda' ? (guardaRefs.current[i] = el) : (pilotoRefs.current[i] = el)}>
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Legajo`}</label>
                        <input type="number" className="form-control" id="legajo" placeholder="Legajo" />
                    </div>
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Nombre`}</label>
                        <input type="text" className="form-control" name={`${type}-nombre-${i}`} placeholder="Nombre" />
                    </div>
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Ingreso`}</label>
                        <input type="time" className="form-control" name={`${type}-ingreso-${i}`} placeholder="Horario de Ingreso" />
                    </div>
                    <div className="col-md-3">
                        <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Dejada`}</label>
                        <input type="time" className="form-control" name={`${type}-dejada-${i}`} placeholder="Horario de Dejada" />
                    </div>
                </div>
            );
            relevoFields.push(
                <div key={`relevo-${type}-${i}`} className="row g-3" ref={(el) => type === 'conductor' ? (relevoConductorRefs.current[i] = el) : type === 'guarda' ? (relevoGuardaRefs.current[i] = el) : (relevoPilotoRefs.current[i] = el)}>
                    <div className="col-md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Legajo`}</label>
                        <input type="number" className="form-control" name={`relevo-${type}-legajo-${i}`} placeholder="Legajo" />
                    </div>
                    <div className="col-md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Nombre`}</label>
                        <input type="text" className="form-control" name={`relevo-${type}-nombre-${i}`} placeholder="Nombre" />
                    </div>
                    <div className="col-md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Ingreso`}</label>
                        <input type="time" className="form-control" name={`relevo-${type}-ingreso-${i}`} placeholder="Horario de Ingreso" />
                    </div>
                    <div className="col -md-3">
                        <label>{`Relevo ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1} - Horario de Dejada`}</label>
                        <input type="time" className="form-control" name={`relevo-${type}-dejada-${i}`} placeholder="Horario de Dejada" />
                    </div>
                </div>
        
            );
            
        }
        switch (type) {
            case 'conductor':
                setConductorFields(fields);
                setRelevoConductorFields(relevoFields);
                break;
            case 'guarda':
                setGuardaFields(fields);
                setRelevoGuardaFields(relevoFields);
                break;
            case 'piloto':
                setPilotoFields(fields);
                setRelevoPilotoFields(relevoFields);
                break;
            default:
                break;
        }       
        

    };

    const handleConductorChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setConductor(count);
        generarCampos('conductor', count);
    };

    const handleGuardaChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setGuarda(count);
        generarCampos('guarda', count);
    };

    const handlePilotoChange = (e) => {
        const count = parseInt(e.target.value) || 0;
        setPiloto(count);
        generarCampos('piloto', count);
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
    doc.text(`Operador Responsable: ${userData.nombre}`, 10, 20);
    doc.text(`Nº de Trabajo: ${trabajo}`, 10, 30);
    doc.text(`Secciones: ${secciones.join(', ')}`, 10, 40);

    const yStart = 50;
    let yPos = yStart;

    
        
    const agregarDetallesPersonal = (tipo, fields, relevoFields, refs, relevoRefs) => {
        fields.forEach((field, index) => {
            const legajoInput = refs.current[index].querySelector('input[id="legajo"]');
        const nombreInput = refs.current[index].querySelector('input[name^="' + tipo + '-nombre"]');
        const ingresoInput = refs.current[index].querySelector('input[name^="' + tipo + '-ingreso"]');
        const dejadaInput = refs.current[index].querySelector('input[name^="' + tipo + '-dejada"]');

        const legajo = legajoInput?.value ?? '';
        const nombre = nombreInput?.value ?? '';
        const ingreso = ingresoInput?.value ?? '';
        const dejada = dejadaInput?.value ?? '';

            /*const legajo = refs.current[index]?.value ?? '';
            const nombre = refs.current[index]?.nextElementSibling?.value ?? '';
            const ingreso = refs.current[index]?.nextElementSibling?.nextElementSibling?.value ?? ''; // Obtener el valor del campo de entrada de ingreso
            const dejada = refs.current[index]?.nextElementSibling?.nextElementSibling?.nextElementSibling?.value ?? ''; // Obtener el valor del campo de entrada de dejada
*/
            console.log(legajo)

            let conductorTexto = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1}:`;
            doc.text(conductorTexto, 10, yPos);
            yPos += 5;
    
            // Detalles del conductor
            doc.text(`Legajo: ${legajo}`, 15, yPos);
            yPos += 5;
            doc.text(`Nombre: ${nombre}`, 15, yPos);
            yPos += 5;
            doc.text(`Ingreso: ${ingreso}`, 15, yPos);
            yPos += 5;
            doc.text(`Dejada: ${dejada}`, 15, yPos);
            yPos += 10;

            if (relevoFields[index]) {
                const relevoLegajoInput = relevoRefs.current[index].querySelector('input[name^="relevo-' + tipo + '-legajo"]');
            const relevoNombreInput = relevoRefs.current[index].querySelector('input[name^="relevo-' + tipo + '-nombre"]');
            const relevoIngresoInput = relevoRefs.current[index].querySelector('input[name^="relevo-' + tipo + '-ingreso"]');
            const relevoDejadaInput = relevoRefs.current[index].querySelector('input[name^="relevo-' + tipo + '-dejada"]');

            const relevoLegajo = relevoLegajoInput?.value ?? '';
            const relevoNombre = relevoNombreInput?.value ?? '';
            const relevoIngreso = relevoIngresoInput?.value ?? '';
            const relevoDejada = relevoDejadaInput?.value ?? '';
                
                /*const relevoLegajo = relevoRefs.current[index]?.value ?? '';
            const relevoNombre = relevoRefs.current[index]?.nextElementSibling?.value ?? '';
            const relevoIngreso = relevoRefs.current[index]?.nextElementSibling?.nextElementSibling?.value ?? ''; // Obtener el valor del campo de entrada de ingreso
            const relevoDejada = relevoRefs.current[index]?.nextElementSibling?.nextElementSibling?.nextElementSibling?.value ?? ''; // Obtener el valor del campo de entrada de dejada
*/

            if (relevoLegajo || relevoNombre || relevoIngreso || relevoDejada) {
                // Texto del relevo
                let relevoTexto = `Relevo ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1}:`;
                doc.text(relevoTexto, 10, yPos);
                yPos += 5;
    
                // Detalles del relevo
                doc.text(`Legajo: ${relevoLegajo}`, 15, yPos);
                yPos += 5;
                doc.text(`Nombre: ${relevoNombre}`, 15, yPos);
                yPos += 5;
                doc.text(`Ingreso: ${relevoIngreso}`, 15, yPos);
                yPos += 5;
                doc.text(`Dejada: ${relevoDejada}`, 15, yPos);
                yPos += 10;
            }
        }
        })
        
        };
    

        agregarDetallesPersonal('conductor', conductorFields, relevoConductorFields, conductorRefs, relevoConductorRefs);
        agregarDetallesPersonal('guarda', guardaFields, relevoGuardaFields, guardaRefs, relevoGuardaRefs);
        agregarDetallesPersonal('piloto', pilotoFields, relevoPilotoFields, pilotoRefs, relevoPilotoRefs);

    doc.text(`Observaciones: ${observaciones}`, 10, yPos + 10);
    doc.save('corrida.pdf');
};

    return (
        <div className='container-fluid'>
            

            <main>
                <h1>Personal para Corrida</h1>
                <div className="container-fluid">
                    <form id="formulario" className="row g-3" action="/register" method="POST">
                        <div className="d-flex justify-content-start">
                            <p>
                                <label>Operador responsable</label>
                                <input
                                    type="text"
                                    id="responsable"
                                    name="responsable"
                                    placeholder="Nombre y Apellido"
                                    value={userData ? userData.nombre : ""}
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
                        <div id="relevoConductorCampos" className="row g-3">
                            {relevoConductorFields}
                        </div>
                        <div id="guardaCampos" className="row g-3">
                            {guardaFields}
                        </div>
                        <div id="relevoGuardaCampos" className="row g-3">
                            {relevoGuardaFields}
                        </div>
                        <div id="pilotoCampos" className="row g-3">
                            {pilotoFields}
                        </div>
                        <div id="relevoPilotoCampos" className="row g-3">
                            {relevoPilotoFields}
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