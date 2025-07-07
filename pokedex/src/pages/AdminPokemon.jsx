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
            <main className="py-4" style={{ backgroundColor: "#1a1a1a", minHeight: "85vh", color: "white" }}>
                <Container>
                    <div className="d-flex justify-content-left align-items-center mb-3">
                        <h2>Gestión de Movimientos</h2>
                        <span onClick={() => setShowModal(true)}  style={{cursor: 'pointer', marginTop:'04px'}}>
                            <FontAwesomeIcon icon={faAdd} style={{ color:'#FFC107', width:'26px', height:'26px', marginBottom:'0px', marginLeft:'10px'}} />
                        </span>
                    </div>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="warning" />
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {pokemones.map((poke, index) => (
                                <Col key={poke.id}>
                                    <Card bg="black" text="light" className="shadow">
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:3001/uploads/pokemon/${poke.id}.png`}
                                            style={{ width: '120px', margin: '15px auto 0' }}
                                        />
                                        <Card.Body className="text-center">
                                            {editIndex === index ? (
                                                <>
                                                    <Form.Control className="mb-2" value={formEditado.nombre} onChange={(e) => setFormEditado({ ...formEditado, nombre: e.target.value })} />
                                                    <Form.Select className="mb-2" value={formEditado.tipoId} onChange={(e) => setFormEditado({ ...formEditado, tipoId: e.target.value })}>
                                                        {tipos.map(tipo => (
                                                            <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {["hp", "attack", "defense", "spAtk", "spDef", "speed"].map(stat => (
                                                        <div className="mb-2 d-flex align-items-center" key={stat}>
                                                            <span style={{ width: '80px' }}>{stat.toUpperCase()}</span>
                                                            <Form.Control
                                                                type="number"
                                                                value={formEditado[stat] || 0}
                                                                onChange={(e) => setFormEditado({ ...formEditado, [stat]: parseInt(e.target.value) })}
                                                            />
                                                        </div>
                                                    ))}
                                                    <Form.Control className="mb-2" type="file" accept="image/png" onChange={(e) => setImagenFile(e.target.files[0])} />
                                                    <Button variant="success" size="sm" onClick={() => guardarCambios(poke.id)}>Guardar</Button>{' '}
                                                    <Button variant="secondary" size="sm" onClick={() => setEditIndex(null)}>Cancelar</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title>{poke.nombre}</Card.Title>
                                                    {["hp", "attack", "defense", "spAtk", "spDef", "speed"].map(stat => (
                                                        <div className="d-flex align-items-center mb-1" key={stat}>
                                                            <strong className="me-2" style={{ width: '80px' }}>{stat.toUpperCase()}:</strong>
                                                            <ProgressBar
                                                                now={poke[stat]}
                                                                max={300}
                                                                variant="success"
                                                                style={{ height: "20px", flexGrow: 1 }}
                                                            />
                                                            <span className="ms-2">{poke[stat]}</span>
                                                        </div>
                                                    ))}
                                                    <div className="mt-3">
                                                        <Card.Img variant="top" src={`http://localhost:3001/uploads/tipo/${poke.tipoId}.png`} style={{ width: '110px' }} />
                                                        <div className="mt-2">
                                                            <strong>Tipo:</strong> {tipos.find(t => t.id === poke.tipoId)?.nombre || 'Desconocido'}
                                                        </div>
                                                    </div>
                                                    <Button className="m-1" variant="warning" size="sm" onClick={() => {
                                                        setEditIndex(index);
                                                        setFormEditado(poke);
                                                    }}>Editar</Button>
                                                    <Button className="m-1" variant="danger" size="sm" onClick={() => eliminar(poke.id)}>Eliminar</Button>
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
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Pokémon</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                value={nuevoPokemon.nombre}
                                onChange={(e) => setNuevoPokemon({ ...nuevoPokemon, nombre: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select
                                value={nuevoPokemon.tipoId}
                                onChange={(e) => setNuevoPokemon({ ...nuevoPokemon, tipoId: parseInt(e.target.value) })}
                            >
                                {tipos.map(tipo => (
                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {["hp", "attack", "defense", "spAtk", "spDef", "speed"].map(stat => (
                            <Form.Group key={stat} className="mb-2 d-flex align-items-center">
                                <Form.Label style={{ width: '80px' }}>{stat.toUpperCase()}</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={nuevoPokemon[stat]}
                                    onChange={(e) => setNuevoPokemon({ ...nuevoPokemon, [stat]: parseInt(e.target.value) })}
                                />
                            </Form.Group>
                        ))}

                        <Form.Group className="mb-2">
                            <Form.Label>Imagen PNG</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/png"
                                onChange={(e) => setNuevoImagen(e.target.files[0])}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={crearPokemon}>Crear</Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default AdminPokemon;