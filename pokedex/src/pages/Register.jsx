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
            <div style={{ backgroundColor: '#272727', minHeight: '79vh', width: '100%' }}>
                <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '79vh' }}>
                    <Row>
                        <Col xs={12} md={6}>
                            <Card style={{ width: '400px', backgroundColor: '#000000', color: 'white', padding: '20px', borderRadius: '10px' }}>
                                <Card.Body>
                                    <h4>Regístrate</h4>
                                    <h5>Crea tu cuenta</h5>
                                    <Form onSubmit={onFormSubmit}>
                                        <div className="mb-2">
                                            <label>Nombre Completo</label>
                                            <FormControl
                                                required
                                                placeholder="Tu nombre"
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Correo</label>
                                            <FormControl
                                                required
                                                placeholder="correo@gmail.com"
                                                type="email"
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label>Contraseña</label>
                                            <FormControl
                                                required
                                                placeholder="*****"
                                                type="password"
                                                value={contraseña}
                                                onChange={(e) => setContraseña(e.target.value)}
                                            />
                                        </div>
                                        <Button variant="warning" type="submit" style={{ width: '100%' }}>
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
        </>
    );
};

export default Register;
