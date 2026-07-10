// src/features/batalla/toolkit/batallaThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'

export const registrarBatallaThunk = createAsyncThunk(
    'batalla/registrar',
    async ({ token, equipoId, resultado, turnosTotales, equipoRivalNombre }, { rejectWithValue }) => {
        try {
            const res = await fetch(`http://localhost:3001/batalla/registrar`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body:    JSON.stringify({ equipoId, resultado, turnosTotales, equipoRivalNombre }),
            })
            if (!res.ok) return rejectWithValue('Error al registrar batalla')
            return res.json()
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)