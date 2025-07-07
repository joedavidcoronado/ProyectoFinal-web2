import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import Menu from "../components/Menu";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import Footer from "../components/Footer";

const Login = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('')
    
    const onFormSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/auth/login', { correo, contraseña })
            .then((res) => {
                const token = res.data.token;
                loginUser(token, correo);
                navigate('/');
            }).catch((err) => {
                if (err.response.status === 401) {
                    alert("Usuario o contraseña incorrectos");
                }
            });
    }


    return (
        <>
            <Menu />
            <div style={{ backgroundColor: '#272727', minHeight: '79vh', width: '100%' }}>
                <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '79vh' }}>
                    <Row>
                        <Col xs={12} md={6}>
                            <Card style={{ width:'400px', height:'340px', backgroundColor: '#000000', color: 'white', padding: '20px', borderRadius: '10px' }}>
                                <Card.Body>
                                    <div id="aja">
                                        <h4>Hola! Ingresa tus datos</h4>
                                        <h5>para iniciar sesión</h5>
                                        <Form onSubmit={onFormSubmit}>
                                            <div>
                                                <label>Correo</label>
                                                <FormControl required placeholder="correo@gmail.com" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                                            </div>
                                            <div>
                                                <label>Contraseña</label>
                                                <FormControl required placeholder="*****" type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Form.Check type="checkbox" label="Recordarme" className="mt-2" />
                                                <Link to="/register" style={{ color: '#FFC107' }}>¿Olvidó su contraseña?</Link>
                                            </div>
                                            <div className="mt-2">
                                                <Button variant="warning" type="submit" style={{ width: '100%' }}>Enviar</Button>
                                            </div>
                                        </Form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>

    );
}

export default Login;