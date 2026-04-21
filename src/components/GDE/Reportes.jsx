import React from 'react';
import { Container, Card } from 'react-bootstrap';

export const Dashboard = () => {
  return (
    <Container fluid className="mt-5" style={{ paddingTop: '30px' }}>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white fw-bold d-flex justify-content-between align-items-center">
          <span>Tablero de Control - Looker Studio</span>
          <small>Grupo de Estudio GdE</small>
        </Card.Header>
        <Card.Body className="p-0">
          {/* Usamos un div con altura calculada para que el reporte ocupe casi toda la pantalla */}
          <div style={{ width: '100%', height: '85vh', overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://datastudio.google.com/embed/reporting/8cb76e4e-20d8-419e-bb39-0a941d7afbd0/page/C0OvF"
              // Corregimos las propiedades para React:
              frameBorder="0" 
              style={{ border: 0 }}
              allowFullScreen={true}
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};