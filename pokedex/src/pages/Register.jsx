import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import Menu from "../components/Menu";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";

const Register = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/auth/register', { nombre, correo, contraseña })
            .then((res) => {
                console.log(res.data);
                navigate('/login');
            }).catch((err) => {
                console.log(err);
                if (err.response?.status === 400) {
                    alert("El correo ya existe");
                } else {
                    alert("Error en registrar usuario, por favor intente nuevamente");
                }
            });
    };

    return (
        <>
            <Menu />
            <div className="auth-page">
                <div className="auth-page-noise" />
                <Container className="auth-container">
                    <Row className="justify-content-center w-100">
                        <Col xs={12} md={6} className="d-flex justify-content-center">
                            <Card className="auth-card">
                                <div className="auth-card-glow" />
                                <Card.Body className="auth-card-body">
                                    <h4 className="auth-titulo">Regístrate</h4>
                                    <h5 className="auth-subtitulo">Crea tu cuenta</h5>
                                    <Form onSubmit={onFormSubmit}>
                                        <div className="mb-3">
                                            <label className="auth-label">Nombre Completo</label>
                                            <FormControl
                                                required
                                                placeholder="Tu nombre"
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                className="auth-input"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="auth-label">Correo</label>
                                            <FormControl
                                                required
                                                placeholder="correo@gmail.com"
                                                type="email"
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                                className="auth-input"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="auth-label">Contraseña</label>
                                            <FormControl
                                                required
                                                placeholder="*****"
                                                type="password"
                                                value={contraseña}
                                                onChange={(e) => setContraseña(e.target.value)}
                                                className="auth-input"
                                            />
                                        </div>
                                        <Button type="submit" className="btn-auth-submit">
                                            Registrarse
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .auth-page {
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 79vh;
                    width: 100%;
                    overflow: hidden;
                }

                .auth-page-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .auth-container {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 79vh;
                }

                .auth-card {
                    position: relative;
                    width: 400px;
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
                    color: white;
                    border: 2px solid #333 !important;
                    border-radius: 18px !important;
                    padding: 8px;
                    box-shadow: 0 14px 32px rgba(0,0,0,0.5);
                    overflow: hidden;
                }

                .auth-card-glow {
                    position: absolute;
                    top: -40px;
                    right: -40px;
                    width: 160px;
                    height: 160px;
                    background: radial-gradient(circle, rgba(231,76,60,0.18) 0%, transparent 70%);
                    pointer-events: none;
                }

                .auth-card-body {
                    position: relative;
                    z-index: 1;
                }

                .auth-titulo {
                    font-weight: 900;
                    color: #ff5b45;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }

                .auth-subtitulo {
                    color: #999;
                    font-weight: 600;
                    font-size: 0.95rem;
                    margin-bottom: 20px;
                }

                .auth-label {
                    display: block;
                    color: #FFC107;
                    font-weight: 700;
                    font-size: 0.85rem;
                    margin-bottom: 6px;
                }

                .auth-input {
                    background: #151515 !important;
                    border: 1px solid #444 !important;
                    color: white !important;
                    border-radius: 8px !important;
                    padding: 10px 12px !important;
                }

                .auth-input::placeholder {
                    color: #666;
                }

                .auth-input:focus {
                    border-color: #FFC107 !important;
                    box-shadow: 0 0 0 3px rgba(255,193,7,0.15) !important;
                }

                .btn-auth-submit {
                    width: 100%;
                    margin-top: 6px;
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    border: none !important;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    padding: 10px !important;
                    border-radius: 999px !important;
                    box-shadow: 0 3px 0 #b28600;
                    transition: transform .15s ease, box-shadow .15s ease;
                }

                .btn-auth-submit:hover {
                    transform: translateY(2px);
                    box-shadow: 0 1px 0 #b28600;
                }

                @media (max-width: 600px) {
                    .auth-card {
                        width: 90vw;
                    }
                }
            `}</style>
        </>
    );
};

export default Register;