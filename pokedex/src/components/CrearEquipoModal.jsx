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
        <Modal show={show} onHide={onClose} centered className="crear-equipo-modal">
            <Modal.Header closeButton className="crear-equipo-modal-header">
                <Modal.Title className="crear-equipo-modal-title">Crear Nuevo Equipo</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="crear-equipo-modal-body">
                    <Form.Group controlId="nombreEquipo">
                        <Form.Label className="crear-equipo-modal-label">Nombre del Equipo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: Los Pikachu Furiosos"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="crear-equipo-input"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="crear-equipo-modal-footer">
                    <Button className="btn-crear-equipo-modal btn-crear-equipo-modal--cancelar" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="btn-crear-equipo-modal btn-crear-equipo-modal--crear">
                        Crear Equipo
                    </Button>
                </Modal.Footer>
            </Form>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .crear-equipo-modal .modal-content {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    color: white;
                    font-family: 'Nunito', sans-serif;
                }

                .crear-equipo-modal-header {
                    border-bottom: 1px solid #333 !important;
                }

                .crear-equipo-modal-header .btn-close {
                    filter: invert(1);
                }

                .crear-equipo-modal-title {
                    color: #FFC107;
                    font-weight: 800;
                }

                .crear-equipo-modal-label {
                    color: #999;
                    font-weight: 700;
                    font-size: 0.85rem;
                }

                .crear-equipo-input {
                    background: #151515 !important;
                    border: 1px solid #444 !important;
                    color: white !important;
                    border-radius: 8px !important;
                }

                .crear-equipo-input::placeholder {
                    color: #666;
                }

                .crear-equipo-input:focus {
                    border-color: #FFC107 !important;
                    box-shadow: 0 0 0 3px rgba(255,193,7,0.15) !important;
                }

                .crear-equipo-modal-footer {
                    border-top: 1px solid #333 !important;
                }

                .btn-crear-equipo-modal {
                    border: none !important;
                    border-radius: 999px !important;
                    font-weight: 700;
                    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
                }

                .btn-crear-equipo-modal:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.08);
                }

                .btn-crear-equipo-modal--cancelar {
                    background: linear-gradient(135deg, #3a3a3a, #262626) !important;
                    color: #ccc !important;
                    box-shadow: 0 3px 0 #111;
                }

                .btn-crear-equipo-modal--crear {
                    background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
                    color: white !important;
                    box-shadow: 0 3px 0 #1e8449;
                }
            `}</style>
        </Modal>
    );
};

export default CrearEquipoModal;