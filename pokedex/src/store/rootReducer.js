// store/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit'
import gamificacionReducer from '../features/gamificacion/toolkit/gamificacionSlice'
import batallaReducer from '../features/batalla/toolkit/batallaSlice'

const rootReducer = combineReducers({
    gamificacion: gamificacionReducer,
    batalla:      batallaReducer,
})

export default rootReducer