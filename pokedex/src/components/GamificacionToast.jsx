import { useEffect } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import { useGamificacion } from '../features/gamificacion/useGamificacion'

const GamificacionToast = () => {
  const { notificaciones, limpiarNotificacion } = useGamificacion()

  return (
    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
      {notificaciones.map((logro) => (
        <Toast
          key={logro.clave}
          onClose={() => limpiarNotificacion(logro.clave)}
          show={true}
          delay={4000}
          autohide
          bg="warning"
        >
          <Toast.Header>
            <strong className="me-auto">🏆 ¡Logro desbloqueado!</strong>
          </Toast.Header>
          <Toast.Body>
            <strong>{logro.nombre}</strong> — {logro.descripcion}
            <br />
            <span>+{logro.xp} XP</span>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  )
}

export default GamificacionToast