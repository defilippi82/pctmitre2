import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";


/* SWEET ALERT */
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export const Administracion = () => {
    const [conductores, setConductores] = useState([]);
    const [guardatrenes, setGuardatrenes] = useState([]);
    const [operadores, setOperadores] = useState([]);
    const [currentView, setCurrentView] = useState(null); // 'conductores', 'operadores', 'operadores'
    const navigate = useNavigate();

    // Firestore collections
    const conductoresCollection = collection(db, "conductores");
    const guardatrenesCollection = collection(db, "guardatren");
    const operadoresCollection = collection(db, "operadores");

    useEffect(() => {
        if (currentView === 'conductores') {
            fetchConductores();
        } else if (currentView === 'operadores') {
            fetchOperadores();
        }else if (currentView === 'guardatren') {
            fetchGuardatren();
        }
    }, [currentView]);

    const fetchConductores = async () => {
        try {
            const data = await getDocs(conductoresCollection);
            setConductores(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching conductores:", error);
        }
    };

    const fetchGuardatren = async () => {
        try {
            const data = await getDocs(guardatrenesCollection);
            setGuardatrenes(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching guarda Trenes:", error);
        }
    };

    const fetchOperadores = async () => {
        try {
            const data = await getDocs(operadoresCollection);
            setOperadores(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching operadores:", error);
        }
    };

    const formatDate = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleDateString(); // Puedes ajustar el formato según sea necesario
        }
        return "";
    };

    const confirmDelete = async (collectionName, id, setData, data) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            setData(data.filter(item => item.id !== id));
            MySwal.fire({
                title: "¡Borrado!",
                text: "El registro ha sido eliminado.",
                icon: "success",
                showConfirmButton: true
            });
        } catch (error) {
            MySwal.fire({
                title: "Error",
                text: "Ha ocurrido un error al intentar borrar el registro.",
                icon: "error"
            });
        }
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button className="btn btn-secondary mt-2 mb-2" onClick={() => setCurrentView('conductores')}>Ver Conductores</button>
                            <button className="btn btn-secondary mt-2 mb-2" onClick={() => setCurrentView('guardatren')}>Ver GuardaTrenes</button>
                            <button className="btn btn-secondary mt-2 mb-2" onClick={() => setCurrentView('operadores')}>Ver Operadores</button>
                            
                        </div>
                        {currentView === 'conductores' && (
                            <div>
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <Link to="/conductores/create" className="btn btn-secondary mt-2 mb-2">CREAR CONDUCTOR</Link>
                                </div>
                                <table className="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Legajo</th>
                                            <th>Servicio</th>
                                            <th>Nº Orden</th>
                                            <th>Tarea</th>
                                            <th>DNI</th>
                                            <th>Nacimiento</th>
                                            <th>Ingreso</th>
                                            <th>Cupon</th>
                                            <th>Apto Físico</th>
                                            <th>Base</th>
                                            <th>Email</th>
                                            <th>Dirección</th>
                                            <th>Localidad</th>
                                            <th>Provincia</th>
                                            <th>Piso</th>
                                            <th>Depto</th>
                                            <th>CP</th>
                                            <th>Tel</th>
                                            <th>Secciones</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conductores.map((conductor) => (
                                            <tr key={conductor.id}>
                                                <td>{conductor.nombre}</td>
                                                <td>{conductor.legajo}</td>
                                                <td>{conductor.servicio}</td>
                                                <td>{conductor.orden}</td>
                                                <td>{conductor.tarea}</td>
                                                <td>{conductor.dni}</td>
                                                <td>{conductor.nacimiento}</td>
                                                <td>{conductor.ingreso}</td>
                                                <td>{conductor.cupon}</td>
                                                <td>{conductor.apto}</td>
                                                <td>{conductor.base}</td>
                                                <td>{conductor.email}</td>
                                                <td>{conductor.direccion}</td>
                                                <td>{conductor.localidad}</td>
                                                <td>{conductor.provincia}</td>
                                                <td>{conductor.piso}</td>
                                                <td>{conductor.dpto}</td>
                                                <td>{conductor.cp}</td>
                                                <td>{conductor.tel}</td>
                                                <td>{conductor.secciones}</td>
                                                <td>
                                                    <Link to={`/conductores/edit/${conductor.id}`} className="btn btn-light"><i className="fa-solid fa-pen-to-square"></i></Link>
                                                    <button className="btn btn-danger" onClick={() => confirmDelete('conductores', conductor.id, setConductores, conductores)}><i className="fa-solid fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {currentView === 'guardatren' && (
                            <div>
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <Link to="/guardatren/create" className="btn btn-secondary mt-2 mb-2">Crear Guardatren</Link>
                                </div>
                                <table className="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Legajo</th>
                                            <th>Servicio</th>
                                            <th>Email</th>
                                            <th>Dirección</th>
                                            <th>Localidad</th>
                                            <th>Provincia</th>
                                            <th>Piso</th>
                                            <th>Depto</th>
                                            <th>CP</th>
                                            <th>Codigo Pais</th>
                                            <th>Teléfono</th>
                                            <th>Alt Codigo Pais</th>
                                            <th>Alt Teléfono</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {guardatrenes.map((guardatren) => (
                                            <tr key={guardatren.id}>
                                                <td>{guardatren.nombre}</td>
                                                <td>{guardatren.legajo}</td>
                                                <td>{guardatren.servicio}</td>
                                                <td>{guardatren.email}</td>
                                                <td>{guardatren.direccion}</td>
                                                <td>{guardatren.localidad}</td>
                                                <td>{guardatren.provincia}</td>
                                                <td>{guardatren.piso}</td>
                                                <td>{guardatren.dpto}</td>
                                                <td>{guardatren.cp}</td>
                                                <td>{guardatren.codigoPais}</td>
                                                <td>{guardatren.tel}</td>
                                                <td>{guardatren.altCodigoPais}</td>
                                                <td>{guardatren.altTel}</td>
                                                <td>
                                                    <Link to={`/guardatren/edit/${guardatren.id}`} className="btn btn-light"><i className="fas fa-edit"></i></Link>
                                                    <button className="btn btn-danger" onClick={() => confirmDelete('guardatren', guardatren.id, setGuardatrenes, guardatren)}><i className="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {currentView === 'operadores' && (
                            <div>
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    <Link to="/operadores/create" className="btn btn-secondary mt-2 mb-2">Crear Operador</Link>
                                </div>
                                <table className="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Legajo</th>
                                            <th>Email</th>
                                            <th>Rol</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {operadores.map((operador) => (
                                            <tr key={operador.id}>
                                                <td>{operador.nombre}</td>
                                                <td>{operador.legajo}</td>
                                                <td>{operador.email}</td>
                                                <td>{operador.rol.valor}</td>
                                                <td>
                                                    <Link to={`/operadores/edit/${operador.id}`} className="btn btn-light"><i className="fa-solid fa-pen-to-square"></i></Link>
                                                    <button className="btn btn-danger" onClick={() => confirmDelete('operadores', operador.id, setOperadores, operadores)}><i className="fa-solid fa-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
