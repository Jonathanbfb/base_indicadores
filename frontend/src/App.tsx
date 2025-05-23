import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SetoresPerfis from './pages/SetoresPerfis';
import Menu from './pages/Menu';
import Usuarios from './pages/Usuarios';
import CadastroItem from './pages/CadastroItem';
import AtualizacaoItem from './pages/AtualizacaoItem';
import HistoricoAlteracoes from './pages/setores/components/HistoricoAlteracoes';
import LayoutComBarra from './pages/LayoutComBarra';
import Marketing from './pages/setores/Marketing';
import Comercial from './pages/setores/Comercial';
import Design from './pages/setores/Design';
import CallCenter from './pages/setores/CallCenter';
import Administracao from './pages/setores/Administracao';
import RedesSociais from './pages/setores/RedesSociais';
import Mercado from './pages/setores/Mercado';
import Promocoes from './pages/setores/Promocoes';
import Geral from './pages/setores/Geral';
import JornadaColaboradores from './pages/JornadaColaboradores';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};
const ProtectedRoute = ({ children, perfisPermitidos }) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!token || !usuario) {
    return <Navigate to="/login" />;
  }
  if (!perfisPermitidos.includes(usuario.perfil)) {
    return <Navigate to="/menu" />;
  }
  return children;
};

function App() {
  return (
    <Router basename="/indicadores">
      <Routes>
        {/* Login fora do layout */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setor/Marketing" element={<Marketing />} />
        <Route path="/setor/Comercial" element={<Comercial />} />
        <Route path="/setor/Design" element={<Design />} />
        <Route path="/setor/CallCenter" element={<CallCenter />} />
        <Route path="/setor/Administracao" element={<Administracao />} />
        <Route path="/setor/RedesSociais" element={<RedesSociais />} />
        <Route path="/setor/Mercado" element={<Mercado />} />
        <Route path="/setor/Promocoes" element={<Promocoes />} />
        <Route path="/setor/Geral" element={<Geral />} />

        {/* Rotas protegidas dentro do layout com a AppBar */}
        <Route element={<LayoutComBarra />}>
          <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />

          <Route path="/usuarios" element={
            <ProtectedRoute perfisPermitidos={['Administrador']}>
              <Usuarios />
            </ProtectedRoute>
          } />

          <Route path="/setores" element={
            <ProtectedRoute perfisPermitidos={['Administrador']}>
              <SetoresPerfis />
            </ProtectedRoute>
          } />

          <Route path="/itens" element={
            <ProtectedRoute perfisPermitidos={['Administrador']}>
              <CadastroItem />
            </ProtectedRoute>
          } />

          <Route path="/atualizar" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuario_Editor']}>
              <AtualizacaoItem />
            </ProtectedRoute>
          } />

          <Route path="/historico" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuario_Editor', 'Lideres']}>
              <HistoricoAlteracoes />
            </ProtectedRoute>
          } />

          <Route path="/dias-uteis" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuario_Editor', 'Lideres']}>
              <JornadaColaboradores></JornadaColaboradores>
            </ProtectedRoute>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/menu" />} />
  
      </Routes>
    </Router>
  );
}

export default App;
