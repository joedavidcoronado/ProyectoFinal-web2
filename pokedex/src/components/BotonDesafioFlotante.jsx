import { useEffect, useState, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/AppContext'; 
import { Button } from 'react-bootstrap';
import { activarDesafio, setEstadoInicialDesafio, registrarDerrotaDesafio } from '../features/gamificacion/desafioSlice'; 

const BotonDesafioFlotante = () => {
    const dispatch = useDispatch();
    const { user } = useContext(AppContext);

    const { activo, completado, disponibleHoy, rachaActual } = useSelector(state => state.desafio);
    
    const [tiempoRestante, setTiempoRestante] = useState(300);

    // 🎬 Estado de la pantalla de resultado: null | 'victoria' | 'derrota'
    const [pantallaResultado, setPantallaResultado] = useState(null);

    // 🧭 Guarda el estado "anterior" para poder detectar transiciones (ganar/perder)
    const prevEstadoRef = useRef({ completado, disponibleHoy });

    // 🔄 1. Sincronizar el estado por sesión de usuario al iniciar o cambiar de cuenta
    useEffect(() => {
        if (!user || !user.correo) return;

        const datosSesion = sessionStorage.getItem(`desafio_sesion_${user.correo}`);
        
        let estadoBase;

        if (datosSesion) {
            const estadoGuardado = JSON.parse(datosSesion);
            dispatch(setEstadoInicialDesafio(estadoGuardado));
            
            if (estadoGuardado.tiempoGuardado !== undefined) {
                setTiempoRestante(estadoGuardado.tiempoGuardado);
            }

            estadoBase = { 
                completado: estadoGuardado.completado ?? false, 
                disponibleHoy: estadoGuardado.disponibleHoy ?? true 
            };
        } else {
            dispatch(setEstadoInicialDesafio({
                activo: false,
                completado: false,
                disponibleHoy: true,
                rachaActual: 0
            }));
            setTiempoRestante(300);
            estadoBase = { completado: false, disponibleHoy: true };
        }

        // 🔑 Clave: fijamos la línea base ANTES de que el efecto de detección compare nada,
        // así evitamos que la rehidratación dispare falsamente la pantalla de derrota/victoria.
        prevEstadoRef.current = estadoBase;
    }, [user, dispatch]);

    // 🏆 2. Detectar transición a victoria o derrota, sin importar quién dispare la acción
    useEffect(() => {
        const prev = prevEstadoRef.current;

        // Victoria: completado pasó de false -> true
        if (!prev.completado && completado) {
            setPantallaResultado('victoria');
        }

        // Derrota: disponibleHoy pasó de true -> false sin haber completado el desafío
        if (prev.disponibleHoy && !disponibleHoy && !completado) {
            setPantallaResultado('derrota');
        }

        prevEstadoRef.current = { completado, disponibleHoy };
    }, [completado, disponibleHoy]);

    // 💾 3. Sincronizador absoluto en sessionStorage (guarda racha y tiempo en tiempo real)
    useEffect(() => {
        if (!user || !user.correo) return;

        const copiaEstado = { 
            activo, 
            completado, 
            disponibleHoy, 
            rachaActual,
            tiempoGuardado: tiempoRestante 
        };
        sessionStorage.setItem(`desafio_sesion_${user.correo}`, JSON.stringify(copiaEstado));
    }, [activo, completado, disponibleHoy, rachaActual, tiempoRestante, user]);

    // ⏱️ 4. Lógica interna del Reloj en Cuenta Regresiva
    useEffect(() => {
        let intervalo = null;

        if (activo && tiempoRestante > 0) {
            intervalo = setInterval(() => {
                setTiempoRestante((prev) => prev - 1);
            }, 1000);
        } else if (tiempoRestante === 0 && activo) {
            dispatch(registrarDerrotaDesafio());
            clearInterval(intervalo);
        }

        return () => clearInterval(intervalo);
    }, [activo, tiempoRestante, dispatch]);

    const formatearTiempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
    };

    const handleIniciarDesafio = () => {
        setTiempoRestante(300);
        dispatch(activarDesafio());
    };

    const cerrarPantallaResultado = () => {
        setPantallaResultado(null);
    };

    if (!user || !user.correo) return null;

    return (
        <div className="contenedor-desafio-flotante">
            {activo ? (
                <div className="panel-desafio-activo">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="titulo-panel">⚔️ DESAFÍO ACTIVO</span>
                        <span className="reloj-cuenta-regresiva">⏱️ {formatearTiempo(tiempoRestante)}</span>
                    </div>
                    <div className="progreso-racha-txt">
                        Racha Actual: <span className="racha-numero">{rachaActual} / 5</span>
                    </div>
                </div>
            ) : (
                !completado && disponibleHoy && (
                    <Button 
                        className="btn-desafio-premium"
                        onClick={handleIniciarDesafio}
                    >
                        ⚡ Iniciar Desafío Diario
                    </Button>
                )
            )}

            {/* 🎉 Pantalla de resultado (victoria o derrota) */}
            {pantallaResultado && (
                <div 
                    className="overlay-resultado-desafio" 
                    onClick={cerrarPantallaResultado}
                >
                    <div 
                        className={`tarjeta-resultado ${pantallaResultado === 'victoria' ? 'tarjeta-victoria' : 'tarjeta-derrota'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {pantallaResultado === 'victoria' ? (
                            <>
                                <div className="icono-resultado">🏆</div>
                                <h3 className="titulo-resultado">¡DESAFÍO COMPLETADO!</h3>
                                <div className="insignia-otorgada">
                                    ⚡ LEYENDA
                                </div>
                                <p className="texto-resultado">
                                    Ganaste tus 5 combates seguidos. Tu insignia ya está brillando en el menú de tu perfil.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="icono-resultado">💥</div>
                                <h3 className="titulo-resultado">DESAFÍO PERDIDO</h3>
                                <p className="texto-resultado">
                                    Tu racha se reinició. Podrás volver a intentarlo mañana.
                                </p>
                            </>
                        )}
                        <Button 
                            className={`btn-aceptar-resultado ${pantallaResultado === 'victoria' ? 'btn-aceptar-victoria' : 'btn-aceptar-derrota'}`}
                            onClick={cerrarPantallaResultado}
                        >
                            Aceptar
                        </Button>
                    </div>
                </div>
            )}

            <style>{`
                .contenedor-desafio-flotante {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    z-index: 9999;
                    font-family: system-ui, -apple-system, sans-serif;
                }
                
                .btn-desafio-premium {
                    background: linear-gradient(45deg, #f1c40f, #f39c12) !important;
                    color: #000 !important;
                    font-size: 0.85rem;
                    font-weight: 900;
                    padding: 12px 24px;
                    border-radius: 50px;
                    text-transform: uppercase;
                    box-shadow: 0 4px 15px rgba(241, 196, 15, 0.6);
                    border: 2px solid #fff !important;
                    letter-spacing: 0.5px;
                    transition: all 0.2s ease;
                }

                .btn-desafio-premium:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(241, 196, 15, 0.8);
                }

                .panel-desafio-activo {
                    background: linear-gradient(135deg, #111 0%, #222 100%);
                    color: #fff;
                    padding: 14px 20px;
                    border-radius: 12px;
                    border: 2px solid #f1c40f;
                    box-shadow: 0 0 20px rgba(241, 196, 15, 0.4);
                    min-width: 220px;
                }

                .titulo-panel {
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    color: #bdc3c7;
                }

                .reloj-cuenta-regresiva {
                    font-variant-numeric: tabular-nums;
                    font-weight: 700;
                    color: #e74c3c;
                    background: rgba(0,0,0,0.4);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    border: 1px solid rgba(231, 76, 60, 0.3);
                }

                .progreso-racha-txt {
                    font-size: 0.9rem;
                    margin-top: 4px;
                    color: #ecf0f1;
                }

                .racha-numero {
                    color: #f1c40f;
                    font-weight: 900;
                    font-size: 1.05rem;
                }

                /* 🎉 Overlay de resultado */
                .overlay-resultado-desafio {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeInOverlay 0.25s ease;
                }

                .tarjeta-resultado {
                    background: linear-gradient(160deg, #1a1a1a 0%, #262626 100%);
                    border-radius: 16px;
                    padding: 32px 28px;
                    max-width: 340px;
                    width: 90%;
                    text-align: center;
                    animation: popInResultado 0.3s ease;
                }

                .tarjeta-victoria {
                    border: 2px solid #f1c40f;
                    box-shadow: 0 0 40px rgba(241, 196, 15, 0.5);
                }

                .tarjeta-derrota {
                    border: 2px solid #e74c3c;
                    box-shadow: 0 0 40px rgba(231, 76, 60, 0.4);
                }

                .icono-resultado {
                    font-size: 3rem;
                    margin-bottom: 8px;
                }

                .titulo-resultado {
                    color: #fff;
                    font-weight: 900;
                    font-size: 1.1rem;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }

                .insignia-otorgada {
                    display: inline-block;
                    background: linear-gradient(45deg, #f1c40f, #e67e22);
                    color: #000;
                    font-weight: 900;
                    font-size: 0.85rem;
                    padding: 6px 14px;
                    border-radius: 6px;
                    letter-spacing: 0.5px;
                    border: 1px solid #fff;
                    box-shadow: 0 0 16px rgba(241, 196, 15, 0.6);
                    margin-bottom: 14px;
                }

                .texto-resultado {
                    color: #bdc3c7;
                    font-size: 0.9rem;
                    line-height: 1.4;
                    margin-bottom: 20px;
                }

                .btn-aceptar-resultado {
                    font-weight: 800;
                    padding: 10px 32px;
                    border-radius: 50px;
                    border: none !important;
                    letter-spacing: 0.5px;
                    transition: all 0.2s ease;
                }

                .btn-aceptar-victoria {
                    background: linear-gradient(45deg, #f1c40f, #f39c12) !important;
                    color: #000 !important;
                }

                .btn-aceptar-derrota {
                    background: #e74c3c !important;
                    color: #fff !important;
                }

                .btn-aceptar-resultado:hover {
                    transform: scale(1.05);
                }

                @keyframes fadeInOverlay {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes popInResultado {
                    from { opacity: 0; transform: scale(0.85); }
                    to { opacity: 1; transform: scale(1); }
                }

                @media (max-width: 600px) {
                    .tarjeta-resultado {
                        padding: 24px 20px;
                    }
                    .icono-resultado {
                        font-size: 2.4rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default BotonDesafioFlotante;