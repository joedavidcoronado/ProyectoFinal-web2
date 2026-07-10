import { createAsyncThunk } from '@reduxjs/toolkit'

export const fetchPerfilGamificacion = createAsyncThunk(
  'gamificacion/fetchPerfil',
  async (token, { rejectWithValue }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/gamificacion/perfil`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!response.ok) return rejectWithValue('Error al obtener perfil de gamificación')
    return response.json()
  }
)

export const fetchRanking = createAsyncThunk(
  'gamificacion/fetchRanking',
  async (token, { rejectWithValue }) => {
    try {
      console.log("fetchRanking ejecutándose, token:", token)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/gamificacion/ranking`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("respuesta ranking status:", response.status)
      const data = await response.json()
      console.log("data ranking:", data)
      if (!response.ok) return rejectWithValue('Error al obtener ranking')
      return data
    } catch (err) {
      console.error("ERROR en fetchRanking:", err)
      return rejectWithValue(err.message)
    }
  }
)