import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <>
            <footer className="site-footer">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
                            <span className="footer-brand">POKEMON</span> &copy; {new Date().getFullYear()} - Todos los derechos reservados.
                        </Col>
                        <Col md={6} className="text-center text-md-end">
                            <a href="https://www.binance.com/es-AR/terms" rel="noopener noreferrer" className="footer-link me-3">Términos</a>
                            <a href="https://www.binance.com/es-AR/privacy" rel="noopener noreferrer" className="footer-link">Privacidad</a>
                        </Col>
                    </Row>
                </Container>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

                .site-footer {
                    background: linear-gradient(135deg, #1a0a0a 0%, #181818 55%, #1a0a0a 100%);
                    border-top: 2px solid #e74c3c;
                    color: #fff;
                    font-family: 'Nunito', sans-serif;
                    padding: 20px 0;
                    margin-top: 0;
                }

                .footer-brand {
                    color: #FFC107;
                    font-weight: 900;
                    letter-spacing: 0.5px;
                }

                .footer-link {
                    color: #ccc;
                    text-decoration: none;
                    font-weight: 600;
                    transition: color .15s ease;
                }

                .footer-link:hover {
                    color: #FFC107;
                }
            `}</style>
        </>
    );
};

export default Footer;