import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Spinner, Row, Col, Modal } from "react-bootstrap";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const AdminMovimientos = () => {
    const { getAuthUser } = useAuth();
    const { token } = getAuthUser();

    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [formEditado, setFormEditado] = useState({ nombre: "", tipoId: "", power: "", categoria: "Físico" });

    const [showModal, setShowModal] = useState(false);
    const [nuevoMovimiento, setNuevoMovimiento] = useState({ nombre: "", tipoId: "", power: "", categoria: "Físico" });

    const fetchMovimientos = async () => {
        try {
            const res = await axios.get("http://localhost:3001/movimientos/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovimientos(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar movimientos:", error);
        }
    };

    useEffect(() => {
        fetchMovimientos();
    }, []);

    const guardarCambio = async (id) => {
        try {
            await axios.put(`http://localhost:3001/movimientos/${id}`, formEditado, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEditIndex(null);
            await fetchMovimientos();
        } catch (error) {
            console.error("Error al actualizar movimiento:", error);
        }
    };

    const deleteMovimiento = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/movimientos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchMovimientos();
        } catch (error) {
            console.error("Error al eliminar movimiento:", error);
        }
    };

    const crearMovimiento = async () => {
        try {
            await axios.post(`http://localhost:3001/movimientos`, nuevoMovimiento, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowModal(false);
            setNuevoMovimiento({ nombre: "", tipoId: "", power: "", categoria: "Físico" });
            fetchMovimientos();
        } catch (error) {
            console.error("Error al crear movimiento:", error);
        }
    };

    return (
        <>
            <Menu />
            <main className="py-4" style={{ minHeight: "85vh", backgroundColor: "#1a1a1a", color: "white" }}>
                <Container>
                    <div className="d-flex justify-content-left align-items-center mb-3">
                        <h2>Gestión de Movimientos</h2>
                        <span onClick={() => setShowModal(true)} style={{cursor: 'pointer', marginTop:'10px'}}>
                            <FontAwesomeIcon icon={faAdd} style={{ color:'#FFC107', width:'26px', height:'26px', marginBottom:'0px', marginLeft:'10px'}} />
                        </span>
                    </div>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="warning" />
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {movimientos.map((mov, index) => (
                                <Col key={mov.id}>
                                    <Card bg="black" text="light" className="shadow">
                                        <Card.Img variant="top" src={`http://localhost:3001/uploads/tipo/${mov.tipoId}.png`} style={{ width:'110px', margin:'15px 0px 0px 20px'}} />
                                        <Card.Body className="text-center">
                                            {editIndex === index ? (
                                                <>
                                                    <Form.Control className="mb-2" value={formEditado.nombre} onChange={(e) => setFormEditado({ ...formEditado, nombre: e.target.value })} />
                                                    <Form.Select
                                                        className="mb-2"
                                                        value={formEditado.tipoId}
                                                        onChange={(e) => setFormEditado({ ...formEditado, tipoId: e.target.value })}
                                                    >
                                                        <option value="">Seleccionar tipo</option>
                                                        <option value="1">Normal</option>
                                                        <option value="2">Fuego</option>
                                                        <option value="3">Agua</option>
                                                        <option value="4">Eléctrico</option>
                                                        <option value="5">Planta</option>
                                                        <option value="6">Hielo</option>
                                                        <option value="7">Lucha</option>
                                                        <option value="8">Veneno</option>
                                                        <option value="9">Tierra</option>
                                                        <option value="10">Volador</option>
                                                        <option value="11">Psíquico</option>
                                                        <option value="12">Bicho</option>
                                                        <option value="13">Roca</option>
                                                        <option value="14">Fantasma</option>
                                                        <option value="15">Dragón</option>
                                                        <option value="16">Siniestro</option>
                                                        <option value="17">Acero</option>
                                                        <option value="18">Hada</option>
                                                    </Form.Select>
                                                    <Form.Control className="mb-2" value={formEditado.power} onChange={(e) => setFormEditado({ ...formEditado, power: e.target.value })} placeholder="Power" />
                                                    <Form.Select className="mb-2" value={formEditado.categoria} onChange={(e) => setFormEditado({ ...formEditado, categoria: e.target.value })}>
                                                        <option>Físico</option>
                                                        <option>Especial</option>
                                                        <option>Estado</option>
                                                    </Form.Select>
                                                    <Button size="sm" variant="success" onClick={() => guardarCambio(mov.id)}>Guardar</Button>{" "}
                                                    <Button size="sm" variant="secondary" onClick={() => setEditIndex(null)}>Cancelar</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title>{mov.nombre}</Card.Title>
                                                    <Card.Text>
                                                        Power: {mov.power}<br />
                                                        Categoría: {mov.categoria}
                                                    </Card.Text>
                                                    <Button variant="warning" size="sm" onClick={() => {
                                                        setEditIndex(index);
                                                        setFormEditado(mov);
                                                    }}>Editar</Button>{" "}
                                                    <Button variant="danger" size="sm" onClick={() => deleteMovimiento(mov.id)}>Eliminar</Button>
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
                <Modal.Header closeButton><Modal.Title>Agregar Movimiento</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control value={nuevoMovimiento.nombre} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, nombre: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Group className="mb-2">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select
                                    value={nuevoMovimiento.tipoId}
                                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, tipoId: e.target.value })}
                                >
                                    <option value="">Seleccionar tipo</option>
                                    <option value="1">Normal</option>
                                    <option value="2">Fuego</option>
                                    <option value="3">Agua</option>
                                    <option value="4">Eléctrico</option>
                                    <option value="5">Planta</option>
                                    <option value="6">Hielo</option>
                                    <option value="7">Lucha</option>
                                    <option value="8">Veneno</option>
                                    <option value="9">Tierra</option>
                                    <option value="10">Volador</option>
                                    <option value="11">Psíquico</option>
                                    <option value="12">Bicho</option>
                                    <option value="13">Roca</option>
                                    <option value="14">Fantasma</option>
                                    <option value="15">Dragón</option>
                                    <option value="16">Siniestro</option>
                                    <option value="17">Acero</option>
                                    <option value="18">Hada</option>
                                </Form.Select>
                            </Form.Group>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Power</Form.Label>
                            <Form.Control value={nuevoMovimiento.power} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, power: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select value={nuevoMovimiento.categoria} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, categoria: e.target.value })}>
                                <option>Físico</option>
                                <option>Especial</option>
                                <option>Estado</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={crearMovimiento}>Crear</Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default AdminMovimientos;
