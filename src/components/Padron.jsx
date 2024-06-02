import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

export const Padron = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("conductores");
    const [results, setResults] = useState([]);

    // Firestore collections
    const conductoresCollection = collection(db, "conductores");
    const guardastrenesCollection = collection(db, "guardastren");

    const handleSearch = async () => {
        let collectionRef;
        if (searchCategory === "conductores") {
            collectionRef = conductoresCollection;
        } else if (searchCategory === "guardas") {
            collectionRef = guardastrenesCollection;
        }

        if (collectionRef) {
            const q = query(collectionRef, where("legajo", "==", searchTerm));
            const querySnapshot = await getDocs(q);
            setResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
    };

    return (
        <div className="padron-container">
            <div className="search-controls">
                <input
                    type="text"
                    placeholder="Buscar por legajo"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                >
                    <option value="conductores">Conductores</option>
                    <option value="guardas">Guardas</option>
                </select>
                <button onClick={handleSearch}>Buscar</button>
            </div>
            <div className="search-results">
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
                    <p>No se encontraron resultados</p>
                )}
            </div>
        </div>
    );
};


