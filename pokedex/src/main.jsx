import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'; // 👈 Importamos useLocation aquí
import { Provider } from 'react-redux'
import { store } from './store/index.js'
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
import GamificacionToast from './components/GamificacionToast.jsx';
import RankingPage from './pages/RankingPage.jsx';
import PaginaBatalla from './pages/PaginaBatalla.jsx';
import BotonDesafioFlotante from './components/BotonDesafioFlotante.jsx';

// ⚡ Componente auxiliar para decidir si mostrar el botón flotante
const AppContenido = () => {
  const location = useLocation();
  
  // Especificamos las rutas donde NO queremos que aparezca el botón
  const ocultarEnRutas = ['/login', '/register'];
  const mostrarBoton = !ocultarEnRutas.includes(location.pathname);

  return (
    <>
      <GamificacionToast />
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
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/batalla" element={<PaginaBatalla />} />
      </Routes>
      
      {/* Si la ruta actual no es login o register, el botón se renderiza */}
      {mostrarBoton && <BotonDesafioFlotante />}
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppProvider>
        <BrowserRouter>
          <AppContenido /> {/* 👈 Inyectamos nuestro componente controlado */}
        </BrowserRouter>
      </AppProvider>
    </Provider>
  </StrictMode>,
)