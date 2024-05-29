import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { UserContext } from './UserContext';

export const NavbarComponent = ({ handleLogout }) => {
  const { userData } = useContext(UserContext);
 return (
  <>
  {[ 'sm'].map((expand) => (
    <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
      <Container fluid>
        <Navbar.Brand href="#"><strong>PCT Mitre ||</strong> {userData && userData.nombre && <> ¡Hola <em>{userData.nombre}!</em> </>}</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              PCT Mitre
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link  href="/login">Inicio</Nav.Link>
                <Nav.Link  href="#/emergencias">Emergencias</Nav.Link>
              <NavDropdown
                title="Personal"
                id={`offcanvasNavbarDropdown-expand-${expand}`}
              >
                <NavDropdown.Item href="#/corrida">CorridaTrenes</NavDropdown.Item>
              <NavDropdown.Item href="#/listaspersonal">ListasPersonal</NavDropdown.Item>
              <NavDropdown.Item href="#/conductores/create">Registrar Conductores</NavDropdown.Item>
              <NavDropdown.Item href="#/guardastren/create">Registrar Guardas</NavDropdown.Item>
              <NavDropdown.Divider />
              {userData && userData.nombre && userData.rol && userData.rol.administrador && (
              <NavDropdown.Item href="#/administracion">
              
                Administracion
              
              </NavDropdown.Item>
            )}
              </NavDropdown>
            </Nav>
            
            <Button variant="outline-danger" size='mg' href="/" onClick={handleLogout}>
                Salir
              </Button>
             </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  ))}
</>
);
    
  
};


