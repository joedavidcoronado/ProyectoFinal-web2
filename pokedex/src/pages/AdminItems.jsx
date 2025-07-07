// FRONTEND: AdminItems.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Spinner, Row, Col, Modal } from "react-bootstrap";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const AdminItems = () => {
    const { getAuthUser } = useAuth();
    const { token } = getAuthUser();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [formEditado, setFormEditado] = useState({});
    const [imagenFile, setImagenFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [nuevoItem, setNuevoItem] = useState({ nombre: "", descripcion: "" });

    const fetchItems = async () => {
        try {
            const res = await axios.get("http://localhost:3001/items", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(res.data);
        } catch (error) {
            console.error("Error al cargar items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const guardarCambios = async (id) => {
        try {
            await axios.put(`http://localhost:3001/items/${id}`, formEditado, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (imagenFile) {
                const formData = new FormData();
                formData.append("imagen", imagenFile);
                await axios.post(`http://localhost:3001/imagen/upload/item/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            setEditIndex(null);
            setImagenFile(null);
            fetchItems();
        } catch (error) {
            console.error("Error al guardar cambios:", error);
        }
    };

    const eliminarItem = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchItems();
        } catch (error) {
            console.error("Error al eliminar item:", error);
        }
    };

    const crearItem = async () => {
        try {
            const res = await axios.post("http://localhost:3001/items", nuevoItem, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (imagenFile) {
                const formData = new FormData();
                formData.append("imagen", imagenFile);
                await axios.post(`http://localhost:3001/imagen/upload/item/${res.data.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            setShowModal(false);
            setNuevoItem({ nombre: "", descripcion: "" });
            setImagenFile(null);
            fetchItems();
        } catch (error) {
            console.error("Error al crear item:", error);
        }
    };

    return (
        <>
            <Menu />
            <main className="py-4" style={{ backgroundColor: "#1a1a1a", minHeight: "85vh", color: "white" }}>
                <Container>
                    <div className="d-flex justify-content-left align-items-center mb-3">
                        <h2>Gestión de Items</h2>
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
                            {items.map((item, index) => (
                                <Col key={item.id}>
                                    <Card bg="dark" text="light" className="shadow">
                                        <Card.Img variant="top" src={`http://localhost:3001/uploads/item/${item.id}.png`} style={{ width: '120px', margin: '15px auto 0' }} />
                                        <Card.Body className="text-center">
                                            {editIndex === index ? (
                                                <>
                                                    <Form.Control className="mb-2" value={formEditado.nombre} onChange={(e) => setFormEditado({ ...formEditado, nombre: e.target.value })} />
                                                    <Form.Control className="mb-2" value={formEditado.descripcion} onChange={(e) => setFormEditado({ ...formEditado, descripcion: e.target.value })} />
                                                    <Form.Control className="mb-2" type="file" accept="image/png" onChange={(e) => setImagenFile(e.target.files[0])} />
                                                    <Button variant="success" size="sm" onClick={() => guardarCambios(item.id)}>Guardar</Button>{' '}
                                                    <Button variant="secondary" size="sm" onClick={() => setEditIndex(null)}>Cancelar</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title>{item.nombre}</Card.Title>
                                                    <Card.Text>{item.descripcion}</Card.Text>
                                                    <Button variant="warning" size="sm" onClick={() => { setEditIndex(index); setFormEditado(item); }}>Editar</Button>{' '}
                                                    <Button variant="danger" size="sm" onClick={() => eliminarItem(item.id)}>Eliminar</Button>
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
                <Modal.Header closeButton><Modal.Title>Agregar Item</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control value={nuevoItem.nombre} onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control value={nuevoItem.descripcion} onChange={(e) => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Imagen (.png)</Form.Label>
                            <Form.Control type="file" accept="image/png" onChange={(e) => setImagenFile(e.target.files[0])} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={crearItem}>Crear</Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default AdminItems;