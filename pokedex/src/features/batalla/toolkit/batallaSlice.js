// src/features/batalla/toolkit/batallaSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { registrarBatallaThunk } from './batallaThunks'

const initialState = {
    logBatalla:    [],
    resultado:     null,
    turnosTotales: 0,
    status:        'idle',
    error:         null,
}

const batallaSlice = createSlice({
    name: 'batalla',
    initialState,
    reducers: {
        iniciarBatalla: (state, action) => {
            state.logBatalla    = action.payload.log
            state.resultado     = action.payload.resultado
            state.turnosTotales = action.payload.turnosTotales
            state.status        = 'finished'
        },
        resetBatalla: (state) => {
            state.logBatalla    = []
            state.resultado     = null
            state.turnosTotales = 0
            state.status        = 'idle'
            state.error         = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registrarBatallaThunk.pending,   (state) => { state.status = 'saving' })
            .addCase(registrarBatallaThunk.fulfilled,  (state) => { state.status = 'idle'   })
            .addCase(registrarBatallaThunk.rejected,   (state, action) => {
                state.status = 'idle'
                state.error  = action.payload
            })
    },
})

export const { iniciarBatalla, resetBatalla } = batallaSlice.actions
export default batallaSlice.reducer