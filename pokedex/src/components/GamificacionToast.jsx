import { useEffect } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { useGamificacion } from '../features/gamificacion/useGamificacion'

const GamificacionToast = () => {
  const { notificaciones, limpiarNotificacion } = useGamificacion()

  return (
    <>
      <ToastContainer position="bottom-end" className="p-3 gami-toast-container">
        {notificaciones.map((logro) => (
          <Toast
            key={logro.clave}
            onClose={() => limpiarNotificacion(logro.clave)}
            show={true}
            delay={4000}
            autohide
            className="gami-toast"
          >
            <Toast.Header className="gami-toast-header">
              <span className="gami-toast-icon">🏆</span>
              <strong className="me-auto gami-toast-titulo">¡Logro desbloqueado!</strong>
            </Toast.Header>
            <Toast.Body className="gami-toast-body">
              <strong className="gami-toast-nombre">{logro.nombre}</strong>
              <span className="gami-toast-desc"> — {logro.descripcion}</span>
              <div className="gami-toast-xp">+{logro.xp} XP</div>
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Nunito:wght@400;600;700;800;900&display=swap');

        .gami-toast-container {
            z-index: 9999;
            font-family: 'Nunito', sans-serif;
        }

        .gami-toast {
            background: linear-gradient(160deg, #232323 0%, #1a1a1a 100%) !important;
            border: 2px solid #FFC107 !important;
            border-radius: 14px !important;
            box-shadow: 0 0 24px rgba(255,193,7,0.35), 0 10px 24px rgba(0,0,0,0.4);
            overflow: hidden;
            animation: gamiToastPop 0.3s ease;
        }

        @keyframes gamiToastPop {
            from { opacity: 0; transform: translateY(12px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .gami-toast-header {
            background: linear-gradient(135deg, #ffca28, #FFC107) !important;
            color: #1a1a1a !important;
            border-bottom: none !important;
            padding: 10px 14px;
        }

        .gami-toast-icon {
            font-size: 1.1rem;
            margin-right: 8px;
        }

        .gami-toast-titulo {
            font-family: 'Press Start 2P', monospace;
            font-size: 0.6rem;
            letter-spacing: 0.3px;
            color: #1a1a1a !important;
        }

        .gami-toast-header .btn-close {
            filter: none;
            opacity: 0.6;
        }

        .gami-toast-header .btn-close:hover {
            opacity: 1;
        }

        .gami-toast-body {
            color: #eee;
            padding: 12px 14px;
        }

        .gami-toast-nombre {
            color: #FFC107;
            font-size: 0.95rem;
        }

        .gami-toast-desc {
            color: #bbb;
            font-size: 0.88rem;
        }

        .gami-toast-xp {
            margin-top: 8px;
            display: inline-block;
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
            font-weight: 800;
            font-size: 0.78rem;
            padding: 3px 10px;
            border-radius: 999px;
            box-shadow: 0 2px 0 #1e8449;
        }
      `}</style>
    </>
  )
}

export default GamificacionToast