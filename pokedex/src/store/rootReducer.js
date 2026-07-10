// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit'
import gamificacionReducer from '../features/gamificacion/toolkit/gamificacionSlice'
import desafioReducer from '../features/gamificacion/desafioSlice'
import batallaReducer from '../features/batalla/toolkit/batallaSlice'

const rootReducer = combineReducers({
    gamificacion: gamificacionReducer,
    batalla:      batallaReducer,
    desafio: desafioReducer
})

export default rootReducer