
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Menu = () => {
    const { logout, getAuthUser } = useAuth();
    const { user } = useContext(AppContext);
    const { token } = getAuthUser();

    const onCerrarSesionClick = (e) => {
        e.preventDefault();
        const confirmacion = window.confirm("¿Está seguro de que desea cerrar sesión?");
        if (!confirmacion) return;
        logout();
    }

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchAdminStatus = async () => {
            if (!user || !user.correo) return;

            try {
                const res = await axios.get(`http://localhost:3001/usuarios/correo/${user.correo}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("RES DATA (admin check):", res.data);
                setIsAdmin(res.data.isAdmin);
            } catch (error) {
                console.error("No se pudo verificar si es admin:", error);
            }
        };

        if (token && user) {
            fetchAdminStatus();
        }
    }, [token, user]);



    return (
        <>
            <Navbar bg="black" data-bs-theme="dark" expand="lg">
                <Container>
                    <Link to="/" className="d-flex align-items-center text-decoration-none text-light me-3" >
                        <Image src="/public/logo.png" alt="Logo" height="35" className="me-2" />
                        <Image src="/public/titu.png" alt="Logo" height="35" className="me-2" />
                    </Link>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {token &&
                                <>
                                    <NavLink to="/" className='nav-link'>Home</NavLink>
                                    <NavLink to="/equipo" className='nav-link'>Equipos</NavLink>
                                {isAdmin && (
                                    <NavDropdown title="Opciones Admin" id="basic-nav-dropdown">
                                        <NavLink to="/usuario/lista" className='dropdown-item'>Usuarios</NavLink>
                                        <NavLink to="/pokemon/lista" className='dropdown-item'>Pokemon</NavLink>
                                        <NavDropdown.Divider />
                                        <NavLink to="/movimientos/lista" className="dropdown-item">Movimientos</NavLink>
                                        <NavLink to="/habilidades/lista" className="dropdown-item">Habilidades</NavLink>
                                        <NavLink to="/items/lista" className="dropdown-item">Items</NavLink>
                                    </NavDropdown>
                                )}
                                </>
                            }
                        </Nav>
                        <Nav className="ms-auto">
                            {token ? (
                                user && (
                                    <>
                                        <FontAwesomeIcon icon={faUser} className="me-2"  style={{ color: '#D4AC0D' , marginTop: '13px'}} />
                                        <NavDropdown title={user.nombre} id="user-dropdown" align="end">
                                            <Link className='dropdown-item' onClick={onCerrarSesionClick}>Cerrar Sesión</Link>
                                        </NavDropdown>
                                    </>
                                )
                            ) : (
                                <>
                                    <NavLink to="/login" className='nav-link'>Iniciar Sesión</NavLink>
                                    <NavLink to="/register" className='nav-link'>Registro</NavLink>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Menu;
