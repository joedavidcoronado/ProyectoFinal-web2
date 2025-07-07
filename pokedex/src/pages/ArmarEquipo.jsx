import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import CrearEquipoModal from "../components/CrearEquipoModal";
import SelectPokemonModal from "../components/SelectPokemonModal";
import { useNavigate } from "react-router-dom";

const ArmarEquipo = () => {
    const { getAuthUser } = useAuth();
    const navigate = useNavigate();
    const usuario = getAuthUser();
    const [equipoSelected, setEquipoSelected] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const abrirModal = () => setShowModal(true);
    const cerrarModal = () => setShowModal(false);
    const abrirModal2 = () => setShowModal2(true);
    const cerrarModal2 = () => setShowModal2(false);
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);

    const recargarEquipos = async () => {
        const { token } = getAuthUser();
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/equipos/${usuario.email}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEquipos(response.data);
        } catch (error) {
            console.error("Error al obtener equipos:", error);
        } finally {
            setLoading(false);
        }
    };

    const postNewEquipo = async (equipoData) => {
        const { token } = getAuthUser();

        try {
            await axios.post("http://localhost:3001/equipos/crear", equipoData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await recargarEquipos();
        } catch (error) {
            console.error("Error al crear el equipo:", error);
            alert("Hubo un error al crear el equipo");
        }
    };

    const eliminarEquipo = (equipoId) => async () => {
        const { token } = getAuthUser();
        try {
            await axios.delete(`http://localhost:3001/equipos/${equipoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await recargarEquipos();
        } catch (error) {
            console.error("Error al eliminar el equipo:", error);
            alert("Hubo un error al eliminar el equipo");
        }
    }

    useEffect(() => {
        const fetchEquipos = async () => {
            const { token } = getAuthUser();
            try {
                const response = await axios.get(`http://localhost:3001/equipos/${usuario.email}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEquipos(response.data);
            } catch (error) {
                console.error("Error al obtener equipos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEquipos();
    }, [usuario.email]);

    return (
        <>
            <Menu />
            <main className="py-4" style={{ minHeight: "80vh", backgroundColor: "#272727", color: "white" }}>
                <Container>
                    <h2 className="text-center mb-4">Tus Equipos Pokémon</h2>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : equipos.length === 0 ? (
                        <div className="py-4 text-center">
                            <img src="../../public/avatar.png" alt="img.png" style={{ width: '20%', marginTop: '30px' }} />
                            <p>Aún no tienes equipos creados.</p>
                            <Button onClick={abrirModal2} variant="warning">Crear Nuevo Equipo</Button>
                        </div>
                    ) : (
                        <>
                            <Row>
                                {equipos.map((equipo, index) => (
                                    <Col md={4} key={index} className="mb-4">
                                        <Card className="shadow-sm" style={{width:'370px'}}>
                                            <Card.Body>
                                                <div style={{fontSize:'23px', paddingBottom:'12px', display:'flex', justifyContent:'space-between'}}>
                                                {equipo.nombre}
                                                </div>
                                                <div className="mb-3" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                    {Array.isArray(equipo.pokemonesequipo) && equipo.pokemonesequipo.length > 0 ? (
                                                        equipo.pokemonesequipo.map((pokemon) => (
                                                            <img
                                                                key={pokemon.id}
                                                                src={`http://localhost:3001/uploads/pokemon/${pokemon.pokemonId}.png`}
                                                                alt={pokemon.nombre || "pokemon"}
                                                                style={{ width: 50, height: 50, marginRight: 5 }}
                                                            />
                                                        ))
                                                    ) : (
                                                        <>
                                                            
                                                            <p style={{marginBottom:'25px'}}>Sin pokemones</p>
                                                            <br />
                                                            <br />
                                                        </>
                                                    )}
                                                </div>
                                                <Button variant="warning" className="me-2 mr-2" onClick={() => navigate(`/detalle/${equipo.id}`)}>Detalles</Button>
                                                <Button
                                                    variant="warning"
                                                    className="me-2"
                                                    onClick={() => {
                                                        if (equipo.pokemonesequipo?.length >= 6) {
                                                            alert("No puedes agregar más de 6 Pokémon a un equipo.");
                                                        } else {
                                                            setEquipoSelected(equipo.id);
                                                            abrirModal();
                                                        }
                                                    }}
                                                >
                                                    Crear Pokemon
                                                </Button>
                                                <Button variant="danger" onClick={eliminarEquipo(equipo.id)}>Eliminar</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                            <div className="py-4 text-center">
                                <Button onClick={abrirModal2} variant="warning">Crear Nuevo Equipo</Button>
                            </div>
                        </>
                    )}
                </Container>
            </main>
            <Footer />

            <SelectPokemonModal
                show={showModal}
                onHide={cerrarModal}
                usuarioId={usuario.email}
                equipoId={equipoSelected}
                onEquipoCreado={recargarEquipos}
            />

            <CrearEquipoModal
                show={showModal2}
                onClose={() => {
                    cerrarModal2();
                    recargarEquipos();
                }}
                onCrear={(nombre) => postNewEquipo({ nombre, correo: usuario.email })}
            />
        </>
    );
};

export default ArmarEquipo;
