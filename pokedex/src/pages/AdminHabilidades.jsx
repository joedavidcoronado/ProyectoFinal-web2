import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";


const AdminHabilidades = () => {
    const { getAuthUser } = useAuth();
    const { token } = getAuthUser();

    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [nombreEditado, setNombreEditado] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [nuevaHabilidad, setNuevaHabilidad] = useState("");

    

    const fetchHabilidades = async () => {
        try {
            const res = await axios.get("http://localhost:3001/habilidades", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHabilidades(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar habilidades:", error);
        }
    };

    const guardarCambio = async (id) => {
        try {
            await axios.put(`http://localhost:3001/habilidades/${id}`, 
                { nombre: nombreEditado },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchHabilidades();
            setEditIndex(null);
        } catch (error) {
            console.error("Error al guardar habilidad:", error);
            alert("No se pudo actualizar la habilidad");
        }
    };

    const deleteHabilidad = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/habilidades/${id}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchHabilidades();
        } catch (error) {
            console.error("Error al eliminar habilidad:", error);
            alert("No se pudo eliminar la habilidad");
        }
    };

    useEffect(() => {
        fetchHabilidades();
    }, []);

    const handleCrearHabilidad = async () => {
        if (!nuevaHabilidad.trim()) {
            alert("El nombre de la habilidad no puede estar vacío");
            return;
        }

        try {
            await axios.post(
                "http://localhost:3001/habilidades",
                { nombre: nuevaHabilidad },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowModal(false);
            setNuevaHabilidad("");
            await fetchHabilidades();
        } catch (error) {
            console.error("Error al crear habilidad:", error);
            alert("No se pudo crear la habilidad");
        }
    };


    return (
        <>
            <Menu />
            <main className="admin-hab-page">
                <div className="admin-hab-page-noise" />
                <Container className="admin-hab-container">
                    <div className="admin-hab-header">
                        <h2 className="admin-hab-titulo">Gestión de Habilidades</h2>
                        <span onClick={() => setShowModal(true)} className="admin-hab-add-btn">
                            <FontAwesomeIcon icon={faAdd} />
                        </span>
                    </div>
                    {loading ? (
                        <div className="admin-hab-loading">
                            <Spinner animation="border" className="admin-hab-spinner" />
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {habilidades.map((habilidad) => (
                                <Col key={habilidad.id}>
                                    <Card className="admin-hab-card">
                                        <Card.Body className="d-flex flex-column align-items-center text-center">
                                            {editIndex === habilidad.id ? (
                                                <>
                                                    <Form.Control
                                                        type="text"
                                                        value={nombreEditado}
                                                        onChange={(e) => setNombreEditado(e.target.value)}
                                                        className="mb-3 text-center admin-hab-input"
                                                        style={{ maxWidth: '80%' }}
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            className="btn-admin-hab btn-admin-hab--guardar"
                                                            size="sm"
                                                            onClick={() => guardarCambio(habilidad.id)}
                                                        >
                                                            Guardar
                                                        </Button>
                                                        <Button
                                                            className="btn-admin-hab btn-admin-hab--cancelar"
                                                            size="sm"
                                                            onClick={() => setEditIndex(null)}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title className="admin-hab-nombre mb-3">{habilidad.nombre}</Card.Title>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            className="btn-admin-hab btn-admin-hab--editar"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditIndex(habilidad.id);
                                                                setNombreEditado(habilidad.nombre);
                                                            }}
                                                        >
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            className="btn-admin-hab btn-admin-hab--eliminar"
                                                            size="sm"
                                                            onClick={() => deleteHabilidad(habilidad.id)}
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </div>
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
            <Footer />

            <Modal show={showModal} onHide={() => setShowModal(false)} centered className="admin-hab-modal">
                <Modal.Header closeButton className="admin-hab-modal-header">
                    <Modal.Title className="admin-hab-modal-title">Crear Habilidad</Modal.Title>
                </Modal.Header>
                <Modal.Body className="admin-hab-modal-body">
                    <Form>
                        <Form.Group controlId="nombreHabilidad">
                            <Form.Label className="admin-hab-modal-label">Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej. Intimidación"
                                value={nuevaHabilidad}
                                onChange={(e) => setNuevaHabilidad(e.target.value)}
                                className="admin-hab-input"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="admin-hab-modal-footer">
                    <Button className="btn-admin-hab btn-admin-hab--cancelar" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button className="btn-admin-hab btn-admin-hab--guardar" onClick={handleCrearHabilidad}>
                        Crear
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .admin-hab-page {
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 85vh;
                    color: white;
                    padding: 32px 0;
                    overflow: hidden;
                }

                .admin-hab-page-noise {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .admin-hab-container {
                    position: relative;
                    z-index: 1;
                }

                .admin-hab-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 24px;
                }

                .admin-hab-titulo {
                    font-weight: 900;
                    color: #ff5b45;
                    text-shadow: 0 0 16px rgba(231,76,60,0.5);
                    letter-spacing: 0.5px;
                    margin: 0;
                }

                .admin-hab-add-btn {
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

                .admin-hab-add-btn:hover {
                    transform: translateY(-2px) scale(1.05);
                }

                .admin-hab-loading {
                    display: flex;
                    justify-content: center;
                    padding: 60px 0;
                }

                .admin-hab-spinner {
                    color: #FFC107;
                }

                /* ── Cards ── */
                .admin-hab-card {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
                    color: white !important;
                    border: 2px solid #333 !important;
                    border-radius: 18px !important;
                    box-shadow: 0 10px 24px rgba(0,0,0,0.4);
                    transition: border-color .2s ease, transform .15s ease;
                    height: 100%;
                }

                .admin-hab-card:hover {
                    border-color: #e74c3c !important;
                    transform: translateY(-4px);
                }

                .admin-hab-nombre {
                    color: #FFC107;
                    font-weight: 800;
                    font-size: 1.1rem;
                }

                .admin-hab-input {
                    background: #151515 !important;
                    border: 1px solid #444 !important;
                    color: white !important;
                    border-radius: 8px !important;
                }

                .admin-hab-input::placeholder {
                    color: #666;
                }

                .admin-hab-input:focus {
                    border-color: #FFC107 !important;
                    box-shadow: 0 0 0 3px rgba(255,193,7,0.15) !important;
                }

                /* ── Botones ── */
                .btn-admin-hab {
                    border: none !important;
                    border-radius: 999px !important;
                    font-weight: 700;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-admin-hab:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-admin-hab--guardar {
                    background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #1e8449;
                }

                .btn-admin-hab--cancelar {
                    background: linear-gradient(135deg, #3a3a3a, #262626) !important;
                    color: #ccc !important;
                    box-shadow: 0 3px 0 #111;
                }

                .btn-admin-hab--editar {
                    background: linear-gradient(135deg, #ffca28, #FFC107) !important;
                    color: #1a1a1a !important;
                    box-shadow: 0 3px 0 #b28600;
                }

                .btn-admin-hab--eliminar {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #a62110;
                }

                /* ── Modal ── */
                .admin-hab-modal .modal-content {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    color: white;
                }

                .admin-hab-modal-header {
                    border-bottom: 1px solid #333 !important;
                }

                .admin-hab-modal-header .btn-close {
                    filter: invert(1);
                }

                .admin-hab-modal-title {
                    color: #FFC107;
                    font-weight: 800;
                }

                .admin-hab-modal-label {
                    color: #999;
                    font-weight: 700;
                    font-size: 0.85rem;
                }

                .admin-hab-modal-footer {
                    border-top: 1px solid #333 !important;
                }

                @media (max-width: 600px) {
                    .admin-hab-header {
                        flex-wrap: wrap;
                    }
                }
            `}</style>
        </>
    );
};

export default AdminHabilidades;