import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Principal = () => {
    
    const navigate = useNavigate();

    const irAEquipo = () => {
        navigate("/equipo"); 
    };
    return (
        <>
            <Menu />
            <main className="py-3" style={{ 
                backgroundColor: '#272727',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '90vh',
                color: 'white',
            }}>
                <Container className="text-center">
                    <h1 className="mb-4 fw-bold text-shadow">¡Bienvenido a tu Pokédex!</h1>
                    <Row className="justify-content-center">
                        <Col md={4} className="mb-4">
                            <Card className="bg-black text-white shadow-lg border-0">
                                <Card.Img src="https://wallpapers-clan.com/wp-content/uploads/2025/06/pokemon-charizard-fiery-descent-desktop-wallpaper-cover.jpg" alt="Explorar Pokémon" style={{ height: '200.7px', objectFit: 'contain', backgroundColor: '#f2f2f2' }} />
                                <Card.Body>
                                    <Card.Title>Explorar Pokémon</Card.Title>
                                    <Card.Text>Descubre todos los Pokémon disponibles con sus estadísticas, tipos y habilidades.</Card.Text>
                                    <Button variant="warning">Ver Pokédex</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="bg-black text-white shadow-lg border-0">
                                <Card.Img src="https://wallpapers-clan.com/wp-content/uploads/2025/06/pokemon-starters-pokeball-fun-desktop-wallpaper-cover.jpg" alt="Tu Equipo" style={{ height: '200.7px', objectFit: 'contain', backgroundColor: '#f2f2f2' }} />
                                <Card.Body>
                                    <Card.Title>Tu Equipo</Card.Title>
                                    <Card.Text>Revisa y organiza tu equipo Pokémon para enfrentar nuevos retos.</Card.Text>
                                    <Button onClick={irAEquipo} variant="warning">Armar Equipo</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="bg-black text-white shadow-lg border-0">
                                <Card.Img src="https://wallpapers-clan.com/wp-content/uploads/2025/05/greninja-cyberpunk-neon-city-rain-action-desktop-wallpaper-cover-768x432.jpg" alt="Centro de Batalla" style={{ height: '200.7px', objectFit: 'contain', backgroundColor: '#f2f2f2' }} />
                                <Card.Body>
                                    <Card.Title>Centro de Batalla</Card.Title>
                                    <Card.Text>¡Desafía a otros entrenadores y mejora tu clasificación en combates épicos!</Card.Text>
                                    <Button variant="warning">Ir al Combate</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default Principal;
