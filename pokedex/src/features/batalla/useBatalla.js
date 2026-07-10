// src/features/batalla/useBatalla.js
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { iniciarBatalla, resetBatalla } from './toolkit/batallaSlice'
import { registrarBatallaThunk }        from './toolkit/batallaThunks'
import { simularBatalla }               from './batallaEngine'

export const useBatalla = () => {
    const dispatch      = useAppDispatch()
    const logBatalla    = useAppSelector(s => s.batalla.logBatalla)
    const resultado     = useAppSelector(s => s.batalla.resultado)
    const turnosTotales = useAppSelector(s => s.batalla.turnosTotales)
    const status        = useAppSelector(s => s.batalla.status)

    const pelear = (equipoA, equipoB) => {
        const sim = simularBatalla(equipoA, equipoB)
        const res = sim.ganador === 'A' ? 'victoria' : 'derrota'
        dispatch(iniciarBatalla({ log: sim.log, resultado: res, turnosTotales: sim.turnosTotales }))
        return { resultado: res, turnosTotales: sim.turnosTotales }
    }

    const guardarResultado = (token, equipoId, resultado, turnosTotales, equipoRivalNombre) =>
        dispatch(registrarBatallaThunk({ token, equipoId, resultado, turnosTotales, equipoRivalNombre }))

    const resetear = () => dispatch(resetBatalla())

    return { logBatalla, resultado, turnosTotales, status, pelear, guardarResultado, resetear }
}