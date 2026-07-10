import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchPerfilGamificacion, fetchRanking } from './toolkit/gamificacionThunks'
import { agregarNotificaciones, limpiarNotificacion } from './toolkit/gamificacionSlice'

export const useGamificacion = () => {
  const dispatch = useAppDispatch()
  const perfil = useAppSelector((state) => state.gamificacion.perfil)
  const status = useAppSelector((state) => state.gamificacion.status)
  const notificaciones = useAppSelector((state) => state.gamificacion.notificaciones)
  const ranking = useAppSelector((state) => state.gamificacion.ranking)
  const rankingStatus = useAppSelector((state) => state.gamificacion.rankingStatus)

  return {
    perfil,
    status,
    notificaciones,
    ranking,
    rankingStatus,
    cargarPerfil: (token) => dispatch(fetchPerfilGamificacion(token)),
    cargarRanking: (token) => dispatch(fetchRanking(token)),
    agregarNotificaciones: (logros) => dispatch(agregarNotificaciones(logros)),
    limpiarNotificacion: (clave) => dispatch(limpiarNotificacion(clave)),
  }
}