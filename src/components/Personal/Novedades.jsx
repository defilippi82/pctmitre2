import React, { useContext } from 'react';
import { NovedadesContext } from '../context/NovedadesContext';

const Novedades = () => {
    const { novedades } = useContext(NovedadesContext);

    return (
        <div>
            <h2>Novedades</h2>
            <ul>
                {novedades.map((novedad) => (
                    <li key={novedad.id}>{novedad.texto}</li>
                ))}
            </ul>
        </div>
    );
};

export default Novedades;
