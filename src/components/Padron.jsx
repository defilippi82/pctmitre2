import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

export const Padron = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("conductores");
    const [searchType, setSearchType] = useState("legajo");
    const [base, setBase] = useState("");
    const [results, setResults] = useState([]);

    // Firestore collections
    const conductoresCollection = collection(db, "conductores");
    const guardatrenesCollection = collection(db, "guardatren");

    const handleSearch = async () => {
        let collectionRef;
        if (searchCategory === "conductores") {
            collectionRef = conductoresCollection;
        } else if (searchCategory === "guardas") {
            collectionRef = guardatrenesCollection;
        }

        if (collectionRef) {
            let q;
            if (searchType === "legajo") {
                q = query(collectionRef, where("legajo", "==", searchTerm));
            } else if (searchType === "apellido") {
                q = query(collectionRef, where("apellido", "==", searchTerm.toUpperCase()));
            } else if (searchType === "base") {
                q = query(collectionRef, where("base", "==", base));
            }

            const querySnapshot = await getDocs(q);
            setResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className="form-select"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="legajo">Legajo</option>
                            <option value="apellido">Apellido</option>
                            <option value="base">Base</option>
                        </select>
                        <button className="btn btn-primary" onClick={handleSearch}>
                            Buscar
                        </button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <select
                            className="form-select"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        >
                            <option value="conductores">Conductores</option>
                            <option value="guardas">Guardas</option>
                        </select>
                        {searchType === "base" && (
                            <select
                                className="form-select"
                                value={base}
                                onChange={(e) => setBase(e.target.value)}
                            >
                                <option value="">Seleccionar base</option>
                                <option value="suarez">Suarez</option>
                                <option value="victoria">Victoria</option>
                                <option value="retiro">Retiro</option>
                            </select>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {results.length > 0 ? (
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Legajo</th>
                                    <th>Servicio</th>
                                    <th>Email</th>
                                    {/* Otros campos relevantes */}
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => (
                                    <tr key={result.id}>
                                        <td>{result.nombre}</td>
                                        <td>{result.legajo}</td>
                                        <td>{result.servicio}</td>
                                        <td>{result.email}</td>
                                        {/* Otros campos relevantes */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center">No se encontraron resultados</p>
                    )}
                </div>
            </div>
        </div>
    );
};