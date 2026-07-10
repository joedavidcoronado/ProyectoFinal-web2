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
import { useSelector } from 'react-redux';
import axios from 'axios';

const Menu = () => {
    const { logout, getAuthUser } = useAuth();
    const { user } = useContext(AppContext);
    const { token } = getAuthUser();

    const { completado } = useSelector(state => state.desafio);

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

    const renderDropdownTitle = () => {
        return (
            <span className="d-inline-flex align-items-center">
                {user.nombre}
                {completado && (
                    <span className="insignia-desafio-nav" title="¡Desafío Relámpago Completado!">
                        ⚡ LEYENDA
                    </span>
                )}
            </span>
        );
    };

    return (
        <>
            <Navbar bg="black" data-bs-theme="dark" expand="lg" className="menu-navbar">
                <div className="menu-navbar-glow" />
                <Container style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" className="d-flex align-items-center text-decoration-none text-light me-3" >
                        <Image src="/public/logo.png" alt="Logo" height="35" className="me-2" />
                        <Image src="/public/titu.png" alt="Logo" height="35" className="me-2" />
                    </Link>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto menu-nav-links">
                            {token &&
                                <>
                                    <NavLink to="/" className='nav-link'>Home</NavLink>
                                    <NavLink to="/batalla" className='nav-link'>¡Batallar!</NavLink>
                                    <NavLink to="/equipo" className='nav-link'>Equipos</NavLink>
                                    <NavLink to="/ranking" className='nav-link'>Ranking</NavLink>
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
                        <Nav className="ms-auto align-items-center">
                            {token ? (
                                user && (
                                    <>
                                        <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#FFC107', marginTop: '3px' }} />
                                        <NavDropdown title={renderDropdownTitle()} id="user-dropdown" align="end">
                                            <Link className='dropdown-item' onClick={onCerrarSesionClick}>Cerrar Sesión</Link>
                                        </NavDropdown>
                                    </>
                                )
                            ) : (
                                <>
                                    <NavLink to="/login" className='nav-link nav-link--auth'>Iniciar Sesión</NavLink>
                                    <NavLink to="/register" className='nav-link nav-link--auth nav-link--registro'>Registro</NavLink>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .menu-navbar {
                    position: relative;
                    background: linear-gradient(135deg, #1a0a0a 0%, #181818 55%, #1a0a0a 100%) !important;
                    border-bottom: 2px solid #e74c3c;
                    font-family: 'Nunito', sans-serif;
                    padding-top: 12px;
                    padding-bottom: 12px;
                    z-index: 1000;
                }

                .menu-navbar::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 26px 26px;
                    pointer-events: none;
                }

                .menu-navbar-glow {
                    position: absolute;
                    top: -50px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 380px;
                    height: 140px;
                    background: radial-gradient(circle, rgba(231,76,60,0.3) 0%, transparent 70%);
                    filter: blur(10px);
                    animation: menuGlowPulse 3s ease-in-out infinite;
                    pointer-events: none;
                    z-index: -1; 
                }

                @keyframes menuGlowPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }

                /* ── Links ── */
                .menu-nav-links .nav-link {
                    color: #ccc !important;
                    font-weight: 700;
                    font-size: 0.92rem;
                    padding: 8px 16px !important;
                    border-radius: 999px;
                    transition: color .15s ease, background .15s ease;
                }

                .menu-nav-links .nav-link:hover {
                    color: #FFC107 !important;
                    background: rgba(255,255,255,0.04);
                }

                .menu-nav-links .nav-link.active {
                    color: #ff5b45 !important;
                    text-shadow: 0 0 12px rgba(231,76,60,0.6);
                }

                .nav-link--auth {
                    color: #ccc !important;
                    font-weight: 700;
                    padding: 8px 16px !important;
                }

                .nav-link--registro {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c);
                    color: #fff !important;
                    border-radius: 999px;
                    box-shadow: 0 3px 0 #a62110;
                    margin-left: 6px;
                    transition: transform .15s ease, box-shadow .15s ease;
                }

                .nav-link--registro:hover {
                    transform: translateY(2px);
                    box-shadow: 0 1px 0 #a62110;
                    color: #fff !important;
                }

                /* ── Dropdown Admin ── */
                .menu-navbar :global(.dropdown-menu),
                .dropdown-menu {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 8px;
                     z-index: 3000;
                }

                .dropdown-item {
                    color: #ccc !important;
                    font-weight: 600;
                    border-radius: 8px;
                    padding: 8px 12px;
                    transition: background .15s ease, color .15s ease;
                }

                .dropdown-item:hover {
                    background: rgba(231,76,60,0.15) !important;
                    color: #FFC107 !important;
                }

                /* ── Insignia en el dropdown de usuario ── */
                .insignia-desafio-nav {
                    font-family: 'Press Start 2P', monospace;
                    background: linear-gradient(45deg, #ffca28, #FFC107);
                    color: #1a1a1a;
                    font-size: 0.5rem;
                    font-weight: 900;
                    padding: 4px 7px;
                    border-radius: 4px;
                    margin-left: 8px;
                    letter-spacing: 0.5px;
                    box-shadow: 0 0 12px rgba(255,193,7,0.5), 0 2px 0 #b28600;
                    animation: glowPulse 2s infinite alternate;
                    display: inline-block;
                    line-height: 1;
                }

                @keyframes glowPulse {
                    from { box-shadow: 0 0 4px rgba(255,193,7,0.4), 0 2px 0 #b28600; }
                    to { box-shadow: 0 0 14px rgba(255,193,7,0.8), 0 2px 0 #b28600; }
                }
            `}</style>
        </>
    );
}

export default Menu;