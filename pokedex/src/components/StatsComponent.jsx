import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, ProgressBar, Form, Button } from "react-bootstrap";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StatsComponent = ({
    stats,
    naturalezas,
    equipoId,
    apodo,
    pokemonId,
    itemId,
    habilidadesSeleccionadas,
    movimientosSeleccionados,
    tipoId,
    para,
    naturalezaSelect,
    evsSelect = null,   
    ivsSelect = null
    }) => {
    const { getAuthUser } = useAuth(true);
    const navigate = useNavigate();
    const [evs, setEvs] = useState({});
    const [ivs, setIvs] = useState({});
    const [naturaleza, setNaturaleza] = useState(null);

    useEffect(() => {
        if (stats) {
            const keys = ["hp", "attack", "defense", "spAtk", "spDef", "speed"];
            if (para && evsSelect && ivsSelect) {
                setEvs(evsSelect);
                setIvs(ivsSelect);
                setNaturaleza(naturalezaSelect);
            } else {
                const evInicial = Object.fromEntries(keys.map(k => [k, 0]));
                const ivInicial = Object.fromEntries(keys.map(k => [k, 0]));
                setEvs(evInicial);
                setIvs(ivInicial);
            }
        }
    }, [stats, para, evsSelect, ivsSelect, naturalezaSelect]);


    useEffect(() => {
        if (naturalezaSelect) {
            setNaturaleza(naturalezaSelect);
        }
    }, [naturalezaSelect]);

    const postPokemonEquipo = async () => {
        const { token } = getAuthUser();

        if (!naturaleza) {
        alert("Selecciona una naturaleza.");
        return;
        }
        if (!equipoId) {
        alert("No se ha especificado el equipo.");
        return;
        }
        if (!pokemonId) {
        alert("No se ha especificado el Pokémon.");
        return;
        }
        if (!apodo) {
        alert("Por favor, ingresa un apodo para el Pokémon.");
        return;
        }
        if (movimientosSeleccionados.length < 1) {
        alert("Debes seleccionar al menos un movimiento.");
        return;
        }
        if (movimientosSeleccionados.length > 4) {
        alert("No puedes seleccionar más de 4 movimientos.");
        return;
        }
        if (habilidadesSeleccionadas.length < 1) {
        alert("Debes seleccionar al menos una habilidad.");
        return;
        }
        if (habilidadesSeleccionadas.length > 3) {
        alert("No puedes seleccionar más de 3 habilidades.");
        return;
        }
        if (Object.values(evs).reduce((sum, val) => sum + val, 0) > 508) {
        alert("Los EVs totales no pueden superar 508.");
        return;
        }

        try {
        const payload = {
            apodo,
            ev_hp: evs.hp || 0,
            ev_attack: evs.attack || 0,
            ev_defense: evs.defense || 0,
            ev_sp_atk: evs.spAtk || 0,
            ev_sp_def: evs.spDef || 0,
            ev_speed: evs.speed || 0,
            iv_hp: ivs.hp || 0,
            iv_attack: ivs.attack || 0,
            iv_defense: ivs.defense || 0,
            iv_sp_atk: ivs.spAtk || 0,
            iv_sp_def: ivs.spDef || 0,
            iv_speed: ivs.speed || 0,
            itemId,
            tipoId,
            naturalezaId: naturaleza.id,
            pokemonId,
            equipoId,
            movimientos: movimientosSeleccionados,
            habilidades: habilidadesSeleccionadas
        };

        await axios.post("http://localhost:3001/pokemones_equipo", payload, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        navigate(`/equipo`);
        } catch (error) {
        if (error.response) {
            alert("Error: " + (error.response.data.message || "Error desconocido"));
            console.error("Respuesta del servidor:", error.response.data);
        } else {
            alert("Ocurrió un error al guardar el Pokémon.");
        }
        }
    };

    const putPokemonEquipo = async () => {
        const { token } = getAuthUser();

        if (!naturaleza) {
        alert("Selecciona una naturaleza.");
        return;
        }
        if (!equipoId) {
        alert("No se ha especificado el equipo.");
        return;
        }
        if (!pokemonId) {
        alert("No se ha especificado el Pokémon.");
        return;
        }
        if (!apodo) {
        alert("Por favor, ingresa un apodo para el Pokémon.");
        return;
        }
        if (movimientosSeleccionados.length < 1) {
        alert("Debes seleccionar al menos un movimiento.");
        return;
        }
        if (movimientosSeleccionados.length > 4) {
        alert("No puedes seleccionar más de 4 movimientos.");
        return;
        }
        if (habilidadesSeleccionadas.length < 1) {
        alert("Debes seleccionar al menos una habilidad.");
        return;
        }
        if (habilidadesSeleccionadas.length > 3) {
        alert("No puedes seleccionar más de 3 habilidades.");
        return;
        }
        if (Object.values(evs).reduce((sum, val) => sum + val, 0) > 508) {
        alert("Los EVs totales no pueden superar 508.");
        return;
        }

        try {
        const payload = {
            apodo,
            ev_hp: evs.hp || 0,
            ev_attack: evs.attack || 0,
            ev_defense: evs.defense || 0,
            ev_sp_atk: evs.spAtk || 0,
            ev_sp_def: evs.spDef || 0,
            ev_speed: evs.speed || 0,
            iv_hp: ivs.hp || 0,
            iv_attack: ivs.attack || 0,
            iv_defense: ivs.defense || 0,
            iv_sp_atk: ivs.spAtk || 0,
            iv_sp_def: ivs.spDef || 0,
            iv_speed: ivs.speed || 0,
            itemId,
            tipoId,
            naturalezaId: naturaleza.id,
            pokemonId,
            equipoId,
            movimientos: movimientosSeleccionados,
            habilidades: habilidadesSeleccionadas
        };

        await axios.put(`http://localhost:3001/pokemones_equipo/${pokemonId}/${equipoId}`, payload, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        navigate(`/equipo`);
        } catch (error) {
        if (error.response) {
            alert("Error: " + (error.response.data.message || "Error desconocido"));
            console.error("Respuesta del servidor:", error.response.data);
        } else {
            alert("Ocurrió un error al actualizar el Pokémon.");
        }
        }
    };

    const getBonus = (statKey) => {
        if (!naturaleza) return 1;
        if (naturaleza.stacks_beneficiado === statKey) return 1.1;
        if (naturaleza.stacks_perjudicado === statKey) return 0.9;
        return 1;
    };

    const calcStatFinal = (base, iv, ev, bonus, isHp = false) => {
        if (isHp) return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * 100) / 100 + 100);
        return Math.floor(((((2 * base + iv + Math.floor(ev / 4)) * 100) / 100 + 5) * bonus));
    };

    
    const updateEv = (key, value) => {
        const evLimite = 508;
        const evMaxPorStat = 252;
        const nuevoValor = Math.max(0, Math.min(evMaxPorStat, value));
        const totalActual = Object.entries(evs).reduce((sum, [k, v]) => {
            return k === key ? sum : sum + v;
        }, 0);

        const nuevoTotal = totalActual + nuevoValor;

        if (nuevoTotal <= evLimite) {
            setEvs({ ...evs, [key]: nuevoValor });
        } else {
            const valorPermitido = Math.max(0, evLimite - totalActual);
            setEvs({ ...evs, [key]: Math.min(valorPermitido, evMaxPorStat) });
        }
    };


    const updateIv = (key, value) => setIvs({ ...ivs, [key]: Math.min(31, Math.max(0, value)) });

    const getInputColor = (key) => {
        if (!naturaleza) return "white";
        if (naturaleza.stacks_beneficiado === key) return "#28a745";
        if (naturaleza.stacks_perjudicado === key) return "#dc3545";
        return "white";
    };

    if (!stats) {
        return (
        <div className="text-center my-3">
            <Spinner animation="border" variant="warning" />
            <div className="mt-2 text-white">Cargando stats...</div>
        </div>
        );
    }

    const statBars = [
        { label: "HP", key: "hp", color: "success" },
        { label: "ATK", key: "attack", color: "danger" },
        { label: "DEF", key: "defense", color: "primary" },
        { label: "SpA", key: "spAtk", color: "warning" },
        { label: "SpD", key: "spDef", color: "info" },
        { label: "SPE", key: "speed", color: "secondary" },
    ];

    const totalEVsUsados = Object.values(evs).reduce((acc, val) => acc + val, 0);
    const evsRestantes = 508 - totalEVsUsados;

    return (
        <Card className="bg-black text-white shadow-lg border-0 my-3" style={{ fontSize: "0.9rem" }}>
        <Card.Body>
            <h3 className="mb-3">STATS de <strong className="text-warning">{stats.nombre}</strong></h3>
            <hr className="border-light" />
            <Row className="align-items-center mb-2">
            <Col><h4 className="text-warning" style={{ marginLeft: '75px' }}>Base</h4></Col>
            <Col><h4 className="text-warning" style={{ marginLeft: '500px' }}>EVs</h4></Col>
            <Col><h4 className="text-warning" style={{ marginLeft: '180px' }}>IVs</h4></Col>
            <Col><h4 className="text-warning" style={{ marginLeft: '20px', marginRight: '0px' }}>Final</h4></Col>
            </Row>

            {statBars.map(({ label, key, color }) => {
            const base = stats[key];
            const ev = evs[key] || 0;
            const iv = ivs[key] || 0;
            const bonus = getBonus(key);
            const final = calcStatFinal(base, iv, ev, bonus, key === "hp");

            return (
                <Row key={key} className="align-items-center mb-2">
                <Col xs={2} style={{ width: '130px', fontSize: '19px', marginLeft: '30px' }}><strong>{label}</strong></Col>
                <Col xs={2} style={{ width: '50px', fontSize: '19px' }}>{base}</Col>
                <Col style={{ width: '480px', margin: '0px 50px' }}>
                    <ProgressBar
                    now={final}
                    max={300}
                    variant={color}
                    style={{ height: "34px", width: '300px' }}
                    />
                </Col>
                <Col>
                    <input
                    type="number"
                    min={0}
                    max={252}
                    value={ev}
                    onChange={e => updateEv(key, parseInt(e.target.value || 0))}
                    style={{ width: "60px", backgroundColor: getInputColor(key), color: "black" }}
                    />
                </Col>
                <Col>
                    <input
                    type="range"
                    min={0}
                    max={252}
                    value={ev}
                    onChange={e => updateEv(key, parseInt(e.target.value || 0))}
                    />
                </Col>
                <Col>
                    <input
                    type="number"
                    min={0}
                    max={31}
                    value={iv}
                    onChange={e => updateIv(key, parseInt(e.target.value || 0))}
                    style={{ width: "60px", backgroundColor: 'white', color: "black" }}
                    />
                </Col>
                <Col style={{ textAlign: 'center', marginRight: '30px' }}>
                    <span className="text-warning" style={{ fontSize: '20px' }}>{final}</span>
                </Col>
                </Row>
            );
            })}
            <Row className="align-items-center mb-2" style={{ marginRight: '20px' }}>
            <Col className="text-end mt-3 mr-2">
                <h5>Recuerda, te quedan: {evsRestantes}</h5>
            </Col>
            </Row>
            <hr />
            <Row className="align-items-center">
            <Col md={6}>
                <Form.Select
                value={naturaleza?.nombre || ""}
                onChange={e => {
                    const nat = naturalezas.find(n => n.nombre === e.target.value);
                    setNaturaleza(nat);
                }}
                >
                <option value="">Selecciona una naturaleza</option>
                {naturalezas.map(n => (
                    <option key={n.nombre} value={n.nombre}>
                    {n.nombre.toUpperCase()}: +{n.stacks_beneficiado}, -{n.stacks_perjudicado}
                    </option>
                ))}
                </Form.Select>
            </Col>
            <Col>
                {naturaleza && (
                <div className="text-white" style={{ marginLeft: '50px', fontSize: '17px', width: '250px' }}>
                    Afecta positivamente: <span className="text-success"> {naturaleza.stacks_beneficiado}</span><br />
                    Afecta negativamente: <span className="text-danger"> {naturaleza.stacks_perjudicado}</span>
                </div>
                )}
            </Col>
            <Col>
                <Button
                onClick={() => {
                    if (para === false) {
                        postPokemonEquipo();
                    } else {
                        putPokemonEquipo();
                    }
                }}
                variant="success"
                style={{ marginLeft: '30%', fontSize: '17px', width: '70%' }}
                >
                ¡Listo!
                </Button>
            </Col>
            </Row>
        </Card.Body>
        </Card>
    );
};

export default StatsComponent;
