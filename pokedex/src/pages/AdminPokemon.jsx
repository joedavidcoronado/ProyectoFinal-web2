import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Spinner, Row, Col, ProgressBar } from "react-bootstrap";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";

const AdminPokemon = () => {
    const { getAuthUser } = useAuth();
    const { token } = getAuthUser();

    const [pokemones, setPokemones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [formEditado, setFormEditado] = useState({});
    const [imagenFile, setImagenFile] = useState(null);
    const [nuevoPokemon, setNuevoPokemon] = useState({
        nombre: "",
        tipoId: 1,
        hp: 0,
        attack: 0,
        defense: 0,
        spAtk: 0,
        spDef: 0,
        speed: 0
    });
    const [nuevoImagen, setNuevoImagen] = useState(null);

    const [showModal, setShowModal] = useState(false);

    

    const tipos = [
        { id: 1, nombre: "Normal" }, { id: 2, nombre: "Fuego" }, { id: 3, nombre: "Agua" },
        { id: 4, nombre: "Eléctrico" }, { id: 5, nombre: "Planta" }, { id: 6, nombre: "Hielo" },
        { id: 7, nombre: "Lucha" }, { id: 8, nombre: "Veneno" }, { id: 9, nombre: "Tierra" },
        { id: 10, nombre: "Volador" }, { id: 11, nombre: "Psíquico" }, { id: 12, nombre: "Bicho" },
        { id: 13, nombre: "Roca" }, { id: 14, nombre: "Fantasma" }, { id: 15, nombre: "Dragón" },
        { id: 16, nombre: "Siniestro" }, { id: 17, nombre: "Acero" }, { id: 18, nombre: "Hada" }
    ];

    const fetchPokemones = async () => {
        try {
            const res = await axios.get("http://localhost:3001/pokemones", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPokemones(res.data);
        } catch (error) {
            console.error("Error al cargar pokemones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemones();
    }, []);

    const guardarCambios = async (id) => {
        try {
            await axios.put(`http://localhost:3001/pokemones/${id}`, formEditado, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (imagenFile) {
                const formData = new FormData();
                formData.append("imagen", imagenFile);

                await axios.post(`http://localhost:3001/imagen/upload/pokemon/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            setEditIndex(null);
            setImagenFile(null);
            fetchPokemones();
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        }
    };

    const eliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/pokemones/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchPokemones();
        } catch (error) {
            console.error("Error al eliminar movimiento:", error);
        }
    };

    const crearPokemon = async () => {
        try {
            const res = await axios.post("http://localhost:3001/pokemones", nuevoPokemon, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (nuevoImagen) {
                const formData = new FormData();
                formData.append("imagen", nuevoImagen);
                await axios.post(`http://localhost:3001/imagen/upload/pokemon/${res.data.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            setShowModal(false);
            setNuevoPokemon({
                nombre: "",
                tipoId: 1,
                hp: 0,
                attack: 0,
                defense: 0,
                spAtk: 0,
                spDef: 0,
                speed: 0
            });
            setNuevoImagen(null);
            fetchPokemones();
        } catch (error) {
            console.error("Error al crear Pokémon:", error);
        }
    };

    return (
        <>
            <Menu />
            <main className="admin-poke-page">
                <div className="admin-poke-page-noise" />
                <Container className="admin-poke-container">
                    <div className="admin-poke-header">
                        <h2 className="admin-poke-titulo">Gestión de Movimientos</h2>
                        <span onClick={() => setShowModal(true)} className="admin-poke-add-btn">
                            <FontAwesomeIcon icon={faAdd} />
                        </span>
                    </div>
                    {loading ? (
                        <div className="admin-poke-loading">
                            <Spinner animation="border" className="admin-poke-spinner" />
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {pokemones.map((poke, index) => (
                                <Col key={poke.id}>
                                    <Card className="admin-poke-card">
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:3001/uploads/pokemon/${poke.id}.png`}
                                            className="admin-poke-card-img"
                                        />
                                        <Card.Body className="text-center">
                                            {editIndex === index ? (
                                                <>
                                                    <Form.Control className="mb-2 admin-poke-input" value={formEditado.nombre} onChange={(e) => setFormEditado({ ...formEditado, nombre: e.target.value })} />
                                                    <Form.Select className="mb-2 admin-poke-input" value={formEditado.tipoId} onChange={(e) => setFormEditado({ ...formEditado, tipoId: e.target.value })}>
                                                        {tipos.map(tipo => (
                                                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {["hp", "attack", "defense", "spAtk", "spDef", "speed"].map(stat => (
                                                        <div className="mb-2 admin-poke-stat-edit-row" key={stat}>
                                                            <span className="admin-poke-stat-label">{stat.toUpperCase()}</span>
                                                            <Form.Control
                                                                type="number"
                                                                className="admin-poke-input"
                                                                value={formEditado[stat] || 0}
                                                                onChange={(e) => setFormEditado({ ...formEditado, [stat]: parseInt(e.target.value) })}
                                                            />
                                                        </div>
                                                    ))}
                                                    <Form.Control className="mb-2 admin-poke-input" type="file" accept="image/png" onChange={(e) => setImagenFile(e.target.files[0])} />
                                                    <Button className="btn-admin-poke btn-admin-poke--guardar" size="sm" onClick={() => guardarCambios(poke.id)}>Guardar</Button>{' '}
                                                    <Button className="btn-admin-poke btn-admin-poke--cancelar" size="sm" onClick={() => setEditIndex(null)}>Cancelar</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title className="admin-poke-nombre">{poke.nombre}</Card.Title>
                                                    {["hp", "attack", "defense", "spAtk", "spDef", "speed"].map(stat => (
                                                        <div className="admin-poke-stat-row mb-1" key={stat}>
                                                            <strong className="admin-poke-stat-label">{stat.toUpperCase()}:</strong>
                                                            <ProgressBar
                                                                now={poke[stat]}
                                                                max={300}
                                                                className="admin-poke-progressbar"
                                                            />
                                                            <span className="admin-poke-stat-valor">{poke[stat]}</span>
                                                        </div>
                                                    ))}
                                                    <div className="mt-3">
                                                        <Card.Img variant="top" src={`http://localhost:3001/uploads/tipo/${poke.tipoId}.png`} className="admin-poke-tipo-img" />
                                                        <div className="admin-poke-tipo-nombre mt-2">
                                                            <strong>Tipo:</strong> {tipos.find(t => t.id === poke.tipoId)?.nombre || 'Desconocido'}
                                                        </div>
                                                    </div>
                                                    <Button className="btn-admin-poke btn-admin-poke--editar m-1" size="sm" onClick={() => {
                                                        setEditIndex(index);
                                                        setFormEditado(poke);
                                                    }}>Editar</Button>
                                                    <Button className="btn-admin-poke btn-admin-poke--eliminar m-1" size="sm" onClick={() => eliminar(poke.id)}>Eliminar</Button>
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </main>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="admin-poke-modal">
                <Modal.Header closeButton className="admin-poke-modal-header">
                    <Modal.Title className="admin-poke-modal-title">Agregar Pokémon</Modal.Title>
                </Modal.Header>
                <Modal.Body className="admin-poke-modal-body">
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label className="admin-poke-modal-label">Nombre</Form.Label>
                            <Form.Control
                                className="admin-poke-input"
                                value={nuevoPokemon.nombre}
                                onChange={(e) => setNuevoPokemon({ ...nuevoPokemon, nombre: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className="admin-poke-modal-label">Tipo</Form.Label>
                            <Form.Select
                                className="admin-poke-input"
                                value={nuevoPokemon.tipoId}
                                onChange={(e) => setNuevoPokemon({ ...nuevoPokemon, tipoId: parseInt(e.target.value) })}
                            >
                                {tipos.map(tipo => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {["hp", "attack", "defense", "spAtk", "spDef", "speed"].map(stat => (
                            <Form.Group key={stat} className="mb-2 admin-poke-stat-edit-row">
                                <Form.Label className="admin-poke-stat-label">{stat.toUpperCase()}</Form.Label>
                                <Form.Control
                                    type="number"
                                    className="admin-poke-input"
                                    value={nuevoPokemon[stat]}
                                    onChange={(e) => setNuevoPokemon({ ...nuevoPokemon, [stat]: parseInt(e.target.value) })}
                                />
                            </Form.Group>
                        ))}

                        <Form.Group className="mb-2">
                            <Form.Label className="admin-poke-modal-label">Imagen PNG</Form.Label>
                            <Form.Control
                                type="file"
                                className="admin-poke-input"
                                accept="image/png"
                                onChange={(e) => setNuevoImagen(e.target.files[0])}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="admin-poke-modal-footer">
                    <Button className="btn-admin-poke btn-admin-poke--cancelar" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button className="btn-admin-poke btn-admin-poke--guardar" onClick={crearPokemon}>Crear</Button>
                </Modal.Footer>
            </Modal>

            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .admin-poke-page {
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 85vh;
                    color: white;
                    padding: 32px 0;
                    overflow: hidden;
                }

                .admin-poke-page-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .admin-poke-container {
                    position: relative;
                    z-index: 1;
                }

                .admin-poke-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 24px;
                }

                .admin-poke-titulo {
                    font-weight: 900;
                    color: #ff5b45;
                    text-shadow: 0 0 16px rgba(231,76,60,0.5);
                    letter-spacing: 0.5px;
                    margin: 0;
                }

                .admin-poke-add-btn {
                    cursor: pointer;
                    width: 38px;
                    height: 38px;
                    border-radius: 999px;
                    background: linear-gradient(135deg, #ffca28, #FFC107);
                    color: #1a1a1a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 3px 0 #b28600;
                    transition: transform .15s ease;
                    flex-shrink: 0;
                }

                .admin-poke-add-btn:hover {
                    transform: translateY(-2px) scale(1.05);
                }

                .admin-poke-loading {
                    display: flex;
                    justify-content: center;
                    padding: 60px 0;
                }

                .admin-poke-spinner {
                    color: #FFC107;
                }

                /* ── Cards ── */
                .admin-poke-card {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
                    color: white !important;
                    border: 2px solid #333 !important;
                    border-radius: 18px !important;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.4);
                    transition: border-color .2s ease, transform .15s ease;
                }

                .admin-poke-card:hover {
                    border-color: #e74c3c !important;
                    transform: translateY(-4px);
                }

                .admin-poke-card-img {
                    width: 120px;
                    margin: 18px auto 0;
                    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5));
                }

                .admin-poke-nombre {
                    color: #FFC107;
                    font-weight: 800;
                    margin-bottom: 12px;
                }

                .admin-poke-stat-row {
                    display: flex;
                    align-items: center;
                }

                .admin-poke-stat-edit-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .admin-poke-stat-label {
                    width: 80px;
                    flex-shrink: 0;
                    color: #999;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-align: left;
                }

                .admin-poke-progressbar {
                    height: 16px !important;
                    flex-grow: 1;
                    background: #151515 !important;
                    border-radius: 999px !important;
                    overflow: hidden;
                    margin: 0 8px;
                }

                .admin-poke-progressbar .progress-bar {
                    background: linear-gradient(90deg, #FFC107, #ffca28) !important;
                }

                .admin-poke-stat-valor {
                    color: #ddd;
                    font-size: 0.85rem;
                    font-weight: 700;
                    width: 30px;
                    text-align: right;
                }

                .admin-poke-tipo-img {
                    width: 110px;
                    margin: 0 auto;
                }

                .admin-poke-tipo-nombre {
                    color: #ccc;
                    font-size: 0.9rem;
                }

                .admin-poke-input {
                    background: #151515 !important;
                    border: 1px solid #444 !important;
                    color: white !important;
                    border-radius: 8px !important;
                }

                .admin-poke-input::placeholder {
                    color: #666;
                }

                .admin-poke-input:focus {
                    border-color: #FFC107 !important;
                    box-shadow: 0 0 0 3px rgba(255,193,7,0.15) !important;
                }

                .admin-poke-input option {
                    background: #1a1a1a;
                    color: white;
                }

                /* ── Botones ── */
                .btn-admin-poke {
                    border: none !important;
                    border-radius: 999px !important;
                    font-weight: 700;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-admin-poke:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-admin-poke--guardar {
                    background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #1e8449;
                }

                .btn-admin-poke--cancelar {
                    background: linear-gradient(135deg, #3a3a3a, #262626) !important;
                    color: #ccc !important;
                    box-shadow: 0 3px 0 #111;
                }

                .btn-admin-poke--editar {
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    box-shadow: 0 3px 0 #b28600;
                }

                .btn-admin-poke--eliminar {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #a62110;
                }

                /* ── Modal ── */
                .admin-poke-modal .modal-content {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    color: white;
                }

                .admin-poke-modal-header {
                    border-bottom: 1px solid #333 !important;
                }

                .admin-poke-modal-header .btn-close {
                    filter: invert(1);
                }

                .admin-poke-modal-title {
                    color: #FFC107;
                    font-weight: 800;
                }

                .admin-poke-modal-label {
                    color: #999;
                    font-weight: 700;
                    font-size: 0.85rem;
                }

                .admin-poke-modal-footer {
                    border-top: 1px solid #333 !important;
                }

                @media (max-width: 600px) {
                    .admin-poke-header {
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminPokemon;