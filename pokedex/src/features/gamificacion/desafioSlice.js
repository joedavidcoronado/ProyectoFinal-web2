import { createSlice } from '@reduxjs/toolkit';

const desafioSlice = createSlice({
  name: 'desafio',
  initialState: {
    activo: false,
    completado: false,
    disponibleHoy: true,
    rachaActual: 0,
  },
  reducers: {
    // Rehidrata el estado completo al cambiar de usuario o refrescar
    setEstadoInicialDesafio: (state, action) => {
        return { ...state, ...action.payload };
    },
    // Activa el modo de juego
    activarDesafio: (state) => {
        state.activo = true;
        state.rachaActual = 0;
        state.completado = false;
        state.disponibleHoy = true;
    },
    // Suma la racha y comprueba el límite de 5 para dar la insignia
    registrarVictoriaDesafio: (state) => {
        if (state.activo && !state.completado) {
            state.rachaActual += 1;
            
            if (state.rachaActual >= 5) {
                state.completado = true;
                state.activo = false;
            }
        }
    },
    // Resetea el juego y bloquea el intento actual hasta nueva sesión
    registrarDerrotaDesafio: (state) => {
        state.activo = false;
        state.disponibleHoy = false;
        state.rachaActual = 0;
    }
  }
});

export const { 
    setEstadoInicialDesafio, 
    activarDesafio, 
    registrarVictoriaDesafio, 
    registrarDerrotaDesafio 
} = desafioSlice.actions;

export default desafioSlice.reducer;