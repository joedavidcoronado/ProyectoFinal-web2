import { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Button, Image } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";


const DetallePokemon = () => {
    const { getAuthUser } = useAuth(true);
    const [equipo, setEquipo] = useState(null);
    const { equipoId } = useParams();
    const navigate = useNavigate();

    const [edit, setEdit] = useState(false);
    const [nombreEditado, setNombreEditado] = useState("");


    const fetchDatos = async () => {
        const { token } = getAuthUser();
        try {
            const resEquipo = await axios.get(`http://localhost:3001/equipos/equipodetalle/${equipoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEquipo(resEquipo.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    useEffect(() => {
        fetchDatos();
    }, [equipoId]);

    useEffect(() => {
        if (equipo) {
            setNombreEditado(equipo.nombre);
        }
    }, [equipo]);


    const borrarPokemon = async (pokemonId, equipoId) => {
        const { token } = getAuthUser();
        try {
            await axios.delete(`http://localhost:3001/pokemones_equipo/${pokemonId}/${equipoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchDatos(); 
        } catch (error) {
            console.error("Error al eliminar el Pokémon:", error);
            alert("Error al eliminar el Pokémon. Por favor, inténtalo de nuevo.");
        }
    };

    const updateEquipo = async () => {
        const { token } = getAuthUser();
        try {
            await axios.put(`http://localhost:3001/equipos/${equipoId}`, 
                { nombre: nombreEditado },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEdit(false);
            fetchDatos(); 
        } catch (error) {
            console.error("Error al actualizar el equipo:", error);
            alert("No se pudo actualizar el nombre del equipo.");
        }
    };


    return (
        <>
            <Menu />
            <main className="detalle-page">
                <div className="detalle-page-noise" />
                <Container className="p-4 detalle-container">
                {!equipo
                        ?   
                        <div className="detalle-vacio">
                            <img src="../../public/vacio.png" alt="img.png" className="detalle-vacio-img" />
                            <p className="detalle-vacio-text">No hay pokemones...</p>
                        </div>
                        : 
                            <>
                            {!edit ? (
                                <div className="detalle-header">
                                    <h2 className="detalle-titulo">Pokémon del Equipo: <strong className="detalle-titulo-nombre">{equipo.nombre}</strong></h2>
                                    <span onClick={() => setEdit(true)} className="detalle-icon-btn">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </span>
                                </div>
                            ) : (
                                <>
                                    <h5 className="detalle-edit-label">Edita el nombre de tu equipo</h5>
                                    <div className="detalle-header">
                                        <input
                                            type="text"
                                            value={nombreEditado}
                                            onChange={(e) => setNombreEditado(e.target.value)}
                                            className="detalle-edit-input"
                                        />
                                        <span onClick={updateEquipo} className="detalle-icon-btn">
                                            <FontAwesomeIcon icon={faSave} />
                                        </span>
                                    </div>
                                </>
                            )} 
                            <Row xs={1} md={2} lg={3} className="g-4 mt-1">
                                {equipo.pokemonesequipo?.map((poke, index) => (
                                    <Col key={index}>
                                        <Card className="poke-card">
                                            <h5 className="poke-card-nametag">{poke.base.nombre}</h5>
                                            <Card.Img
                                                variant="top"
                                                src={`http://localhost:3001/uploads/pokemon/${poke.pokemonId}.png`}
                                                alt={poke.apodo || "pokemon"}
                                                className="poke-card-img"
                                            />
                                            <Card.Body>
                                                <div className="poke-card-title-row">
                                                    <h4 className="poke-card-apodo">{poke.apodo || poke.base?.nombre}{" "}</h4>
                                                    <img className="poke-card-tipo-img" src={`http://localhost:3001/uploads/tipo/${poke.tipo.id}.png`} alt="tipo.png" />
                                                </div>

                                                <Card.Subtitle className="poke-card-naturaleza">
                                                    Naturaleza: <strong className="poke-card-naturaleza-valor">{poke.naturaleza?.nombre}</strong>
                                                </Card.Subtitle>

                                                <hr className="poke-divider" />
                                                <strong className="poke-stat-label">EVs: Valores de Esfuerzo</strong>
                                                <ResponsiveContainer width="100%" height={130} className="poke-chart-container">
                                                    <BarChart
                                                    data={[
                                                        { name: 'HP', value: poke.ev_hp },
                                                        { name: 'Atk', value: poke.ev_attack },
                                                        { name: 'Def', value: poke.ev_defense },
                                                        { name: 'SpA', value: poke.ev_sp_atk },
                                                        { name: 'SpD', value: poke.ev_sp_def },
                                                        { name: 'Spe', value: poke.ev_speed },
                                                    ]}
                                                    >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                    <XAxis dataKey="name" stroke="#999" />
                                                    <YAxis stroke="#999" />
                                                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
                                                    <Bar dataKey="value" fill="#FFC107" name="EVs" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                                <hr className="poke-divider" />
                                                {/* IVs Chart */}
                                                <strong className="poke-stat-label">IVs: Valores Individuales</strong>
                                                <ResponsiveContainer width="100%" height={130} className="poke-chart-container">
                                                    <BarChart
                                                    data={[
                                                        { name: 'HP', value: poke.iv_hp },
                                                        { name: 'Atk', value: poke.iv_attack },
                                                        { name: 'Def', value: poke.iv_defense },
                                                        { name: 'SpA', value: poke.iv_sp_atk },
                                                        { name: 'SpD', value: poke.iv_sp_def },
                                                        { name: 'Spe', value: poke.iv_speed },
                                                    ]}
                                                    >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                    <XAxis dataKey="name" stroke="#999" />
                                                    <YAxis stroke="#999" />
                                                    <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
                                                    <Bar dataKey="value" fill="#ff5b45" name="IVs" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>

                                                <hr className="poke-divider" />
                                                <section className="poke-hab-mov-row">
                                                    <div className="poke-habilidades">
                                                        <strong className="poke-subsection-label">Habilidades</strong>
                                                        <hr className="poke-divider poke-divider--tight" />
                                                        {poke.habilidadesRel?.map((hab, i) => (
                                                            <strong key={i}><p className="poke-hab-item">{hab.nombre}</p></strong>
                                                        ))}
                                                    </div>
                                                <div className="poke-movimientos">
                                                    <strong className="poke-subsection-label">Movimientos</strong>
                                                    <hr className="poke-divider poke-divider--tight" />
                                                    {poke.movimientosRel?.map((mov, i) => (
                                                        <p key={i} className="poke-mov-item">
                                                            <strong>{mov.nombre}</strong>{" "} <br /> {mov.categoria}{mov.power ? `- ${mov.power} power` : ""}
                                                        </p>
                                                    ))}
                                                </div>
                                                </section>

                                                <section className='mt-4 poke-item-section'>
                                                    <Image
                                                        src={`http://localhost:3001/uploads/item/${poke.item?.id}.png`}
                                                        className="poke-item-img"
                                                    />
                                                    <div className='poke-item-info'> 
                                                        <h4 className="poke-item-nombre">{poke.item?.nombre}</h4>
                                                        <p className="poke-item-desc">{poke.item?.descripcion}</p>
                                                    </div>
                                                </section>
                                            </Card.Body>
                                            <Card.Footer className="poke-card-footer">
                                                <Button 
                                                    className="btn-poke btn-poke--editar" 
                                                    onClick={() => navigate(`/pokemon/${poke.pokemonId}/${equipoId}`)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button 
                                                    className="btn-poke btn-poke--eliminar" 
                                                    type="submit" 
                                                    onClick={
                                                        async ()=> { 
                                                            if (window.confirm("¿Estás seguro de eliminar este Pokémon del equipo?")) {
                                                                await borrarPokemon(poke.id, equipoId);
                                                            }}
                                                        }
                                                >
                                                    Eliminar
                                                </Button>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                    </>
                }  
                </Container>
            </main>
            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .detalle-page {
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 90vh;
                    color: white;
                    padding: 24px 0 60px;
                    overflow: hidden;
                }

                .detalle-page-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .detalle-container {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                }

                /* ── Vacío ── */
                .detalle-vacio {
                    text-align: center;
                    margin: 60px 0;
                }

                .detalle-vacio-img {
                    width: 20%;
                    min-width: 120px;
                    margin-top: 30px;
                    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.5));
                    opacity: 0.9;
                }

                .detalle-vacio-text {
                    color: #999;
                    margin-top: 16px;
                    font-weight: 600;
                }

                /* ── Header / edición de nombre ── */
                .detalle-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 24px;
                }

                .detalle-titulo {
                    font-weight: 800;
                    margin: 0;
                    font-size: 1.6rem;
                }

                .detalle-titulo-nombre {
                    color: #FFC107;
                    text-shadow: 0 0 14px rgba(255,193,7,0.4);
                }

                .detalle-edit-label {
                    color: #999;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .detalle-edit-input {
                    background: #FFC107;
                    color: #1a1a1a;
                    font-size: 1.3rem;
                    font-weight: 800;
                    padding: 8px 14px;
                    border-radius: 10px;
                    border: none;
                    outline: none;
                }

                .detalle-icon-btn {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 999px;
                    background: linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 100%);
                    border: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #FFC107;
                    font-size: 1.05rem;
                    transition: transform .15s ease, border-color .15s ease;
                }

                .detalle-icon-btn:hover {
                    transform: translateY(-2px) scale(1.05);
                    border-color: #FFC107;
                }

                /* ── Pokémon cards ── */
                .poke-card {
                    position: relative;
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
                    color: white;
                    border: 2px solid #333 !important;
                    border-radius: 18px !important;
                    overflow: hidden;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.4);
                    transition: border-color .2s ease, transform .15s ease;
                }

                .poke-card:hover {
                    border-color: #e74c3c !important;
                    transform: translateY(-4px);
                }

                .poke-card-nametag {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.7rem;
                    background: linear-gradient(135deg, #ffca28, #FFC107);
                    color: #1a1a1a !important;
                    margin: 10px;
                    padding: 8px 10px;
                    border-radius: 8px;
                    text-align: center;
                }

                .poke-card-img {
                    object-fit: contain;
                    height: 200px;
                    margin-top: 10px;
                    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5));
                }

                .poke-card-title-row {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 14px;
                }

                .poke-card-apodo {
                    color: white;
                    font-weight: 800;
                    margin: 0;
                }

                .poke-card-tipo-img {
                    width: 100px;
                    margin-left: 20px;
                }

                .poke-card-naturaleza {
                    color: #FFC107 !important;
                    margin-bottom: 8px;
                    font-weight: 700;
                }

                .poke-card-naturaleza-valor {
                    color: white;
                }

                .poke-divider {
                    border-color: rgba(255,255,255,0.12);
                    margin: 12px 0;
                }

                .poke-divider--tight {
                    margin: 6px 0 8px;
                }

                .poke-stat-label {
                    color: #ddd;
                    font-size: 0.9rem;
                    letter-spacing: 0.3px;
                }

                .poke-chart-container {
                    background: #151515;
                    padding: 15px 35px 0 0;
                    border-radius: 12px;
                    margin-top: 6px;
                    border: 1px solid #2a2a2a;
                }

                .poke-hab-mov-row {
                    display: flex;
                    justify-content: center;
                }

                .poke-habilidades {
                    width: 98px;
                    margin-right: 30px;
                    flex-shrink: 0;
                }

                .poke-movimientos {
                    width: 90%;
                    margin-right: 20px;
                }

                .poke-subsection-label {
                    color: #FFC107;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.55rem;
                    letter-spacing: 0.3px;
                }

                .poke-hab-item,
                .poke-mov-item {
                    margin: 0;
                    color: #ddd;
                    font-size: 0.9rem;
                }

                .poke-item-section {
                    display: flex;
                    background: #151515;
                    border-radius: 12px;
                    padding: 0 0 10px 20px;
                    border: 1px solid #2a2a2a;
                }

                .poke-item-img {
                    width: 100px;
                    margin: 18px 0;
                }

                .poke-item-info {
                    margin-top: 16px;
                    margin-left: 15px;
                    width: 170px;
                }

                .poke-item-nombre {
                    color: #FFC107;
                    font-weight: 800;
                    font-size: 1.05rem;
                }

                .poke-item-desc {
                    color: #999;
                    font-size: 0.85rem;
                }

                .poke-card-footer {
                    text-align: center;
                    background: transparent !important;
                    border-top: 1px solid #2a2a2a !important;
                    padding: 14px;
                }

                .btn-poke {
                    width: 40%;
                    margin: 0 6px;
                    border: none !important;
                    border-radius: 999px;
                    font-weight: 700;
                    padding: 8px 14px;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-poke:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-poke--editar {
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    box-shadow: 0 3px 0 #b28600;
                }

                .btn-poke--eliminar {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #a62110;
                }

                @media (max-width: 600px) {
                    .poke-hab-mov-row {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .poke-habilidades,
                    .poke-movimientos {
                        width: 100%;
                        margin-right: 0;
                        margin-bottom: 14px;
                    }
                }
            `}</style>
        </>
    );
};

export default DetallePokemon;