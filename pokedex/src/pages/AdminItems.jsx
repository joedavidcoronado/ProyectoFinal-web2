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
            <main className="admin-item-page">
                <div className="admin-item-page-noise" />
                <Container className="admin-item-container">
                    <div className="admin-item-header">
                        <h2 className="admin-item-titulo">Gestión de Items</h2>
                        <span onClick={() => setShowModal(true)} className="admin-item-add-btn">
                            <FontAwesomeIcon icon={faAdd} />
                        </span>
                    </div>
                    {loading ? (
                        <div className="admin-item-loading">
                            <Spinner animation="border" className="admin-item-spinner" />
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {items.map((item, index) => (
                                <Col key={item.id}>
                                    <Card className="admin-item-card">
                                        <Card.Img variant="top" src={`http://localhost:3001/uploads/item/${item.id}.png`} className="admin-item-card-img" />
                                        <Card.Body className="text-center">
                                            {editIndex === index ? (
                                                <>
                                                    <Form.Control className="mb-2 admin-item-input" value={formEditado.nombre} onChange={(e) => setFormEditado({ ...formEditado, nombre: e.target.value })} />
                                                    <Form.Control className="mb-2 admin-item-input" value={formEditado.descripcion} onChange={(e) => setFormEditado({ ...formEditado, descripcion: e.target.value })} />
                                                    <Form.Control className="mb-2 admin-item-input" type="file" accept="image/png" onChange={(e) => setImagenFile(e.target.files[0])} />
                                                    <Button className="btn-admin-item btn-admin-item--guardar" size="sm" onClick={() => guardarCambios(item.id)}>Guardar</Button>{' '}
                                                    <Button className="btn-admin-item btn-admin-item--cancelar" size="sm" onClick={() => setEditIndex(null)}>Cancelar</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title className="admin-item-nombre">{item.nombre}</Card.Title>
                                                    <Card.Text className="admin-item-desc">{item.descripcion}</Card.Text>
                                                    <Button className="btn-admin-item btn-admin-item--editar" size="sm" onClick={() => { setEditIndex(index); setFormEditado(item); }}>Editar</Button>{' '}
                                                    <Button className="btn-admin-item btn-admin-item--eliminar" size="sm" onClick={() => eliminarItem(item.id)}>Eliminar</Button>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="admin-item-modal">
                <Modal.Header closeButton className="admin-item-modal-header">
                    <Modal.Title className="admin-item-modal-title">Agregar Item</Modal.Title>
                </Modal.Header>
                <Modal.Body className="admin-item-modal-body">
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label className="admin-item-modal-label">Nombre</Form.Label>
                            <Form.Control className="admin-item-input" value={nuevoItem.nombre} onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="admin-item-modal-label">Descripción</Form.Label>
                            <Form.Control className="admin-item-input" value={nuevoItem.descripcion} onChange={(e) => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="admin-item-modal-label">Imagen (.png)</Form.Label>
                            <Form.Control type="file" className="admin-item-input" accept="image/png" onChange={(e) => setImagenFile(e.target.files[0])} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="admin-item-modal-footer">
                    <Button className="btn-admin-item btn-admin-item--cancelar" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button className="btn-admin-item btn-admin-item--guardar" onClick={crearItem}>Crear</Button>
                </Modal.Footer>
            </Modal>

            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .admin-item-page {
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 85vh;
                    color: white;
                    padding: 32px 0;
                    overflow: hidden;
                }

                .admin-item-page-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .admin-item-container {
                    position: relative;
                    z-index: 1;
                }

                .admin-item-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 24px;
                }

                .admin-item-titulo {
                    font-weight: 900;
                    color: #ff5b45;
                    text-shadow: 0 0 16px rgba(231,76,60,0.5);
                    letter-spacing: 0.5px;
                    margin: 0;
                }

                .admin-item-add-btn {
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

                .admin-item-add-btn:hover {
                    transform: translateY(-2px) scale(1.05);
                }

                .admin-item-loading {
                    display: flex;
                    justify-content: center;
                    padding: 60px 0;
                }

                .admin-item-spinner {
                    color: #FFC107;
                }

                /* ── Cards ── */
                .admin-item-card {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
                    color: white !important;
                    border: 2px solid #333 !important;
                    border-radius: 18px !important;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.4);
                    transition: border-color .2s ease, transform .15s ease;
                }

                .admin-item-card:hover {
                    border-color: #e74c3c !important;
                    transform: translateY(-4px);
                }

                .admin-item-card-img {
                    width: 120px;
                    margin: 18px auto 0;
                    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5));
                }

                .admin-item-nombre {
                    color: #FFC107;
                    font-weight: 800;
                    margin-bottom: 8px;
                }

                .admin-item-desc {
                    color: #ccc;
                    font-size: 0.9rem;
                    margin-bottom: 14px;
                }

                .admin-item-input {
                    background: #151515 !important;
                    border: 1px solid #444 !important;
                    color: white !important;
                    border-radius: 8px !important;
                }

                .admin-item-input::placeholder {
                    color: #666;
                }

                .admin-item-input:focus {
                    border-color: #FFC107 !important;
                    box-shadow: 0 0 0 3px rgba(255,193,7,0.15) !important;
                }

                /* ── Botones ── */
                .btn-admin-item {
                    border: none !important;
                    border-radius: 999px !important;
                    font-weight: 700;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-admin-item:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-admin-item--guardar {
                    background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #1e8449;
                }

                .btn-admin-item--cancelar {
                    background: linear-gradient(135deg, #3a3a3a, #262626) !important;
                    color: #ccc !important;
                    box-shadow: 0 3px 0 #111;
                }

                .btn-admin-item--editar {
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    box-shadow: 0 3px 0 #b28600;
                }

                .btn-admin-item--eliminar {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #a62110;
                }

                /* ── Modal ── */
                .admin-item-modal .modal-content {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    color: white;
                }

                .admin-item-modal-header {
                    border-bottom: 1px solid #333 !important;
                }

                .admin-item-modal-header .btn-close {
                    filter: invert(1);
                }

                .admin-item-modal-title {
                    color: #FFC107;
                    font-weight: 800;
                }

                .admin-item-modal-label {
                    color: #999;
                    font-weight: 700;
                    font-size: 0.85rem;
                }

                .admin-item-modal-footer {
                    border-top: 1px solid #333 !important;
                }

                @media (max-width: 600px) {
                    .admin-item-header {
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminItems;