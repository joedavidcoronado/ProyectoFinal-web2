import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const CrearEquipoModal = ({ show, onClose, onCrear }) => {
    const [nombre, setNombre] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        onCrear(nombre.trim());
        setNombre("");
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crear Nuevo Equipo</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group controlId="nombreEquipo">
                        <Form.Label>Nombre del Equipo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Los Pikachu Furiosos"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="success">
                        Crear Equipo
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CrearEquipoModal;
