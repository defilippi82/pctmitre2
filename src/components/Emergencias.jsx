import axios from 'axios';
import { useState } from 'react';

export const Emergencias = () => {
  const [calle, setCalle] = useState('');
  const [altura, setAltura] = useState('');
  const [datos, setDatos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('https://datosabiertos-usig-apis.buenosaires.gob.ar/datos_utiles?', {
        params: {
          calle,
          altura,
        },
      });
      console.log('Datos recibidos:', response.data);
      setDatos(response.data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          placeholder="Ingrese la calle"
        />
        <input
          type="text"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Ingrese el número"
        />
        <button type="submit">Buscar</button>
      </form>

      {datos && (
        <div>
          <h2>Datos encontrados:</h2>
          <p>Comuna: {datos.comuna}</p>
          <p>Barrio: {datos.barrio}</p>
          <p>Área Hospitalaria: {datos.area_hospitalaria}</p>
          <p>Comisaría Vecinal: {datos.comisaria_vecinal}</p>
        </div>
      )}
    </div>
  );
};