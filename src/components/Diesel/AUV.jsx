import React from 'react';
import { Container } from 'react-bootstrap';

export const CargaAUV = () => {
  // Reemplaza con la URL real de la carga de AUV
  const urlAUV = "https://tu-url-de-carga-auv.com"; 

  return (
    <Container fluid className="p-0" style={{ height: '100vh', paddingTop: '60px' }}>
      <iframe
        src={urlAUV}
        title="Carga de AUV"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allow="geolocation; microphone; camera" // Opcional, por si la web externa los requiere
      />
    </Container>
  );
};