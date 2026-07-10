import { createSlice } from '@reduxjs/toolkit'
import { fetchPerfilGamificacion, fetchRanking } from './gamificacionThunks'

const initialState = {
  perfil: null,
  status: 'idle',
  error: null,
  notificaciones: [],
  ranking: [],
  rankingStatus: 'idle',
}

const gamificacionSlice = createSlice({
  name: 'gamificacion',
  initialState,
  reducers: {
    agregarNotificaciones: (state, action) => {
      state.notificaciones.push(...action.payload)
    },
    limpiarNotificacion: (state, action) => {
      state.notificaciones = state.notificaciones.filter(n => n.clave !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerfilGamificacion.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPerfilGamificacion.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.perfil = action.payload
      })
      .addCase(fetchPerfilGamificacion.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchRanking.pending, (state) => {
        state.rankingStatus = 'loading'
      })
      .addCase(fetchRanking.fulfilled, (state, action) => {
        state.rankingStatus = 'succeeded'
        state.ranking = action.payload
      })
      .addCase(fetchRanking.rejected, (state) => {
        state.rankingStatus = 'failed'
      })
  },
})

export const { agregarNotificaciones, limpiarNotificacion } = gamificacionSlice.actions
export default gamificacionSlice.reducer