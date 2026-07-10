import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Principal = () => {

    const navigate = useNavigate();

    const irABatalla = () => {
        navigate("/batalla");
    };

    const irAEquipo = () => {
        navigate("/equipo");
    };

    const irARanking = () => {
        navigate("/ranking");
    };

    return (
        <>
            <Menu />
            <main className="pokedex-page py-5">
                <Container className="text-center" style={{ position: 'relative', zIndex: 1 }}>

                    

                    <h1 className="pokedex-title">¡Bienvenido a tu Pokédex!</h1>
                    <div className="pokedex-header">
                        <span className="pokedex-lens"></span>
                        <span className="pokedex-eyebrow">POKÉDEX TERMINAL</span>
                        <div className="pokedex-lights">
                            <span style={{ background: '#FFCB05' }}></span>
                            <span style={{ background: '#78C850' }}></span>
                            <span style={{ background: '#E3350D' }}></span>
                        </div>
                    </div>
                    <p className="pokedex-subtitle"> </p>

                    <Row className="justify-content-center">
                        <Col md={4} className="mb-4">
                            <Card className="poke-card h-100" style={{ '--type-color': '#F08030' }}>
                                <div className="poke-card-img-wrap">
                                    <Card.Img src="https://wallpapers-clan.com/wp-content/uploads/2025/06/pokemon-charizard-fiery-descent-desktop-wallpaper-cover.jpg" alt="Explorar Pokémon" />
                                    <div className="poke-badge-row">
                                        <span className="poke-number">Nº 001</span>
                                        <span className="poke-type-badge">Fuego</span>
                                    </div>
                                </div>
                                <Card.Body className="poke-card-body text-start">
                                    <Card.Title className="poke-card-title">Centro de Batalla</Card.Title>
                                    <Card.Text className="poke-card-text">¡Desafía a otros entrenadores y mejora tu clasificación en combates épicos!</Card.Text>
                                    <Button onClick={irABatalla} className="btn-pokeball w-100">
                                        <span className="pokeball-icon"></span>
                                        Ir a la batalla
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} className="mb-4">
                            <Card className="poke-card h-100" style={{ '--type-color': '#F8D030' }}>
                                <div className="poke-card-img-wrap">
                                    <Card.Img src="https://wallpapers-clan.com/wp-content/uploads/2025/06/pokemon-starters-pokeball-fun-desktop-wallpaper-cover.jpg" alt="Tu Equipo" />
                                    <div className="poke-badge-row">
                                        <span className="poke-number">Nº 002</span>
                                        <span className="poke-type-badge">Eléctrico</span>
                                    </div>
                                </div>
                                <Card.Body className="poke-card-body text-start">
                                    <Card.Title className="poke-card-title">Tu Equipo</Card.Title>
                                    <Card.Text className="poke-card-text">Revisa y organiza tu equipo Pokémon para enfrentar nuevos retos.</Card.Text>
                                    <Button onClick={irAEquipo} className="btn-pokeball w-100">
                                        <span className="pokeball-icon"></span>
                                        Armar Equipo
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4} className="mb-4">
                            <Card className="poke-card h-100" style={{ '--type-color': '#6890F0' }}>
                                <div className="poke-card-img-wrap">
                                    <Card.Img src="https://wallpapers-clan.com/wp-content/uploads/2025/05/greninja-cyberpunk-neon-city-rain-action-desktop-wallpaper-cover-768x432.jpg" alt="Centro de Batalla" />
                                    <div className="poke-badge-row">
                                        <span className="poke-number">Nº 003</span>
                                        <span className="poke-type-badge" style={{ color: '#fff' }}>Agua</span>
                                    </div>
                                </div>
                                <Card.Body className="poke-card-body text-start">
                                    <Card.Title className="poke-card-title">Los Mejores del Mundo</Card.Title>
                                    <Card.Text className="poke-card-text">Descubre todos los entrenadores y su posicion en el top global. ¿Eres mejor?</Card.Text>
                                    <Button onClick={irARanking} className="btn-pokeball w-100">
                                        <span className="pokeball-icon"></span>
                                        Ir al Ranking
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .pokedex-page {
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% -10%, #2a2d33 0%, #1B1B1F 55%, #0f1013 100%);
                    min-height: 90vh;
                    color: #fff;
                    position: relative;
                    overflow: hidden;
                }

                .pokedex-page::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 28px 28px;
                    pointer-events: none;
                }

                .pokedex-header {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 14px;
                    background: linear-gradient(135deg, #E3350D, #A62110);
                    padding: 10px 22px 10px 14px;
                    border-radius: 999px;
                    box-shadow: 0 6px 0 rgba(0,0,0,0.35), 0 10px 24px rgba(227,53,13,0.35);
                    margin-bottom: 22px;
                }

                .pokedex-lens {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 35% 30%, #cfe8ff 0%, #3B4CCA 45%, #1c2a8a 100%);
                    box-shadow: 0 0 0 3px rgba(255,255,255,0.85), 0 0 14px 3px rgba(59,76,202,0.9);
                    animation: pokedexPulse 2.4s ease-in-out infinite;
                    flex-shrink: 0;
                }

                @keyframes pokedexPulse {
                    0%, 100% { box-shadow: 0 0 0 3px rgba(255,255,255,0.85), 0 0 10px 2px rgba(59,76,202,0.7); }
                    50% { box-shadow: 0 0 0 3px rgba(255,255,255,0.85), 0 0 20px 6px rgba(59,76,202,1); }
                }

                .pokedex-lights {
                    display: flex;
                    gap: 6px;
                }

                .pokedex-lights span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: block;
                }

                .pokedex-eyebrow {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.6rem;
                    letter-spacing: 1px;
                    color: #fff;
                    text-shadow: 2px 2px 0 rgba(0,0,0,0.4);
                }

                .pokedex-title {
                    font-weight: 900;
                    font-size: 2.4rem;
                    color: #fff;
                    text-shadow: 3px 3px 0 rgba(0,0,0,0.45);
                    margin-bottom: 6px;
                }

                .pokedex-subtitle {
                    color: #b9bcc4;
                    font-weight: 600;
                    margin-bottom: 2.4rem;
                }

                .poke-card {
                    background: #24262B;
                    border: none;
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 10px 28px rgba(0,0,0,0.45);
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }

                .poke-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 20px;
                    border: 2px solid var(--type-color);
                    opacity: 0.55;
                    pointer-events: none;
                }

                .poke-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 18px 34px rgba(0,0,0,0.55), 0 0 0 3px var(--type-color);
                }

                .poke-card-img-wrap {
                    position: relative;
                    height: 190px;
                    overflow: hidden;
                    background: #0f1013;
                }

                .poke-card-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                    transition: transform 0.4s ease;
                }

                .poke-card:hover .poke-card-img-wrap img {
                    transform: scale(1.06);
                }

                .poke-card-img-wrap::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.75) 100%);
                }

                .poke-badge-row {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    right: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 2;
                }

                .poke-number {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.6rem;
                    color: #fff;
                    background: rgba(0,0,0,0.55);
                    padding: 4px 8px;
                    border-radius: 6px;
                }

                .poke-type-badge {
                    font-size: 0.68rem;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    color: #1b1b1f;
                    background: var(--type-color);
                    padding: 4px 10px;
                    border-radius: 999px;
                    box-shadow: 0 2px 0 rgba(0,0,0,0.25);
                }

                .poke-card-body {
                    padding: 1.3rem 1.4rem 1.5rem;
                }

                .poke-card-title {
                    font-weight: 800;
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: #fff;
                }

                .poke-card-text {
                    color: #b9bcc4;
                    font-size: 0.92rem;
                    min-height: 66px;
                }

                .btn-pokeball {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    background: #E3350D;
                    border: none;
                    color: #fff;
                    font-weight: 800;
                    padding: 10px 20px;
                    border-radius: 999px;
                    box-shadow: 0 4px 0 #A62110;
                    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
                }

                .btn-pokeball:hover, .btn-pokeball:focus {
                    background: #A62110;
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #6e1608;
                    color: #fff;
                }

                .pokeball-icon {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid #1b1b1f;
                    background: linear-gradient(to bottom, #fff 0 50%, #1b1b1f 50% 52%, #fff 52% 100%);
                    position: relative;
                    flex-shrink: 0;
                }

                .pokeball-icon::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 6px;
                    height: 6px;
                    background: #fff;
                    border: 2px solid #1b1b1f;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                }
            `}</style>
        </>
    );
};

export default Principal;