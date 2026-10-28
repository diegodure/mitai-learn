import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MundoSemilla } from './features/mundo/MundoSemilla';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MundoSemilla />} />
        {/* Aquí irían las rutas del panel de padres, login, etc. */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;