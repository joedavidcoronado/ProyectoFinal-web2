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
            <main className="py-4" style={{ minHeight: "85vh", backgroundColor: "#272727", color: "white" }}>
                <Container>
                    <div style={{display:'flex'}}>
                        <h2 className="text-center mb-4">Gestión de Habilidades</h2>
                        <span onClick={() =>setShowModal(true)} style={{cursor: 'pointer', marginTop:'10px'}}>
                            <FontAwesomeIcon icon={faAdd} style={{ color:'#FFC107', width:'26px', height:'26px', marginBottom:'0px', marginLeft:'10px'}}/>
                        </span>
                    </div>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="warning" />
                        </div>
                    ) : (
                        <Row xs={1} md={2} lg={3} className="g-4">
                            {habilidades.map((habilidad) => (
                                <Col key={habilidad.id}>
                                    <Card bg="black" text="light" className="shadow">
                                        <Card.Body className="d-flex flex-column align-items-center text-center">
                                            {editIndex === habilidad.id ? (
                                                <>
                                                    <Form.Control
                                                        type="text"
                                                        value={nombreEditado}
                                                        onChange={(e) => setNombreEditado(e.target.value)}
                                                        className="mb-2 text-center"
                                                        style={{ maxWidth: '80%' }}
                                                    />
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => guardarCambio(habilidad.id)}
                                                        >
                                                            Guardar
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => setEditIndex(null)}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Card.Title className="mb-3">{habilidad.nombre}</Card.Title>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="warning"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditIndex(habilidad.id);
                                                                setNombreEditado(habilidad.nombre);
                                                            }}
                                                        >
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="danger"
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Habilidad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="nombreHabilidad">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej. Intimidación"
                                value={nuevaHabilidad}
                                onChange={(e) => setNuevaHabilidad(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleCrearHabilidad}>
                        Crear
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default AdminHabilidades;
