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
            <main className="admin-mov-page">
                <div className="admin-mov-page-noise" />
                <Container className="admin-mov-container">
                    <div className="admin-mov-header">
                        <h2 className="admin-mov-titulo">Gestión de Movimientos</h2>
                        <span onClick={() => setShowModal(true)} className="admin-mov-add-btn">
                            <FontAwesomeIcon icon={faAdd} />
                        </span>
                    </div>
                    {loading ? (
                        <div className="admin-mov-loading">
                            <Spinner animation="border" className="admin-mov-spinner" />
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {movimientos.map((mov, index) => (
                                <Col key={mov.id}>
                                    <Card className="admin-mov-card">
                                        <Card.Img variant="top" src={`http://localhost:3001/uploads/tipo/${mov.tipoId}.png`} className="admin-mov-card-img" />
                                        <Card.Body className="text-center">
                                            {editIndex === index ? (
                                                <>
                                                    <Form.Control className="mb-2 admin-mov-input" value={formEditado.nombre} onChange={(e) => setFormEditado({ ...formEditado, nombre: e.target.value })} />
                                                    <Form.Select
                                                        className="mb-2 admin-mov-input"
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
                                                    <Form.Control className="mb-2 admin-mov-input" value={formEditado.power} onChange={(e) => setFormEditado({ ...formEditado, power: e.target.value })} placeholder="Power" />
                                                    <Form.Select className="mb-2 admin-mov-input" value={formEditado.categoria} onChange={(e) => setFormEditado({ ...formEditado, categoria: e.target.value })}>
                                                        <option>Físico</option>
                                                        <option>Especial</option>
                                                        <option>Estado</option>
                                                    </Form.Select>
                                                    <Button size="sm" className="btn-admin-mov btn-admin-mov--guardar" onClick={() => guardarCambio(mov.id)}>Guardar</Button>{" "}
                                                    <Button size="sm" className="btn-admin-mov btn-admin-mov--cancelar" onClick={() => setEditIndex(null)}>Cancelar</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title className="admin-mov-nombre">{mov.nombre}</Card.Title>
                                                    <Card.Text className="admin-mov-detalle">
                                                        Power: {mov.power}<br />
                                                        Categoría: {mov.categoria}
                                                    </Card.Text>
                                                    <Button className="btn-admin-mov btn-admin-mov--editar" size="sm" onClick={() => {
                                                        setEditIndex(index);
                                                        setFormEditado(mov);
                                                    }}>Editar</Button>{" "}
                                                    <Button className="btn-admin-mov btn-admin-mov--eliminar" size="sm" onClick={() => deleteMovimiento(mov.id)}>Eliminar</Button>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="admin-mov-modal">
                <Modal.Header closeButton className="admin-mov-modal-header">
                    <Modal.Title className="admin-mov-modal-title">Agregar Movimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body className="admin-mov-modal-body">
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label className="admin-mov-modal-label">Nombre</Form.Label>
                            <Form.Control className="admin-mov-input" value={nuevoMovimiento.nombre} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, nombre: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Group className="mb-2">
                                <Form.Label className="admin-mov-modal-label">Tipo</Form.Label>
                                <Form.Select
                                    className="admin-mov-input"
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
                            <Form.Label className="admin-mov-modal-label">Power</Form.Label>
                            <Form.Control className="admin-mov-input" value={nuevoMovimiento.power} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, power: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="admin-mov-modal-label">Categoría</Form.Label>
                            <Form.Select className="admin-mov-input" value={nuevoMovimiento.categoria} onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, categoria: e.target.value })}>
                                <option>Físico</option>
                                <option>Especial</option>
                                <option>Estado</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="admin-mov-modal-footer">
                    <Button className="btn-admin-mov btn-admin-mov--cancelar" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button className="btn-admin-mov btn-admin-mov--guardar" onClick={crearMovimiento}>Crear</Button>
                </Modal.Footer>
            </Modal>

            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .admin-mov-page {
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 85vh;
                    color: white;
                    padding: 32px 0;
                    overflow: hidden;
                }

                .admin-mov-page-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .admin-mov-container {
                    position: relative;
                    z-index: 1;
                }

                .admin-mov-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 24px;
                }

                .admin-mov-titulo {
                    font-weight: 900;
                    color: #ff5b45;
                    text-shadow: 0 0 16px rgba(231,76,60,0.5);
                    letter-spacing: 0.5px;
                    margin: 0;
                }

                .admin-mov-add-btn {
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

                .admin-mov-add-btn:hover {
                    transform: translateY(-2px) scale(1.05);
                }

                .admin-mov-loading {
                    display: flex;
                    justify-content: center;
                    padding: 60px 0;
                }

                .admin-mov-spinner {
                    color: #FFC107;
                }

                /* ── Cards ── */
                .admin-mov-card {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
                    color: white !important;
                    border: 2px solid #333 !important;
                    border-radius: 18px !important;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.4);
                    transition: border-color .2s ease, transform .15s ease;
                }

                .admin-mov-card:hover {
                    border-color: #e74c3c !important;
                    transform: translateY(-4px);
                }

                .admin-mov-card-img {
                    width: 110px;
                    margin: 18px 0 0 20px;
                    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5));
                }

                .admin-mov-nombre {
                    color: #FFC107;
                    font-weight: 800;
                    margin-bottom: 10px;
                }

                .admin-mov-detalle {
                    color: #ccc;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }

                .admin-mov-input {
                    background: #151515 !important;
                    border: 1px solid #444 !important;
                    color: white !important;
                    border-radius: 8px !important;
                }

                .admin-mov-input::placeholder {
                    color: #666;
                }

                .admin-mov-input:focus {
                    border-color: #FFC107 !important;
                    box-shadow: 0 0 0 3px rgba(255,193,7,0.15) !important;
                }

                .admin-mov-input option {
                    background: #1a1a1a;
                    color: white;
                }

                /* ── Botones ── */
                .btn-admin-mov {
                    border: none !important;
                    border-radius: 999px !important;
                    font-weight: 700;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-admin-mov:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-admin-mov--guardar {
                    background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #1e8449;
                }

                .btn-admin-mov--cancelar {
                    background: linear-gradient(135deg, #3a3a3a, #262626) !important;
                    color: #ccc !important;
                    box-shadow: 0 3px 0 #111;
                }

                .btn-admin-mov--editar {
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    box-shadow: 0 3px 0 #b28600;
                }

                .btn-admin-mov--eliminar {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #a62110;
                }

                /* ── Modal ── */
                .admin-mov-modal .modal-content {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    color: white;
                }

                .admin-mov-modal-header {
                    border-bottom: 1px solid #333 !important;
                }

                .admin-mov-modal-header .btn-close {
                    filter: invert(1);
                }

                .admin-mov-modal-title {
                    color: #FFC107;
                    font-weight: 800;
                }

                .admin-mov-modal-label {
                    color: #999;
                    font-weight: 700;
                    font-size: 0.85rem;
                }

                .admin-mov-modal-footer {
                    border-top: 1px solid #333 !important;
                }

                @media (max-width: 600px) {
                    .admin-mov-header {
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminMovimientos;