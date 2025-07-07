import { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Image } from "react-bootstrap";
import axios from "axios";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import StatsComponent from "../components/StatsComponent";

const PaginaPokemonEquipo = () => {
    const { getAuthUser } = useAuth(true);

    const { pokemonId, equipoId } = useParams();
    
    const [pokemon, setPokemon] = useState(null);
    const [edit, setEdit] = useState(false);
    const [items, setItems] = useState([]);
    const [habilidades, setHabilidades] = useState([]);
    const [naturalezas, setNaturalezas] = useState([]);
    const [naturalezaSelect, setNaturalezaSelect] = useState(null);
    const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState([]);
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    const [movimientos, setMovimientos] = useState([]);
    const [movimientosSeleccionados, setMovimientosSeleccionados] = useState([]);
    const [apodo, setApodo] = useState(''); 
    const [evsSelect, setEvsSelect] = useState(null);
    const [ivsSelect, setIvsSelect] = useState(null);

    useEffect(() => {
        const fetchDatos = async () => {
        const { token } = getAuthUser();
        try {
            const [resPokemon, resItems, resHabilidades, resMovimientos, resNaturalezas] = await Promise.all([
                axios.get(`http://localhost:3001/pokemones/${pokemonId}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:3001/items", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:3001/habilidades", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`http://localhost:3001/movimientos/${pokemonId}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:3001/naturalezas", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setPokemon(resPokemon.data);
            setItems(resItems.data);
            setHabilidades(resHabilidades.data);
            setMovimientos(resMovimientos.data); 
            setNaturalezas(resNaturalezas.data);

            const resEquipo = await axios.get(`http://localhost:3001/pokemones_equipo/${pokemonId}/${equipoId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const dataEquipo = resEquipo.data;
            if (dataEquipo) {
                setEdit(true);
                setApodo(dataEquipo.apodo);
                setItemSeleccionado(dataEquipo.itemId);
                setNaturalezaSelect(dataEquipo.naturaleza);
                setEvsSelect({
                    hp: dataEquipo.ev_hp,
                    attack: dataEquipo.ev_attack,
                    defense: dataEquipo.ev_defense,
                    spAtk: dataEquipo.ev_sp_atk,
                    spDef: dataEquipo.ev_sp_def,
                    speed: dataEquipo.ev_speed
                });
                setIvsSelect({
                    hp: dataEquipo.iv_hp,
                    attack: dataEquipo.iv_attack,
                    defense: dataEquipo.iv_defense,
                    spAtk: dataEquipo.iv_sp_atk,
                    spDef: dataEquipo.iv_sp_def,
                    speed: dataEquipo.iv_speed
                });
                setTimeout(() => {
                    setHabilidadesSeleccionadas(dataEquipo.habilidadesRel?.map(h => h.id));
                    setMovimientosSeleccionados(dataEquipo.movimientosRel?.map(m => m.id));
                }, 0);
            }


        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };
    fetchDatos();
    }, [pokemonId, equipoId]);


    const toggleHabilidad = (id) => {
        const intId = parseInt(id);
        if (habilidadesSeleccionadas.includes(intId)) {
        setHabilidadesSeleccionadas(habilidadesSeleccionadas.filter((h) => h !== intId));
        } else if (habilidadesSeleccionadas.length < 3) {
        setHabilidadesSeleccionadas([...habilidadesSeleccionadas, intId]);
        }
    };

    const toggleMovimiento = (id) => {
        const intId = parseInt(id);
        if (movimientosSeleccionados.includes(intId)) {
        setMovimientosSeleccionados(movimientosSeleccionados.filter((h) => h !== intId));
        } else if (movimientosSeleccionados.length < 4) {
            setMovimientosSeleccionados([...movimientosSeleccionados, intId]);
        }
    };

    return (
        <>
        <Menu />
        <main
            className="py-3"
            style={{
            backgroundColor: "#272727",
            minHeight: "90vh",
            color: "white",
            }}
        >
            <Container className="my-4">
            <Row>
                <Col md={6}>
                <Card className="mb-4 bg-black text-white shadow-lg border-0">
                    <Card.Body className="text-center">
                    {pokemon && (
                        <>
                            <h3 style={{color: '#FFC107'}}>{pokemon.nombre}</h3>
                            <Image
                                src={`http://localhost:3001/uploads/pokemon/${pokemon.id}.png`}
                                style={{ width: "150px" }}
                                className="mb-3"
                            />
                            <div style={{display: 'flex', margin: 'auto 20px'}}>
                                <Card.Text style={{fontSize:'18px', marginLeft:'100px'}}>Apodo</Card.Text>
                                <Form.Control
                                    id="apodo"
                                    type="text"
                                    value={apodo}
                                    onChange={e => setApodo(e.target.value)}
                                    placeholder="Ingresa apodo"
                                    style={{ width: '200px', marginLeft: '10px', height: '40px' }}
                                />
                            </div>
                        </>
                    )}
                    <hr className="border-light" />
                    <Form.Group>
                    <Form.Label>Selecciona hasta 4 movimientos</Form.Label>
                    <Row>
                        {movimientos.map((movimiento) => {
                            const isSelected = movimientosSeleccionados.includes(movimiento.id);
                            return (
                                <Col key={movimiento.id} md={4} className="mb-2">
                                <Card
                                    onClick={() => toggleMovimiento(movimiento.id)}
                                    className={isSelected ? "border-warning" : ""}
                                    style={{
                                    cursor: "pointer",
                                    backgroundColor: isSelected ? "#FFC107" : "white",
                                    color: isSelected ? "white" : "black",
                                    transition: "background-color 0.3s, color 0.3s",
                                    }}
                                >
                                    <Card.Body className="text-center p-2">
                                    <Card.Title style={{ fontSize: "1rem", marginBottom: 0 }}>
                                        {movimiento.nombre}.<br />Power: {movimiento.power}<br />Tipo: {movimiento.categoria}
                                    </Card.Title>
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:3001/uploads/tipo/${movimiento.tipoId}.png`}
                                        style={{ width: "80px" }}
                                    />
                                    </Card.Body>
                                </Card>
                                </Col>
                            );
                        })}
                    </Row>
                    </Form.Group>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={6}>
                <Card className="mb-4 bg-black text-white shadow-lg border-0">
                    <Card.Body>
                    <Form.Group controlId="itemSelect">
                        <Form.Label style={{color:'#FFC107', fontSize:'20px'}}>Selecciona un Item</Form.Label>
                        <br />
                        <Form.Select
                            onChange={(e) => setItemSeleccionado(e.target.value)}
                            className="bg-dark text-white"
                        >
                            <option value="">-- Seleccionar --</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                {item.nombre}
                                </option>
                            ))}
                        </Form.Select>
                        <br />
                        {itemSeleccionado && (
                        <div className="mt-2 text-center">
                            <hr />
                            <Image
                            src={`http://localhost:3001/uploads/item/${itemSeleccionado}.png`}
                            style={{ width: "80px" , margin:'18px 0px'}}
                            className="mb-2"
                            />
                            <p style={{marginBottom:'33px'}}>{items.find((i) => i.id == itemSeleccionado)?.descripcion}</p>
                        </div>
                        )}
                    </Form.Group>
                    <hr className="border-light" />
                    <Form.Group>
                    <Form.Label style={{color:'#FFC107', fontSize:'20px', fontWeight:'bold'}}>Selecciona hasta 3 habilidades</Form.Label>
                    <Row>
                        {habilidades.map((habilidad) => {
                        const isSelected = habilidadesSeleccionadas.includes(habilidad.id);
                        return (
                            <Col key={habilidad.id} md={4} className="mb-2">
                            <Card
                                onClick={() => toggleHabilidad(habilidad.id)}
                                className={isSelected ? "border-warning" : ""}
                                style={{
                                cursor: "pointer",
                                backgroundColor: isSelected ? "#FFC107" : "white", 
                                color: isSelected ? "white" : "black",
                                transition: "background-color 0.3s, color 0.3s",
                                }}
                            >
                                <Card.Body className="text-center p-2">
                                <Card.Title style={{ fontSize: "1rem", marginBottom: 0 }}>
                                    {habilidad.nombre}
                                </Card.Title>
                                </Card.Body>
                            </Card>
                            </Col>
                        );
                        })}
                    </Row>
                    </Form.Group>

                </Card.Body>
                </Card>
            </Col>
        </Row>
        <StatsComponent 
            stats={pokemon} 
            naturalezas={naturalezas} 
            equipoId={equipoId}
            apodo={apodo}
            pokemonId={pokemonId}
            itemId={itemSeleccionado}
            habilidadesSeleccionadas={habilidadesSeleccionadas}
            movimientosSeleccionados={movimientosSeleccionados}
            tipoId={pokemon?.tipoId}
            para={edit}
            naturalezaSelect={naturalezaSelect}
            evsSelect={evsSelect}
            ivsSelect={ivsSelect}
        />

        </Container>
    </main>
    <Footer />
    </>
);
};

export default PaginaPokemonEquipo;
