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
        <main className="poke-edit-page">
            <div className="poke-edit-page-noise" />
            <Container className="my-4 poke-edit-container">
            <Row>
                <Col md={6}>
                <Card className="poke-edit-card">
                    <Card.Body className="text-center">
                    {pokemon && (
                        <>
                            <h3 className="poke-edit-nombre">{pokemon.nombre}</h3>
                            <Image
                                src={`http://localhost:3001/uploads/pokemon/${pokemon.id}.png`}
                                className="poke-edit-img mb-3"
                            />
                            <div className="poke-edit-apodo-row">
                                <Card.Text className="poke-edit-apodo-label">Apodo</Card.Text>
                                <Form.Control
                                    id="apodo"
                                    type="text"
                                    value={apodo}
                                    onChange={e => setApodo(e.target.value)}
                                    placeholder="Ingresa apodo"
                                    className="poke-edit-apodo-input"
                                />
                            </div>
                        </>
                    )}
                    <hr className="poke-edit-divider" />
                    <Form.Group>
                    <Form.Label className="poke-edit-form-label">Selecciona hasta 4 movimientos</Form.Label>
                    <Row>
                        {movimientos.map((movimiento) => {
                            const isSelected = movimientosSeleccionados.includes(movimiento.id);
                            return (
                                <Col key={movimiento.id} md={4} className="mb-2">
                                <Card
                                    onClick={() => toggleMovimiento(movimiento.id)}
                                    className={`poke-select-card ${isSelected ? "poke-select-card--activa" : ""}`}
                                >
                                    <Card.Body className="text-center p-2">
                                    <Card.Title className="poke-select-card-title">
                                        {movimiento.nombre}.<br />Power: {movimiento.power}<br />Tipo: {movimiento.categoria}
                                    </Card.Title>
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:3001/uploads/tipo/${movimiento.tipoId}.png`}
                                        className="poke-select-card-tipo-img"
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
                <Card className="poke-edit-card">
                    <Card.Body>
                    <Form.Group controlId="itemSelect">
                        <Form.Label className="poke-edit-section-label">Selecciona un Item</Form.Label>
                        <br />
                        <Form.Select
                            onChange={(e) => setItemSeleccionado(e.target.value)}
                            className="poke-edit-select"
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
                        <div className="poke-edit-item-preview">
                            <hr className="poke-edit-divider" />
                            <Image
                            src={`http://localhost:3001/uploads/item/${itemSeleccionado}.png`}
                            className="poke-edit-item-img mb-2"
                            />
                            <p className="poke-edit-item-desc">{items.find((i) => i.id == itemSeleccionado)?.descripcion}</p>
                        </div>
                        )}
                    </Form.Group>
                    <hr className="poke-edit-divider" />
                    <Form.Group>
                    <Form.Label className="poke-edit-section-label">Selecciona hasta 3 habilidades</Form.Label>
                    <Row>
                        {habilidades.map((habilidad) => {
                        const isSelected = habilidadesSeleccionadas.includes(habilidad.id);
                        return (
                            <Col key={habilidad.id} md={4} className="mb-2">
                            <Card
                                onClick={() => toggleHabilidad(habilidad.id)}
                                className={`poke-select-card ${isSelected ? "poke-select-card--activa" : ""}`}
                            >
                                <Card.Body className="text-center p-2">
                                <Card.Title className="poke-select-card-title">
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

    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

        .poke-edit-page {
            position: relative;
            font-family: 'Nunito', sans-serif;
            background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
            min-height: 90vh;
            color: white;
            padding: 24px 0;
            overflow: hidden;
        }

        .poke-edit-page-noise {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 30px 30px;
            pointer-events: none;
        }

        .poke-edit-container {
            position: relative;
            z-index: 1;
        }

        /* ── Cards contenedoras ── */
        .poke-edit-card {
            background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
            color: white !important;
            border: 2px solid #333 !important;
            border-radius: 18px !important;
            box-shadow: 0 10px 24px rgba(0,0,0,0.4);
            margin-bottom: 24px;
        }

        .poke-edit-nombre {
            color: #FFC107;
            font-weight: 800;
            text-shadow: 0 0 14px rgba(255,193,7,0.4);
        }

        .poke-edit-img {
            width: 150px;
            filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5));
        }

        .poke-edit-apodo-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: auto 20px;
        }

        .poke-edit-apodo-label {
            font-size: 1.1rem;
            color: #ddd;
            margin: 0;
        }

        .poke-edit-apodo-input {
            width: 200px;
            height: 40px;
            background: #151515 !important;
            border: 1px solid #444 !important;
            color: white !important;
            border-radius: 8px !important;
        }

        .poke-edit-apodo-input::placeholder {
            color: #777;
        }

        .poke-edit-divider {
            border-color: rgba(255,255,255,0.12);
            margin: 16px 0;
        }

        .poke-edit-form-label,
        .poke-edit-section-label {
            color: #FFC107;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.65rem;
            letter-spacing: 0.3px;
            margin-bottom: 14px;
            display: inline-block;
        }

        /* ── Select de item ── */
        .poke-edit-select {
            background: #151515 !important;
            border: 1px solid #444 !important;
            color: white !important;
            border-radius: 8px !important;
        }

        .poke-edit-select option {
            background: #1a1a1a;
            color: white;
        }

        .poke-edit-item-preview {
            text-align: center;
            margin-top: 8px;
        }

        .poke-edit-item-img {
            width: 144px;
            margin: 18px 0;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        }

        .poke-edit-item-desc {
            color: #999;
            margin-bottom: 8px;
        }

        /* ── Cards seleccionables (movimientos / habilidades) ── */
        .poke-select-card {
            cursor: pointer;
            background: #1f1f1f !important;
            color: #ccc !important;
            border: 1px solid #333 !important;
            border-radius: 12px !important;
            transition: background-color .2s ease, color .2s ease, border-color .2s ease, transform .15s ease;
        }

        .poke-select-card:hover {
            border-color: #FFC107 !important;
            transform: translateY(-2px);
        }

        .poke-select-card--activa {
            background: linear-gradient(135deg, #ffca28, #FFC107) !important;
            color: #1a1a1a !important;
            border-color: #FFC107 !important;
            box-shadow: 0 0 16px rgba(255,193,7,0.4);
        }

        .poke-select-card-title {
            font-size: 0.9rem;
            margin-bottom: 0;
            font-weight: 700;
        }

        .poke-select-card-tipo-img {
            width: 80px;
            margin: 6px auto 0;
        }
    `}</style>
    </>
);
};

export default PaginaPokemonEquipo;