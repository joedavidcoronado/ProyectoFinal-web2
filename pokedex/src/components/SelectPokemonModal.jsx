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
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Selecciona tu Pokémon <strong style={{fontSize:'27px'}}> {pokemonSeleccionado ? pokemonSeleccionado.nombre : "Ninguno"}</strong></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Solo puedes elegir un Pokémon:</p>

                <InputGroup className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Buscar Pokémon por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <Button variant="outline-primary" onClick={buscarPokemon}>Buscar</Button>
                </InputGroup>

                <Row>
                    {pokemonesDisponibles.length === 0 ? (
                        <p className="text-center">No se encontraron Pokémon.</p>
                    ) : (
                        pokemonesDisponibles.map(pokemon => (
                            <Col key={pokemon.id} md={4} className="mb-2">
                                <Card
                                    onClick={() => seleccionarPokemon(pokemon)}
                                    className={pokemonSeleccionado?.id === pokemon.id ? "border-primary" : ""}
                                    style={{ cursor: "pointer" }}
                                >
                                    <Card.Body className="text-center">
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:3001/uploads/pokemon/${pokemon.id}.png`}
                                            style={{ width: "80px" }}
                                        />
                                        <Card.Title>{pokemon.nombre}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button
                    variant="success"
                    onClick={irAPagina}
                    disabled={!pokemonSeleccionado}
                >
                    Armar Pokemon
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SelectPokemonModal;
