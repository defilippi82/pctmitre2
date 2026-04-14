import React, { useContext } from 'react';
import { Button, Container, Nav, Navbar, NavDropdown, Offcanvas, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faBullhorn, faTrain } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../Services/UserContext';
import { NovedadesContext } from "../Services/NovedadesContext";
import { useNavigate } from 'react-router-dom';

export const NavbarComponent = () => {
  const { userData, setUserData } = useContext(UserContext);
  const { novedades } = useContext(NovedadesContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    navigate('/');
  };

  if (!userData) return null;

  // El administrador tiene acceso total ("Dios")
  const isAdmin = userData.rol?.valor === 'administrador';

  // Función para validar si el usuario pertenece a una mesa específica
  //const tieneAcceso = (mesa) => isAdmin || userData.rol?.valor === mesa;
  const tieneAcceso = (mesa) => {
    if (!userData || !userData.roles) return false;
    if (userData.roles.includes('administrador')) return true; // El admin entra a todo
    return userData.roles.includes(mesa);
    };

  return (
    <Navbar collapseOnSelect expand={false} fixed="top" className="bg-body-tertiary shadow-sm mb-5">
      <Container fluid>
        <Navbar.Brand href="#/pendientes">
          <strong>PCT Mitre II</strong>
          <span className="ms-2 fw-light text-muted small">| {userData.nombre}</span>
        </Navbar.Brand>

        {/* -----Boton Emergencia (Visible solo para roles con acceso a emergencias)-----         <div className="d-flex align-items-center">
          <Button href='#/emergencia' variant="danger" className="me-2 d-flex align-items-center gap-2">
            EMERGENCIA <FontAwesomeIcon icon={faBullhorn} />
          </Button>
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
        </div>*/}

        <Navbar.Offcanvas 
          id="offcanvasNavbar" 
          placement="end"
          style={{ backgroundColor: '#3b9cc2de' }} // Mantenemos tu color original
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="text-white">Panel de Control PCT</Offcanvas.Title>
          </Offcanvas.Header>
          
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              
              {/* --- INICIO / NOVEDADES (Visible para todos) --- */}
              <Nav.Link href="#/novedades" className="text-white fw-bold">
                <FontAwesomeIcon icon={faListCheck} className="me-2 text-warning" /> 
                Inicio 
                {novedades?.length > 0 && (
                  <Badge bg="danger" className="ms-2">{novedades.length}</Badge>
                )}
              </Nav.Link>

              {/* --- MESA GRUPO DE ESTUDIO (GdE) --- */}
              {tieneAcceso('gde') && (
                <NavDropdown title="Grupo de Estudio (GdE)" id="nav-gde">
                  <NavDropdown.Item href="#/peditina">Modulaciones T y E</NavDropdown.Item>
                  <NavDropdown.Item href="#/tarjetas">Trenes de Carga</NavDropdown.Item>
                  <NavDropdown.Item href="#/eventos">Eventos</NavDropdown.Item>
                </NavDropdown>
              )}

              {/* --- MESA ELÉCTRICA --- */}
              {tieneAcceso('electrico') && (
                <NavDropdown title="Mesa Eléctrica" id="nav-electrica">
                  <NavDropdown.Item href="#/cortesecc">Corte Secciones</NavDropdown.Item>
                  <NavDropdown.Item href="#/pendientes">Pendientes</NavDropdown.Item>
                  <NavDropdown.Item href="#/precauciones">Precauciones</NavDropdown.Item>
                </NavDropdown>
              )}


              {/* --- MESA DIÉSEL --- */}
              {tieneAcceso('diesel') && (
                <NavDropdown title="Mesa Diésel" id="nav-diesel">
                  <NavDropdown.Item href="#/auv">A.U.V.</NavDropdown.Item>
                  <NavDropdown.Item href="#/pendientes">Pendientes</NavDropdown.Item>
                </NavDropdown>
              )}

              {/* --- MESA EMERGENCIAS --- */}
              {tieneAcceso('emergencia') && (
                <NavDropdown title="Mesa Emergencias" id="nav-emergencias">
                  <NavDropdown.Item href="#/pendientes">Pendientes</NavDropdown.Item>
                  <NavDropdown.Item href="#/partes">Partes Regularidad</NavDropdown.Item>
                  <NavDropdown.Item href="#/barreras">Barreras</NavDropdown.Item>
                  <NavDropdown.Item href="#/barrerasnormalizadas">Normales</NavDropdown.Item>
                  <NavDropdown.Item href="#/art">ART</NavDropdown.Item>
                  <NavDropdown.Item href="#/direcciones">Teléfonos Útiles</NavDropdown.Item>
                  <NavDropdown.Item href="#/padron">Padrón</NavDropdown.Item>
                </NavDropdown>
              )}

              {/* --- MESA PERSONAL --- */}
              {tieneAcceso('personal') && (
                <NavDropdown title="Mesa Personal" id="nav-personal">
                  <NavDropdown.Item href="#/corrida">Corrida de Trenes</NavDropdown.Item>
                  <NavDropdown.Item href="#/listaspersonal">Listas Personal</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <div className="px-3 py-1 small text-muted fw-bold">DISPONIBILIDAD</div>
                  <NavDropdown.Item href="#/pool">Llamar Personal (Pool)</NavDropdown.Item>
                  <NavDropdown.Item href="#/registrartarjetas">Cargar Tarjetas</NavDropdown.Item>
                  <NavDropdown.Item href="#/sabana">Sábana</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#/conductores/create">Registrar Conductores</NavDropdown.Item>
                  <NavDropdown.Item href="#/guardatren/create">Registrar Guardas</NavDropdown.Item>
                  <NavDropdown.Item href="#/padron">Padrón Personal</NavDropdown.Item>
                  <NavDropdown.Item href="#/registrodiagrama">Registro Diagrama</NavDropdown.Item>
                </NavDropdown>
              )}

              {/* --- SECCIÓN ADMINISTRACIÓN --- */}
              {isAdmin && (
                <>
                  <hr className="text-white" />
                  <NavDropdown title="ADMINISTRACIÓN" id="nav-admin">
                    <NavDropdown.Item href="#/administracion" className="fw-bold text-danger">Panel General</NavDropdown.Item>
                    <NavDropdown.Item href="#/operadores/create">Gestionar Operadores</NavDropdown.Item>
                    <NavDropdown.Item href="#/colecciones">Cargar Colecciones</NavDropdown.Item>
                    <NavDropdown.Item href="#/privacidad">Configuración de Privacidad</NavDropdown.Item>
                  </NavDropdown>
                </>
              )}

              <div className="mt-4 px-3">
                <Button variant="outline-light" className="w-100" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};
