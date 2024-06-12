import axios from 'axios';
import { useState, useEffect } from 'react';

export const Salud = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://datosabiertos-usig-apis.buenosaires.gob.ar/datos_utiles');
        setDatos(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Aquí puedes renderizar los datos obtenidos */}
    </div>
  );
};