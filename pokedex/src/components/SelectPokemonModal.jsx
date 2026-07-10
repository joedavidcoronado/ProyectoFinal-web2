import { useEffect, useState } from "react";
import { Modal, Button, Card, Row, Col, Form, InputGroup } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SelectPokemonModal = ({ show, onHide, equipoId}) => {
    const { getAuthUser } = useAuth(true);
    const navigate = useNavigate();

    const [pokemonesDisponibles, setPokemonesDisponibles] = useState([]);
    const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        if (show) {
            cargarTodosLosPokemones();
            setPokemonSeleccionado(null);
            setBusqueda("");
        }
    }, [show]);

    const cargarTodosLosPokemones = async () => {
        const { token } = getAuthUser();
        try {
            const res = await axios.get("http://localhost:3001/pokemones", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPokemonesDisponibles(res.data);
        } catch (error) {
            console.error("Error al cargar pokemones:", error);
        }
    };

    const buscarPokemon = async () => {
        if (!busqueda.trim()) {
            cargarTodosLosPokemones();
            return;
        }
        const { token } = getAuthUser();
        try {
            const res = await axios.get(`http://localhost:3001/pokemones/buscar/${busqueda}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPokemonesDisponibles(res.data);
        } catch (error) {
            console.error("Error al buscar pokémon:", error);
            setPokemonesDisponibles([]);
        }
    };

    const seleccionarPokemon = (pokemon) => {
        setPokemonSeleccionado(pokemon.id === pokemonSeleccionado?.id ? null : pokemon);
    };

    const irAPagina = () => {
        if (pokemonSeleccionado) {
            onHide();
            navigate(`/pokemon/${pokemonSeleccionado.id}/${equipoId}`);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="select-poke-modal">
            <Modal.Header closeButton className="select-poke-modal-header">
                <Modal.Title className="select-poke-modal-title">
                    Selecciona tu Pokémon{" "}
                    <strong className="select-poke-modal-elegido">
                        {pokemonSeleccionado ? pokemonSeleccionado.nombre : "Ninguno"}
                    </strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="select-poke-modal-body">
                <p className="select-poke-hint">Solo puedes elegir un Pokémon:</p>

                <InputGroup className="mb-3 select-poke-search">
                    <Form.Control
                        type="text"
                        placeholder="Buscar Pokémon por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="select-poke-search-input"
                    />
                    <Button className="btn-select-poke--buscar" onClick={buscarPokemon}>Buscar</Button>
                </InputGroup>

                <Row>
                    {pokemonesDisponibles.length === 0 ? (
                        <p className="select-poke-empty text-center">No se encontraron Pokémon.</p>
                    ) : (
                        pokemonesDisponibles.map(pokemon => (
                            <Col key={pokemon.id} md={4} className="mb-2">
                                <Card
                                    onClick={() => seleccionarPokemon(pokemon)}
                                    className={`select-poke-card ${pokemonSeleccionado?.id === pokemon.id ? "select-poke-card--activa" : ""}`}
                                >
                                    <Card.Body className="text-center">
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:3001/uploads/pokemon/${pokemon.id}.png`}
                                            className="select-poke-card-img"
                                        />
                                        <Card.Title className="select-poke-card-title">{pokemon.nombre}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Modal.Body>
            <Modal.Footer className="select-poke-modal-footer">
                <Button className="btn-select-poke btn-select-poke--cancelar" onClick={onHide}>Cancelar</Button>
                <Button
                    className="btn-select-poke btn-select-poke--armar"
                    onClick={irAPagina}
                    disabled={!pokemonSeleccionado}
                >
                    Armar Pokemon
                </Button>
            </Modal.Footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .select-poke-modal .modal-content {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    color: white;
                    font-family: 'Nunito', sans-serif;
                }

                .select-poke-modal-header {
                    border-bottom: 1px solid #333 !important;
                }

                .select-poke-modal-header .btn-close {
                    filter: invert(1);
                }

                .select-poke-modal-title {
                    color: #FFC107;
                    font-weight: 800;
                    font-size: 1.15rem;
                }

                .select-poke-modal-elegido {
                    color: #ff5b45;
                    font-size: 1.3rem;
                    text-shadow: 0 0 10px rgba(231,76,60,0.4);
                }

                .select-poke-modal-body {
                    max-height: 60vh;
                    overflow-y: auto;
                }

                .select-poke-hint {
                    color: #999;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .select-poke-search-input {
                    background: #151515 !important;
                    border: 1px solid #444 !important;
                    color: white !important;
                }

                .select-poke-search-input::placeholder {
                    color: #666;
                }

                .select-poke-search-input:focus {
                    border-color: #FFC107 !important;
                    box-shadow: 0 0 0 3px rgba(255,193,7,0.15) !important;
                }

                .btn-select-poke--buscar {
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    border: none !important;
                    font-weight: 700;
                }

                .select-poke-empty {
                    width: 100%;
                    color: #999;
                    padding: 24px 0;
                }

                /* ── Cards de selección ── */
                .select-poke-card {
                    cursor: pointer;
                    background: #1f1f1f !important;
                    border: 1px solid #333 !important;
                    border-radius: 12px !important;
                    transition: border-color .2s ease, transform .15s ease, box-shadow .2s ease;
                }

                .select-poke-card:hover {
                    border-color: #FFC107 !important;
                    transform: translateY(-2px);
                }

                .select-poke-card--activa {
                    border-color: #FFC107 !important;
                    background: linear-gradient(160deg, #2a2410 0%, #1f1f1f 100%) !important;
                    box-shadow: 0 0 16px rgba(255,193,7,0.35);
                }

                .select-poke-card-img {
                    width: 80px;
                    margin: 6px auto 0;
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
                }

                .select-poke-card-title {
                    color: white;
                    font-size: 0.9rem;
                    font-weight: 700;
                    margin-top: 6px;
                }

                .select-poke-modal-footer {
                    border-top: 1px solid #333 !important;
                }

                .btn-select-poke {
                    border: none !important;
                    border-radius: 999px !important;
                    font-weight: 700;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-select-poke:hover:not(:disabled) {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-select-poke--cancelar {
                    background: linear-gradient(135deg, #3a3a3a, #262626) !important;
                    color: #ccc !important;
                    box-shadow: 0 3px 0 #111;
                }

                .btn-select-poke--armar {
                    background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #1e8449;
                }

                .btn-select-poke--armar:disabled {
                    background: #2a2a2a !important;
                    color: #666 !important;
                    box-shadow: none !important;
                    cursor: not-allowed;
                }
            `}</style>
        </Modal>
    );
};

export default SelectPokemonModal;