// src/pages/PaginaBatalla.jsx
import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Badge, ProgressBar } from 'react-bootstrap'
import { useAuth } from '../../hooks/useAuth'
import { useBatalla } from '../features/batalla/useBatalla'
import { useGamificacion } from '../features/gamificacion/useGamificacion'
import axios from 'axios'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import { registrarDerrotaDesafio, registrarVictoriaDesafio } from '../features/gamificacion/desafioSlice'
import { useDispatch } from 'react-redux' //

// ── helpers visuales ──────────────────────────────────────────────
const hpColor = (ratio) => ratio > 0.5 ? '#2ecc71' : ratio > 0.2 ? '#f1c40f' : '#e74c3c'

const PokeCard = ({ poke, pequeño = false }) => (
    <div className={`poke-mini-card ${pequeño ? 'poke-mini-card--sm' : ''}`}>
        <div className="poke-mini-card-glow" />
        <img
            src={`${import.meta.env.VITE_API_URL}/uploads/pokemon/${poke.pokemonId}.png`}
            alt={poke.apodo || poke.base?.nombre}
            style={{ width: pequeño ? 48 : 70, height: pequeño ? 48 : 70, objectFit: 'contain' }}
            className="poke-mini-card-img"
        />
        <p className="poke-mini-card-name" style={{ fontSize: pequeño ? '10px' : '12px' }}>
            {poke.apodo || poke.base?.nombre}
        </p>
    </div>
)

// ── componente principal ──────────────────────────────────────────
const PaginaBatalla = () => {
    const { getAuthUser }  = useAuth(true)
    const { pelear, guardarResultado, resetear, logBatalla, resultado, turnosTotales } = useBatalla()
    const { agregarNotificaciones, cargarPerfil } = useGamificacion()

    const [misEquipos,   setMisEquipos]   = useState([])
    const [equipoElegido,setEquipoElegido]= useState(null)
    const [rival,        setRival]        = useState(null)
    const [cargandoRival,setCargandoRival]= useState(false)
    const [sinRival,     setSinRival]     = useState(false)
    const [turnoVisible, setTurnoVisible] = useState(0)
    const [peleando,     setPeleando]     = useState(false)
    const usuario = getAuthUser();

    const dispatch = useDispatch();

    // Cargar mis equipos al montar
    useEffect(() => {
        const cargar = async () => {
            const { token } = getAuthUser()
            try {
                const res = await axios.get(
                    `http://localhost:3001/equipos/${usuario.email}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setMisEquipos(res.data)
            } catch (e) { console.error(e) }
        }
        cargar()
    }, [])

    // Animar log turno a turno
    useEffect(() => {
        if (!logBatalla.length) return
        if (turnoVisible >= logBatalla.length) { setPeleando(false); return }
        const t = setTimeout(() => setTurnoVisible(v => v + 1), 350)
        return () => clearTimeout(t)
    }, [logBatalla, turnoVisible])

    const elegirEquipo = async (equipo) => {
        resetear()
        setTurnoVisible(0)
        setRival(null)
        setSinRival(false)
        setEquipoElegido(equipo)
        setCargandoRival(true)

        const { token } = getAuthUser()
        try {
            const res = await axios.get(
                `http://localhost:3001/equipos/rival-aleatorio/${usuario.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setRival(res.data)
        } catch {
            setSinRival(true)
        } finally {
            setCargandoRival(false)
        }
    }

    const iniciarBatalla = async () => {
        if (!equipoElegido || !rival) return
        setPeleando(true)
        setTurnoVisible(0)

        // Ejecutamos la simulación
        const { resultado: res, turnosTotales: turnos } = pelear(
            equipoElegido.pokemonesequipo,
            rival.pokemonesequipo
        )

        // 3. CORRECCIÓN DE VARIABLE: Usamos 'res' que es lo que viene de pelear()
        const resultadoNormalizado = res ? res.toString().toLowerCase().trim() : '';

        console.log("🔍 CONTROL DE RACHA - Resultado detectado:", resultadoNormalizado);

        // 4. Evaluamos con la variable normalizada en minúsculas
        if (resultadoNormalizado === 'victoria') {
            dispatch(registrarVictoriaDesafio());
        } else if (resultadoNormalizado === 'derrota') {
            dispatch(registrarDerrotaDesafio());
        }

        const { token } = getAuthUser()
        // Aquí asegúrate de pasarle 'res' o 'resultadoNormalizado' según lo que espere tu backend
        const accion = await guardarResultado(token, equipoElegido.id, res, turnos, rival.nombre)
        const logrosNuevos = accion?.payload?.desbloqueados || []
        if (logrosNuevos.length) {
            agregarNotificaciones(logrosNuevos)
            cargarPerfil(token)
        }
    }

    const nuevaBatalla = () => {
        resetear()
        setTurnoVisible(0)
        setRival(null)
        setEquipoElegido(null)
        setPeleando(false)
        setSinRival(false)
    }

    const logVisible = logBatalla.slice(0, turnoVisible)
    const batallaTerminada = resultado !== null && !peleando

    // ── derivados SOLO visuales (no tocan estado ni lógica de negocio) ──
    const ultimoEvento = peleando ? logVisible[logVisible.length - 1] : null
    const golpeaMiEquipo = !!(ultimoEvento && !ultimoEvento.evento && !ultimoEvento.esEquipoA)
    const golpeaRival    = !!(ultimoEvento && !ultimoEvento.evento && ultimoEvento.esEquipoA)

    return (
        <>
            <Menu />
            <main className="arena-page">

                {/* ── HERO ── */}
                <div className="arena-hero">
                    <div className="arena-hero-glow" />
                    <h1 className="arena-title">⚔️ ARENA DE BATALLA</h1>
                    <p className="arena-subtitle">Elige tu equipo y enfréntate a un rival aleatorio</p>
                </div>

                <Container className="mt-4" style={{ maxWidth: '960px', position: 'relative', zIndex: 1 }}>

                    {/* ── PASO 1: elegir equipo ── */}
                    {!equipoElegido && (
                        <>
                            <h4 className="arena-section-title">Elige tu equipo</h4>
                            {misEquipos.length === 0 && (
                                <p style={{ color: '#888' }}>No tienes equipos creados aún.</p>
                            )}
                            <Row xs={1} md={2} className="g-3">
                                {misEquipos.map(eq => (
                                    <Col key={eq.id}>
                                        <div className="team-select-card" onClick={() => elegirEquipo(eq)}>
                                            <div className="team-select-card-header">
                                                <span className="team-select-icon">🎽</span>
                                                <h5 className="team-select-name">{eq.nombre}</h5>
                                            </div>
                                            <div className="team-select-roster">
                                                {eq.pokemonesequipo?.map((p, i) => (
                                                    <PokeCard key={i} poke={p} pequeño />
                                                ))}
                                            </div>
                                            <span className="team-select-cta">Elegir equipo →</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}

                    {/* ── PASO 2: rival + botón pelear ── */}
                    {equipoElegido && (peleando || !resultado) && (
                        <>
                            <div className="battle-stage">
                                <div className="battle-stage-bg" />

                                {/* VS header */}
                                <Row className="align-items-center mb-2 text-center" style={{ position: 'relative', zIndex: 2 }}>
                                    <Col>
                                        <h5 className="side-label side-label--mine">Tu equipo</h5>
                                        <strong className="side-team-name">{equipoElegido.nombre}</strong>
                                    </Col>
                                    <Col xs={2}>
                                        <div className="vs-badge">
                                            <span className="vs-badge-bolt">⚡</span>
                                            <span>VS</span>
                                        </div>
                                    </Col>
                                    <Col>
                                        <h5 className="side-label side-label--rival">Rival</h5>
                                        {cargandoRival && (
                                            <p className="rival-loading">
                                                <span className="mini-pokeball" /> Buscando rival...
                                            </p>
                                        )}
                                        {sinRival && <p style={{ color: '#e74c3c' }}>No hay rivales disponibles aún.</p>}
                                        {rival && <strong className="side-team-name">{rival.nombre}</strong>}
                                    </Col>
                                </Row>

                                {/* Plataformas de combate */}
                                <Row style={{ position: 'relative', zIndex: 2 }}>
                                    <Col>
                                        <div className={`battle-platform battle-platform--mine ${golpeaMiEquipo ? 'shake-hit' : ''}`}>
                                            <div className="platform-ellipse" />
                                            <div className="platform-roster">
                                                {equipoElegido.pokemonesequipo?.map((p, i) => <PokeCard key={i} poke={p} />)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className={`battle-platform battle-platform--rival ${golpeaRival ? 'shake-hit' : ''}`}>
                                            <div className="platform-ellipse" />
                                            <div className="platform-roster">
                                                {rival?.pokemonesequipo?.map((p, i) => <PokeCard key={i} poke={p} />)}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Log animado durante la batalla */}
                            {peleando && logVisible.length > 0 && (
                                <LogBatalla entradas={logVisible} />
                            )}

                            {/* Botones */}
                            {!peleando && (
                                <div className="battle-actions">
                                    <Button variant="outline-secondary" className="btn-cambiar" onClick={nuevaBatalla}>
                                        ← Cambiar equipo
                                    </Button>
                                    <Button
                                        className="btn-pelear"
                                        size="lg"
                                        onClick={iniciarBatalla}
                                        disabled={!rival || sinRival}
                                    >
                                        ¡PELEAR!
                                    </Button>
                                </div>
                            )}

                            {peleando && (
                                <p className="simulando-text">
                                    <span className="mini-pokeball" /> Simulando batalla...
                                </p>
                            )}
                        </>
                    )}

                    {/* ── PASO 3: resultado final ── */}
                    {batallaTerminada && (
                        <>
                            {/* Banner resultado */}
                            <div className={`resultado-banner ${resultado === 'victoria' ? 'resultado-banner--win' : 'resultado-banner--lose'}`}>
                                {resultado === 'victoria'
                                    ? <h2><Badge bg="success" className="resultado-badge">🏆 ¡VICTORIA!</Badge></h2>
                                    : <h2><Badge bg="danger" className="resultado-badge">💀 DERROTA</Badge></h2>
                                }
                                <p className="resultado-turnos">Batalla finalizada en {turnosTotales} turnos</p>
                            </div>

                            {/* Log completo */}
                            <LogBatalla entradas={logBatalla} />

                            {/* Botón nueva batalla */}
                            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                                <Button variant="outline-warning" size="lg" className="btn-nueva-batalla" onClick={nuevaBatalla}>
                                    🔄 Nueva Batalla
                                </Button>
                            </div>
                        </>
                    )}
                </Container>
            </main>
            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .arena-page {
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 90vh;
                    color: white;
                    padding-bottom: 60px;
                    position: relative;
                    overflow: hidden;
                }

                .arena-page::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                .arena-hero {
                    position: relative;
                    background: linear-gradient(135deg, #1a0a0a 0%, #2d0000 50%, #1a0a0a 100%);
                    border-bottom: 2px solid #e74c3c;
                    padding: 44px 0 34px;
                    text-align: center;
                    overflow: hidden;
                }

                .arena-hero-glow {
                    position: absolute;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 420px;
                    height: 180px;
                    background: radial-gradient(circle, rgba(231,76,60,0.35) 0%, transparent 70%);
                    filter: blur(10px);
                    animation: heroGlowPulse 3s ease-in-out infinite;
                }

                @keyframes heroGlowPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }

                .arena-title {
                    position: relative;
                    font-size: 2.6rem;
                    font-weight: 900;
                    letter-spacing: 4px;
                    color: #ff5b45;
                    text-shadow: 0 0 18px rgba(231,76,60,0.7), 3px 3px 0 rgba(0,0,0,0.5);
                    margin: 0;
                }

                .arena-subtitle {
                    position: relative;
                    color: #999;
                    margin-top: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .arena-section-title {
                    color: #FFC107;
                    margin-bottom: 20px;
                    font-weight: 800;
                }

                /* ── Selección de equipo ── */
                .team-select-card {
                    background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%);
                    border: 2px solid #333;
                    border-radius: 16px;
                    padding: 18px;
                    cursor: pointer;
                    transition: border-color .2s ease, transform .15s ease, box-shadow .2s ease;
                    position: relative;
                }

                .team-select-card:hover {
                    border-color: #e74c3c;
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(231,76,60,0.25);
                }

                .team-select-card-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 14px;
                }

                .team-select-icon { font-size: 1.2rem; }

                .team-select-name {
                    color: #FFC107;
                    margin: 0;
                    font-weight: 800;
                }

                .team-select-roster {
    display: grid;
    /* Crea exactamente 3 columnas del mismo tamaño */
    grid-template-columns: repeat(3, 2fr); 
    gap: 8px;
    /* Centra los elementos horizontalmente si no llenan la fila */
    justify-content: center; 
    /* Centra las filas si es necesario */
    justify-items: center; 
}

                .team-select-cta {
                    display: block;
                    margin-top: 14px;
                    color: #e74c3c;
                    font-weight: 700;
                    font-size: 0.85rem;
                    opacity: 0.85;
                }

                /* ── Mini cards de pokémon ── */
                .poke-mini-card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: radial-gradient(circle at 50% 20%, #262626 0%, #151515 100%);
                    border: 1px solid #2e2e2e;
                    border-radius: 12px;
                    padding: 12px;
                    width: 110px;
                    transition: transform .2s ease;
                }

                .poke-mini-card--sm {
                    padding: 8px;
                    width: 80px;
                }

                .poke-mini-card:hover {
                    transform: translateY(-3px);
                }

                .poke-mini-card-glow {
                    position: absolute;
                    top: 6px;
                    width: 50%;
                    height: 40%;
                    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
                    pointer-events: none;
                }

                .poke-mini-card-img {
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
                }

                .poke-mini-card-name {
                    margin: 6px 0 0;
                    color: #ccc;
                    text-align: center;
                    font-weight: 600;
                }

                /* ── Arena de combate ── */
                .battle-stage {
                    position: relative;
                    background: linear-gradient(180deg, rgba(231,76,60,0.06) 0%, rgba(0,0,0,0) 60%);
                    border: 1px solid #2a2a2a;
                    border-radius: 20px;
                    padding: 24px 16px 10px;
                    margin-bottom: 8px;
                    overflow: hidden;
                }

                .battle-stage-bg {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(ellipse at 20% 90%, rgba(255,193,7,0.08) 0%, transparent 55%),
                        radial-gradient(ellipse at 80% 90%, rgba(52,152,219,0.08) 0%, transparent 55%);
                    pointer-events: none;
                }

                .side-label {
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.8rem;
                    font-weight: 800;
                    margin-bottom: 2px;
                }

                .side-label--mine { color: #FFC107; }
                .side-label--rival { color: #3498db; }

                .side-team-name {
                    color: white;
                    font-size: 1.05rem;
                }

                .vs-badge {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 1.1rem;
                    color: #fff;
                    background: radial-gradient(circle, #e74c3c 0%, #a62110 100%);
                    width: 62px;
                    height: 62px;
                    border-radius: 50%;
                    justify-content: center;
                    box-shadow: 0 0 0 4px #1a1a1a, 0 0 22px rgba(231,76,60,0.6);
                    animation: vsPulse 1.6s ease-in-out infinite;
                }

                .vs-badge-bolt {
                    font-size: 0.9rem;
                    line-height: 1;
                    margin-bottom: -2px;
                }

                @keyframes vsPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }

                .battle-platform {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    padding: 26px 10px 4px;
                    transition: transform .1s ease;
                }

                .platform-ellipse {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80%;
                    height: 14px;
                    background: radial-gradient(ellipse, rgba(255,255,255,0.09) 0%, transparent 75%);
                    border-radius: 50%;
                }

                .platform-roster {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                    position: relative;
                    z-index: 1;
                }

                .shake-hit {
                    animation: shakeHit 0.35s ease;
                }

                @keyframes shakeHit {
                    0%, 100% { transform: translateX(0); filter: brightness(1); }
                    20% { transform: translateX(-8px); filter: brightness(1.6) drop-shadow(0 0 12px rgba(255,255,255,0.5)); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-5px); }
                    80% { transform: translateX(5px); }
                }

                .rival-loading, .simulando-text {
                    color: #888;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    text-align: center;
                    margin-top: 16px;
                }

                .mini-pokeball {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 2px solid #1b1b1f;
                    background: linear-gradient(to bottom, #fff 0 50%, #1b1b1f 50% 52%, #fff 52% 100%);
                    display: inline-block;
                    animation: spinPokeball 0.9s linear infinite;
                }

                @keyframes spinPokeball {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* ── Acciones ── */
                .battle-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    margin-top: 18px;
                }

                .btn-cambiar {
                    border-radius: 999px;
                    padding: 10px 22px;
                    font-weight: 700;
                }

                .btn-pelear {
                    background: linear-gradient(135deg, #ff5b45, #e74c3c);
                    border: none;
                    color: white;
                    font-weight: 800;
                    letter-spacing: 2px;
                    padding: 12px 44px;
                    border-radius: 999px;
                    box-shadow: 0 4px 0 #a62110, 0 0 24px rgba(231,76,60,0.45);
                    transition: transform .15s ease, box-shadow .15s ease;
                    animation: pelearGlow 1.8s ease-in-out infinite;
                }

                .btn-pelear:hover:not(:disabled) {
                    transform: translateY(2px);
                    box-shadow: 0 2px 0 #a62110, 0 0 30px rgba(231,76,60,0.65);
                }

                .btn-pelear:disabled {
                    animation: none;
                    opacity: 0.5;
                }

                @keyframes pelearGlow {
                    0%, 100% { box-shadow: 0 4px 0 #a62110, 0 0 18px rgba(231,76,60,0.35); }
                    50% { box-shadow: 0 4px 0 #a62110, 0 0 30px rgba(231,76,60,0.65); }
                }

                /* ── Log de batalla ── */
                .battle-log {
                    background: linear-gradient(160deg, #121212 0%, #0c0c0c 100%);
                    border-radius: 14px;
                    padding: 16px;
                    max-height: 340px;
                    overflow-y: auto;
                    margin-top: 16px;
                    border: 1px solid #2a2a2a;
                }

                .battle-log-entry {
                    margin-bottom: 10px;
                    animation: logFadeIn 0.3s ease both;
                }

                @keyframes logFadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .battle-log-evento {
                    color: #ff5b45;
                    font-weight: 800;
                    margin: 0;
                    text-align: center;
                    letter-spacing: 0.5px;
                    text-shadow: 0 0 10px rgba(231,76,60,0.4);
                }

                .battle-log-linea {
                    margin: 0;
                    color: #ddd;
                    font-size: 0.9rem;
                }

                .battle-log-danio {
                    color: #ff6b5a;
                    font-weight: 700;
                }

                .battle-hp-bar {
                    height: 6px;
                    margin-top: 4px;
                    background-color: #262626 !important;
                    border-radius: 999px;
                    overflow: hidden;
                }

                .battle-hp-fill {
                    height: 100%;
                    border-radius: 999px;
                    transition: width .35s ease, background-color .35s ease;
                    box-shadow: 0 0 8px currentColor;
                }

                /* ── Resultado ── */
                .resultado-banner {
                    text-align: center;
                    margin: 22px 0;
                    padding: 18px 0;
                    border-radius: 16px;
                    animation: resultadoPop 0.4s ease;
                }

                @keyframes resultadoPop {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }

                .resultado-banner--win {
                    background: radial-gradient(ellipse at center, rgba(46,204,113,0.12) 0%, transparent 70%);
                }

                .resultado-banner--lose {
                    background: radial-gradient(ellipse at center, rgba(231,76,60,0.12) 0%, transparent 70%);
                }

                .resultado-badge {
                    font-size: 2rem !important;
                    padding: 14px 34px !important;
                    border-radius: 999px !important;
                    box-shadow: 0 0 26px rgba(255,255,255,0.15);
                }

                .resultado-turnos {
                    color: #999;
                    margin-top: 10px;
                }

                .btn-nueva-batalla {
                    border-radius: 999px;
                    padding: 10px 30px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }
            `}</style>
        </>
    )
}

// ── Log de batalla ────────────────────────────────────────────────
const LogBatalla = ({ entradas }) => (
    <div className="battle-log">
        {entradas.map((e, i) => (
            <div key={i} className="battle-log-entry" style={{ animationDelay: `${i * 0.03}s` }}>
                {e.evento ? (
                    <p className="battle-log-evento">
                        {e.evento}
                    </p>
                ) : (
                    <>
                        <p className="battle-log-linea">
                            <span style={{ color: e.esEquipoA ? '#FFC107' : '#3498db', fontWeight: 700 }}>{e.atacante}</span>
                            {' usó '}
                            <strong style={{ color: 'white' }}>{e.movimiento}</strong>
                            {' → '}
                            <span className="battle-log-danio">-{e.danio} HP</span>
                            {' a '}
                            <span style={{ color: e.esEquipoA ? '#3498db' : '#FFC107', fontWeight: 700 }}>{e.defensor}</span>
                        </p>
                        <ProgressBar
                            now={(e.hpRestante / e.hpMax) * 100}
                            className="battle-hp-bar"
                        >
                            <div
                                className="battle-hp-fill"
                                style={{
                                    width: `${(e.hpRestante / e.hpMax) * 100}%`,
                                    backgroundColor: hpColor(e.hpRestante / e.hpMax),
                                    color: hpColor(e.hpRestante / e.hpMax),
                                }}
                            />
                        </ProgressBar>
                    </>
                )}
            </div>
        ))}
    </div>
)

export default PaginaBatalla