import { useEffect } from "react";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { useGamificacion } from "../features/gamificacion/useGamificacion";

const MEDALLAS = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
};

const PODIO_ORDEN = [2, 1, 3]; // plata-oro-bronce visualmente (oro en el centro y más alto)

const RankingPage = () => {
    const { getAuthUser } = useAuth(true);
    const { ranking, rankingStatus, cargarRanking } = useGamificacion();

    useEffect(() => {
        const { token } = getAuthUser();
        cargarRanking(token);
    }, []);

    const top3 = [1, 2, 3]
        .map(pos => ranking.find(e => e.posicion === pos))
        .filter(Boolean);

    const resto = ranking.filter(e => e.posicion > 3);

    const xpMax = ranking.length ? ranking[0].xpTotal || 1 : 1;

    return (
        <>
            <Menu />
            <main className="ranking-page">

                {/* ── HERO ── */}
                <div className="ranking-hero">
                    <div className="ranking-hero-glow" />
                    <h1 className="ranking-title">🏆 RANKING DE ENTRENADORES</h1>
                    <p className="ranking-subtitle">Los mejores entrenadores de la liga</p>
                </div>

                <div className="ranking-container">

                    {rankingStatus === 'loading' ? (
                        <div className="ranking-loading">
                            <span className="mini-pokeball" />
                            <p>Cargando ranking...</p>
                        </div>
                    ) : ranking.length === 0 ? (
                        <p className="ranking-empty">Todavía no hay entrenadores en el ranking.</p>
                    ) : (
                        <>
                            {/* ── PODIO TOP 3 ── */}
                            {top3.length > 0 && (
                                <div className="podio">
                                    {PODIO_ORDEN.map(pos => {
                                        const entry = top3.find(e => e.posicion === pos);
                                        if (!entry) return null;
                                        return (
                                            <div
                                                key={entry.usuarioId}
                                                className={`podio-puesto podio-puesto--${pos}`}
                                            >
                                                <span className="podio-medalla">{MEDALLAS[pos]}</span>
                                                <div className="podio-avatar">
                                                    <span className="podio-avatar-inicial">
                                                        {entry.nombre?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="podio-nombre">{entry.nombre}</p>
                                                <p className="podio-xp">{entry.xpTotal} XP</p>
                                                <div className="podio-pilar">
                                                    <span className="podio-pilar-num">{pos}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── RESTO DEL RANKING ── */}
                            {resto.length > 0 && (
                                <div className="ranking-lista">
                                    <div className="ranking-lista-header">
                                        <span>Posición</span>
                                        <span>Entrenador</span>
                                        <span>XP Total</span>
                                    </div>
                                    {resto.map((entry, i) => (
                                        <div
                                            key={entry.usuarioId}
                                            className="ranking-fila"
                                            style={{ animationDelay: `${i * 0.04}s` }}
                                        >
                                            <span className="fila-posicion">#{entry.posicion}</span>

                                            <span className="fila-entrenador">
                                                <span className="fila-avatar">
                                                    {entry.nombre?.charAt(0).toUpperCase()}
                                                </span>
                                                {entry.nombre}
                                            </span>

                                            <span className="fila-xp-wrap">
                                                <span className="fila-xp-num">{entry.xpTotal} XP</span>
                                                <span className="fila-xp-bar">
                                                    <span
                                                        className="fila-xp-fill"
                                                        style={{ width: `${Math.max((entry.xpTotal / xpMax) * 100, 4)}%` }}
                                                    />
                                                </span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

                .ranking-page {
                    font-family: 'Nunito', sans-serif;
                    background: radial-gradient(circle at 50% 0%, #241012 0%, #181818 55%, #101010 100%);
                    min-height: 90vh;
                    color: white;
                    padding-bottom: 70px;
                    position: relative;
                    overflow: hidden;
                }

                .ranking-page::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px;
                    pointer-events: none;
                }

                /* ── HERO ── */
                .ranking-hero {
                    position: relative;
                    background: linear-gradient(135deg, #1a1508 0%, #2d1e00 50%, #1a1508 100%);
                    border-bottom: 2px solid #FFC107;
                    padding: 44px 0 34px;
                    text-align: center;
                    overflow: hidden;
                }

                .ranking-hero-glow {
                    position: absolute;
                    top: -60px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 420px;
                    height: 180px;
                    background: radial-gradient(circle, rgba(255,193,7,0.35) 0%, transparent 70%);
                    filter: blur(10px);
                    animation: heroGlowPulse 3s ease-in-out infinite;
                }

                @keyframes heroGlowPulse {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }

                .ranking-title {
                    position: relative;
                    font-size: 2.4rem;
                    font-weight: 900;
                    letter-spacing: 3px;
                    color: #FFC107;
                    text-shadow: 0 0 18px rgba(255,193,7,0.6), 3px 3px 0 rgba(0,0,0,0.5);
                    margin: 0;
                }

                .ranking-subtitle {
                    position: relative;
                    color: #999;
                    margin-top: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .ranking-container {
                    max-width: 860px;
                    margin: 0 auto;
                    padding: 40px 16px 0;
                    position: relative;
                    z-index: 1;
                }

                .ranking-loading, .ranking-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    color: #888;
                    text-align: center;
                    padding: 60px 0;
                    font-weight: 600;
                }

                .mini-pokeball {
                    width: 22px;
                    height: 22px;
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

                /* ── PODIO ── */
                .podio {
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    gap: 18px;
                    margin-bottom: 44px;
                    flex-wrap: wrap;
                }

                .podio-puesto {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 150px;
                    animation: podioRise 0.5s ease both;
                }

                .podio-puesto--2 { animation-delay: 0.05s; }
                .podio-puesto--1 { animation-delay: 0.15s; }
                .podio-puesto--3 { animation-delay: 0.25s; }

                @keyframes podioRise {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .podio-medalla {
                    font-size: 2rem;
                    margin-bottom: 6px;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.25));
                }

                .podio-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at 50% 25%, #2b2b2b 0%, #151515 100%);
                    border: 2px solid #3a3a3a;
                    margin-bottom: 10px;
                }

                .podio-puesto--1 .podio-avatar {
                    width: 82px;
                    height: 82px;
                    border-color: #FFC107;
                    box-shadow: 0 0 26px rgba(255,193,7,0.5);
                }

                .podio-puesto--2 .podio-avatar { border-color: #c7c7c7; box-shadow: 0 0 16px rgba(199,199,199,0.35); }
                .podio-puesto--3 .podio-avatar { border-color: #cd7f32; box-shadow: 0 0 16px rgba(205,127,50,0.35); }

                .podio-avatar-inicial {
                    font-weight: 900;
                    font-size: 1.4rem;
                    color: #eee;
                }

                .podio-nombre {
                    font-weight: 800;
                    margin: 0;
                    text-align: center;
                    max-width: 140px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .podio-xp {
                    color: #FFC107;
                    font-weight: 700;
                    font-size: 0.85rem;
                    margin: 2px 0 12px;
                }

                .podio-pilar {
                    width: 100%;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 8px;
                    font-family: 'Press Start 2P', monospace;
                    color: rgba(255,255,255,0.7);
                }

                .podio-puesto--1 .podio-pilar {
                    height: 110px;
                    background: linear-gradient(180deg, #3a2c00 0%, #221a00 100%);
                    border: 1px solid #FFC107;
                    box-shadow: 0 0 24px rgba(255,193,7,0.25) inset;
                }

                .podio-puesto--2 .podio-pilar {
                    height: 80px;
                    background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
                    border: 1px solid #999;
                }

                .podio-puesto--3 .podio-pilar {
                    height: 60px;
                    background: linear-gradient(180deg, #2e1f0f 0%, #1a1209 100%);
                    border: 1px solid #cd7f32;
                }

                .podio-pilar-num {
                    font-size: 0.9rem;
                }

                /* ── LISTA RESTO ── */
                .ranking-lista {
                    background: linear-gradient(160deg, #1c1c1c 0%, #141414 100%);
                    border: 1px solid #2a2a2a;
                    border-radius: 16px;
                    padding: 8px 0;
                    overflow: hidden;
                }

                .ranking-lista-header {
                    display: grid;
                    grid-template-columns: 90px 1fr 200px;
                    padding: 12px 20px;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #777;
                    font-weight: 800;
                    border-bottom: 1px solid #2a2a2a;
                }

                .ranking-fila {
                    display: grid;
                    grid-template-columns: 90px 1fr 200px;
                    align-items: center;
                    padding: 14px 20px;
                    border-bottom: 1px solid #232323;
                    transition: background .15s ease, transform .15s ease;
                    animation: filaFadeIn 0.35s ease both;
                }

                .ranking-fila:last-child { border-bottom: none; }

                .ranking-fila:hover {
                    background: rgba(255,193,7,0.05);
                    transform: translateX(4px);
                }

                @keyframes filaFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .fila-posicion {
                    font-weight: 800;
                    color: #888;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.7rem;
                }

                .fila-entrenador {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    color: #eee;
                }

                .fila-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 50% 25%, #2b2b2b 0%, #151515 100%);
                    border: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 900;
                    color: #ccc;
                    flex-shrink: 0;
                }

                .fila-xp-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .fila-xp-num {
                    color: #FFC107;
                    font-weight: 800;
                    font-size: 0.85rem;
                    text-align: right;
                }

                .fila-xp-bar {
                    display: block;
                    height: 6px;
                    background-color: #262626;
                    border-radius: 999px;
                    overflow: hidden;
                }

                .fila-xp-fill {
                    display: block;
                    height: 100%;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #ff8f00, #FFC107);
                    box-shadow: 0 0 8px rgba(255,193,7,0.5);
                    transition: width .5s ease;
                }

                @media (max-width: 576px) {
                    .ranking-lista-header, .ranking-fila {
                        grid-template-columns: 60px 1fr 110px;
                        padding: 12px 12px;
                    }
                    .podio-puesto { width: 100px; }
                }
            `}</style>
        </>
    );
};

export default RankingPage;