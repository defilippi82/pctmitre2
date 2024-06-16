import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { UserContext } from '../Services/UserContext';

export const NavbarComponent = ({ handleLogout }) => {
  const { userData } = useContext(UserContext);
  
 
  return (
  <>
  {[ 'xxl'].map((expand) => (
    <Navbar key={expand} expand={expand} className="bg-body-tertiary xxl-3">
      <Container fluid>
        <Navbar.Brand href="#"><strong>PCT Mitre ||</strong> {userData && userData.nombre && <> ¡Hola <em fluid>{userData.nombre}!</em> </>}</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas id={`offcanvasNavbar-expand-${expand}`} aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              PCT Mitre
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link  href="/novedades">Inicio</Nav.Link>
                          
            {userData && userData.nombre &&  (userData.rol.valor === 'administrador'|| userData.rol.valor === 'emergencia')  && (
              <NavDropdown title="Emergencias" id={`offcanvasNavbarDropdown-expand-${expand}`} >
              
              <NavDropdown.Item href="#/partes">Partes Regularidad</NavDropdown.Item>
              
              
              <NavDropdown.Item href="#/barreras">Barreras</NavDropdown.Item>
              
              <NavDropdown.Item href="#/art">ART</NavDropdown.Item>
              
              <NavDropdown.Item href="#/emergencias">Telefonos Utiles</NavDropdown.Item>
              
              <NavDropdown.Item href="#/padron">Padron</NavDropdown.Item>
              
              
              <NavDropdown.Divider />
              {userData && userData.nombre && userData.rol.valor === 'administrador' && (
              <NavDropdown.Item href="#/administracion"> Administracion </NavDropdown.Item>
              )}
              </NavDropdown>
            )}
            {userData && userData.nombre && (userData.rol.valor === 'administrador'|| userData.rol.valor === 'personal') && (
              <NavDropdown title="Personal" id={`offcanvasNavbarDropdown-expand-${expand}`} >
                
                {userData && userData.nombre && (userData.rol.valor === 'administrador'|| userData.rol.valor === 'personal') && (
                <NavDropdown.Item href="#/corrida">CorridaTrenes</NavDropdown.Item>
              )}
              {userData && userData.nombre && (userData.rol.valor === 'administrador'|| userData.rol.valor === 'personal') && (

              <NavDropdown.Item href="#/listaspersonal">Listas Personal</NavDropdown.Item>
              )}
              {userData && userData.nombre && (userData.rol.valor === 'administrador'|| userData.rol.valor === 'personal') && (
                <NavDropdown title="Disponibilidad Personal"  id={`offcanvasNavbarDropdown-expand-${expand}`} > 
                <NavDropdown.Item href="#/pool" >Llamar Personal</NavDropdown.Item>
                <NavDropdown.Item href="#/tarjetas">Cargar Tarjetas</NavDropdown.Item>
                </NavDropdown>
              )}
              {userData && userData.nombre && (userData.rol.valor === 'administrador'|| userData.rol.valor === 'personal') && (

              <NavDropdown.Item href="#/conductores/create">Registrar Conductores</NavDropdown.Item>
            )}
              {userData && userData.nombre && (userData.rol.valor === 'administrador'|| userData.rol.valor === 'personal') && (

              <NavDropdown.Item href="#/guardatren/create">Registrar Guardas</NavDropdown.Item>
            )}
              {userData && userData.nombre && (userData.rol.valor === 'administrador'|| userData.rol.valor === 'personal') && (
              
              <NavDropdown.Item href="#/padron">Padron</NavDropdown.Item>
              
            )}
              <NavDropdown.Divider />
              
              {userData && userData.nombre && userData.rol.valor === 'administrador' && (
              <NavDropdown.Item href="#/administracion"> Administracion </NavDropdown.Item>
            )}
             </NavDropdown>
            )}
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


