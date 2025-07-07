import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'black', color: '#fff', padding: '20px 0', marginTop: '0px' }}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
                        <span style={{ color: '#D4AC0D', fontWeight: 'bold' }}>POKEMON</span> &copy; {new Date().getFullYear()} - Todos los derechos reservados.
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <a href="https://www.binance.com/es-AR/terms"  rel="noopener noreferrer" className="text-light text-decoration-none me-3">Términos</a>
                        <a href="https://www.binance.com/es-AR/privacy"  rel="noopener noreferrer" className="text-light text-decoration-none">Privacidad</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
