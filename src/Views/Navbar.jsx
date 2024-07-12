import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../Services/UserContext';
import {NovedadesContext} from "../Services/NovedadesContext";
import { faListCheck } from '@fortawesome/free-solid-svg-icons/faListCheck';

export const NavbarComponent = ({ handleLogout }) => {
  const { userData } = useContext(UserContext);
  const { novedades } = useContext(NovedadesContext);
  
 
  return (
  <>
  {[ false, ].map((expand) => (
    <Navbar collapseOnSelect  key={expand} expand={expand} fixed="top" className="bg-body-tertiary xxl-3">
      <Container fluid>
        <Navbar.Brand href="#"><strong>PCT Mitre ||</strong> {userData && userData.nombre && <> ¡Hola <em fluid>{userData.nombre}!</em> </>}</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas  id={`offcanvasNavbar-expand-${expand}`} aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`} style={{ backgroundColor: '#3b9cc2de' }} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              PCT Mitre
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body >
            <Nav className="justify-content-end flex-grow-1 pe-3">
            {userData && userData.nombre  && (
            <Nav.Link  href="#/novedades"><FontAwesomeIcon className=" bg-warning sm-1" icon={faListCheck} />  Inicio    
            {novedades.length > 0 && (
                   <span className="badge bg-danger text-red lg-1">{novedades.length}</span>
            )}</Nav.Link>)}
            {userData && userData.nombre &&  (userData.rol.valor === 'administrador'|| userData.rol.valor === 'electrico')  && (
              <NavDropdown title="Electrica" id={`offcanvasNavbarDropdown-expand-${expand}`} >
              
              <NavDropdown.Item href="#/cortesecc">Corte Secciones</NavDropdown.Item>
              </NavDropdown>
            )}
            {userData && userData.nombre &&  (userData.rol.valor === 'administrador'|| userData.rol.valor === 'diesel')  && (
              <NavDropdown title="Diesel" id={`offcanvasNavbarDropdown-expand-${expand}`} >
              
              <NavDropdown.Item href="#/auv">A.U.V.</NavDropdown.Item>
              </NavDropdown>
            )}
                          
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
               
               <NavDropdown.Item href="#/corrida">CorridaTrenes</NavDropdown.Item>
              
              <NavDropdown.Item href="#/listaspersonal">Listas Personal</NavDropdown.Item>
               <NavDropdown title="Disponibilidad Personal"  id={`offcanvasNavbarDropdown-expand-${expand}`} > 
                <NavDropdown.Item href="#/pool" >Llamar Personal</NavDropdown.Item>
                <NavDropdown.Item href="#/tarjetas">Cargar Tarjetas</NavDropdown.Item>
                <NavDropdown.Item href="#/sabana" >Sábana</NavDropdown.Item>
                </NavDropdown>
             
              <NavDropdown.Item href="#/conductores/create">Registrar Conductores</NavDropdown.Item>
            
              <NavDropdown.Item href="#/guardatren/create">Registrar Guardas</NavDropdown.Item>
            
              <NavDropdown.Item href="#/padron">Padron</NavDropdown.Item>
            
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


