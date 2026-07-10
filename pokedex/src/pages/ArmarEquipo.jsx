import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import CrearEquipoModal from "../components/CrearEquipoModal";
import SelectPokemonModal from "../components/SelectPokemonModal";
import { useNavigate } from "react-router-dom";
import { useGamificacion } from "../features/gamificacion/useGamificacion";


const ArmarEquipo = () => {
    const { getAuthUser } = useAuth();
    const navigate = useNavigate();
    const usuario = getAuthUser();
    const [equipoSelected, setEquipoSelected] = useState(null);
    const { agregarNotificaciones } = useGamificacion();

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const abrirModal = () => setShowModal(true);
    const cerrarModal = () => setShowModal(false);
    const abrirModal2 = () => setShowModal2(true);
    const cerrarModal2 = () => setShowModal2(false);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const recargarEquipos = async () => {
        const { token } = getAuthUser();
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/equipos/${usuario.email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEquipos(response.data);
        } catch (error) {
            console.error("Error al obtener equipos:", error);
        } finally {
            setLoading(false);
        }
    };

    const postNewEquipo = async (equipoData) => {
        const { token } = getAuthUser();
        try {
            const response = await axios.post("http://localhost:3001/equipos/crear", equipoData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.logrosDesbloqueados?.length > 0) {
                agregarNotificaciones(response.data.logrosDesbloqueados)
            }
            await recargarEquipos();
        } catch (error) {
            console.error("Error al crear el equipo:", error);
            alert("Hubo un error al crear el equipo");
        }
    };

    const eliminarEquipo = (equipoId) => async () => {
        const { token } = getAuthUser();
        try {
            await axios.delete(`http://localhost:3001/equipos/${equipoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await recargarEquipos();
        } catch (error) {
            console.error("Error al eliminar el equipo:", error);
            alert("Hubo un error al eliminar el equipo");
        }
    }

    useEffect(() => {
        const fetchEquipos = async () => {
            const { token } = getAuthUser();
            try {
                const response = await axios.get(`http://localhost:3001/equipos/${usuario.email}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEquipos(response.data);
            } catch (error) {
                console.error("Error al obtener equipos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipos();
    }, [usuario.email]);

    return (
        <>
            <Menu />
            <main className="equipos-page">

                {/* ── HERO ── */}
                <div className="equipos-hero">
                    <div className="equipos-hero-glow" />
                    <h1 className="equipos-title">🎽 TUS EQUIPOS POKÉMON</h1>
                    <p className="equipos-subtitle">Arma, edita y prepara tus equipos para la batalla</p>
                </div>

                <Container className="mt-4" style={{ maxWidth: '1100px', position: 'relative', zIndex: 1 }}>

                    {loading ? (
                        <div className="equipos-loading">
                            <span className="mini-pokeball" />
                            <p>Cargando equipos...</p>
                        </div>
                    ) : equipos.length === 0 ? (
                        <div className="equipos-empty">
                            <img src="../../public/avatar.png" alt="img.png" className="equipos-empty-img" />
                            <p className="equipos-empty-text">Aún no tienes equipos creados.</p>
                            <Button onClick={abrirModal2} className="btn-crear-equipo">
                                + Crear Nuevo Equipo
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Row className="g-4">
                                {equipos.map((equipo, index) => {
                                    const roster = equipo.pokemonesequipo || [];
                                    const slotsVacios = Math.max(6 - roster.length, 0);

                                    return (
                                        <Col md={6} lg={4} key={index}>
                                            <div className="equipo-card">
                                                <div className="equipo-card-glow" />

                                                <div className="equipo-card-header">
                                                    <span className="equipo-card-icon">🎽</span>
                                                    <h5 className="equipo-card-name">{equipo.nombre}</h5>
                                                    <span className="equipo-card-count">{roster.length}/6</span>
                                                </div>

                                                <div className="equipo-card-roster">
                                                    {roster.length > 0 ? (
                                                        <>
                                                            {roster.map((pokemon) => (
                                                                <div className="equipo-poke-slot" key={pokemon.id}>
                                                                    <img
                                                                        src={`http://localhost:3001/uploads/pokemon/${pokemon.pokemonId}.png`}
                                                                        alt={pokemon.nombre || "pokemon"}
                                                                        className="equipo-poke-img"
                                                                    />
                                                                </div>
                                                            ))}
                                                            {Array.from({ length: slotsVacios }).map((_, i) => (
                                                                <div className="equipo-poke-slot equipo-poke-slot--vacio" key={`vacio-${i}`}>
                                                                    <span>+</span>
                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <p className="equipo-sin-pokemones">Sin pokémones todavía</p>
                                                    )}
                                                </div>

                                                <div className="equipo-card-actions">
                                                    <Button
                                                        className="btn-equipo btn-equipo--detalles"
                                                        onClick={() => navigate(`/detalle/${equipo.id}`)}
                                                    >
                                                        Detalles
                                                    </Button>
                                                    <Button
                                                        className="btn-equipo btn-equipo--crear"
                                                        onClick={() => {
                                                            if (equipo.pokemonesequipo?.length >= 6) {
                                                                alert("No puedes agregar más de 6 Pokémon a un equipo.");
                                                            } else {
                                                                setEquipoSelected(equipo.id);
                                                                abrirModal();
                                                            }
                                                        }}
                                                    >
                                                        Crear Pokémon
                                                    </Button>
                                                    <Button
                                                        className="btn-equipo btn-equipo--eliminar"
                                                        onClick={eliminarEquipo(equipo.id)}
                                                    >
                                                        🗑
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>

                            <div className="equipos-footer-cta">
                                <Button onClick={abrirModal2} className="btn-crear-equipo">
                                    + Crear Nuevo Equipo
                                </Button>
                            </div>
                        </>
                    )}
                </Container>
            </main>
            <Footer />

            <SelectPokemonModal
                show={showModal}
                onHide={cerrarModal}
                usuarioId={usuario.email}
                equipoId={equipoSelected}
                onEquipoCreado={recargarEquipos}
            />

            <CrearEquipoModal
                show={showModal2}
                onClose={() => {
                    cerrarModal2();
                    recargarEquipos();
                }}
                onCrear={(nombre) => postNewEquipo({ nombre, correo: usuario.email })}
            />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .equipos-page {
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 90vh;
                    color: white;
                    padding-bottom: 70px;
                    position: relative;
                    overflow: hidden;
                }

                .equipos-page::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                /* ── HERO ── */
                .equipos-hero {
                    position: relative;
                    background: linear-gradient(135deg, #1a0a0a 0%, #2d0000 50%, #1a0a0a 100%);
                    border-bottom: 2px solid #e74c3c;
                    padding: 44px 0 34px;
                    text-align: center;
                    overflow: hidden;
                }

                .equipos-hero-glow {
                    position: absolute;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 420px;
                    height: 180px;
                    background: radial-gradient(circle, rgba(231,76,60,0.35) 0%, transparent 70%);
                    filter: blur(10px);
                    animation: heroGlowPulse 3s ease-in-out infinite;
                }

                @keyframes heroGlowPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }

                .equipos-title {
                    position: relative;
                    font-size: 2.3rem;
                    font-weight: 900;
                    letter-spacing: 3px;
                    color: #ff5b45;
                    text-shadow: 0 0 18px rgba(231,76,60,0.7), 3px 3px 0 rgba(0,0,0,0.5);
                    margin: 0;
                }

                .equipos-subtitle {
                    position: relative;
                    color: #999;
                    margin-top: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                }

                /* ── Loading / empty ── */
                .equipos-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    color: #888;
                    text-align: center;
                    padding: 60px 0;
                    font-weight: 600;
                }

                .mini-pokeball {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    border: 2px solid #1b1b1f;
                    background: linear-gradient(to bottom, #fff 0 50%, #1b1b1f 50% 52%, #fff 52% 100%);
                    display: inline-block;
                    animation: spinPokeball 0.9s linear infinite;
                }

                @keyframes spinPokeball {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .equipos-empty {
                    text-align: center;
                    padding: 40px 0;
                }

                .equipos-empty-img {
                    width: 20%;
                    min-width: 120px;
                    margin-top: 10px;
                    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.5));
                    opacity: 0.9;
                }

                .equipos-empty-text {
                    color: #999;
                    margin: 18px 0 20px;
                    font-weight: 600;
                }

                /* ── Cards de equipo ── */
                .equipo-card {
                    position: relative;
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 18px;
                    padding: 20px;
                    height: 100%;
                    transition: border-color .2s ease, transform .15s ease, box-shadow .2s ease;
                    overflow: hidden;
                }

                .equipo-card:hover {
                    border-color: #e74c3c;
                    transform: translateY(-4px);
                    box-shadow: 0 14px 28px rgba(231,76,60,0.22);
                }

                .equipo-card-glow {
                    position: absolute;
                    top: -30px;
                    right: -30px;
                    width: 140px;
                    height: 140px;
                    background: radial-gradient(circle, rgba(255,193,7,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                .equipo-card-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    position: relative;
                    z-index: 1;
                }

                .equipo-card-icon { font-size: 1.15rem; }

                .equipo-card-name {
                    color: #FFC107;
                    margin: 0;
                    font-weight: 800;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .equipo-card-count {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.6rem;
                    color: #888;
                    background: #151515;
                    border: 1px solid #333;
                    padding: 4px 8px;
                    border-radius: 999px;
                    flex-shrink: 0;
                }

                .equipo-card-roster {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: center;
                    align-items: center;
                    min-height: 110px;
                    padding: 12px 4px;
                    margin-bottom: 18px;
                    background: radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.02) 0%, transparent 70%);
                    border-radius: 12px;
                    position: relative;
                    z-index: 1;
                }

                .equipo-poke-slot {
                    width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    background: radial-gradient(circle at 50% 20%, #262626 0%, #151515 100%);
                    border: 1px solid #2e2e2e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .equipo-poke-img {
                    width: 42px;
                    height: 42px;
                    object-fit: contain;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
                }

                .equipo-poke-slot--vacio {
                    background: transparent;
                    border: 1px dashed #333;
                    color: #444;
                    font-size: 1.2rem;
                    font-weight: 700;
                }

                .equipo-sin-pokemones {
                    color: #666;
                    font-size: 0.9rem;
                    margin: 0;
                    font-weight: 600;
                }

                .equipo-card-actions {
                    display: flex;
                    gap: 8px;
                    position: relative;
                    z-index: 1;
                }

                .btn-equipo {
                    border: none;
                    border-radius: 999px;
                    font-weight: 700;
                    font-size: 0.82rem;
                    padding: 8px 14px;
                    flex: 1;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-equipo:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-equipo--detalles {
                    background: linear-gradient(135deg, #3a3a3a, #262626);
                    color: #FFC107;
                    border: 1px solid #444 !important;
                }

                .btn-equipo--crear {
                    background: linear-gradient(135deg, #ffca28, #FFC107);
                    color: #1a1a1a;
                    box-shadow: 0 3px 0 #b28600;
                }

                .btn-equipo--eliminar {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c);
                    color: white;
                    flex: 0 0 auto;
                    padding: 8px 14px;
                    box-shadow: 0 3px 0 #a62110;
                }

                /* ── CTA crear equipo ── */
                .equipos-footer-cta {
                    text-align: center;
                    margin-top: 34px;
                }

                .btn-crear-equipo {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c);
                    border: none;
                    color: white;
                    font-weight: 800;
                    letter-spacing: 1px;
                    padding: 12px 34px;
                    border-radius: 999px;
                    box-shadow: 0 4px 0 #a62110, 0 0 24px rgba(231,76,60,0.35);
                    transition: transform .15s ease, box-shadow .15s ease;
                }

                .btn-crear-equipo:hover {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #a62110, 0 0 30px rgba(231,76,60,0.55);
                }
            `}</style>
        </>
    );
};

export default ArmarEquipo;