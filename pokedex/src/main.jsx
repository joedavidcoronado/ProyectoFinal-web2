import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router';
import { AppProvider } from './context/AppContext.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import Principal from './pages/Principal.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ArmarEquipo from './pages/ArmarEquipo.jsx';
import PaginaPokemonEquipo from './pages/PaginaPokemonEquipo.jsx';
import DetallePokemon from './pages/DetallePokemon.jsx';
import AdminUser from './pages/AdminUsers.jsx';
import AdminPokemon from './pages/AdminPokemon.jsx';
import AdminHabilidades from './pages/AdminHabilidades.jsx';
import AdminItems from './pages/AdminItems.jsx';
import AdminMovimientos from './pages/AdminMovimientos.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Principal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/equipo" element={<ArmarEquipo />} />
            <Route path="/pokemon/:pokemonId/:equipoId" element={<PaginaPokemonEquipo />} />
            <Route path="/pokemon/:pokemon" element={<PaginaPokemonEquipo />} />
            <Route path="/detalle/:equipoId" element={<DetallePokemon />} />
            <Route path="/usuario/lista" element={<AdminUser />} />
            <Route path="/pokemon/lista" element={<AdminPokemon />} />
            <Route path="/habilidades/lista" element={<AdminHabilidades />} />
            <Route path="/items/lista" element={<AdminItems />} />
            <Route path="/movimientos/lista" element={<AdminMovimientos />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)
