import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SetoresPerfis from './pages/SetoresPerfis';
import Menu from './pages/Menu';
import Usuarios from './pages/Usuarios';
import CadastroItem from './pages/CadastroItem';
import AtualizacaoItem from './pages/AtualizacaoItem';
import HistoricoAlteracoes from './pages/HistoricoAlteracoes';
import LayoutComBarra from './pages/LayoutComBarra'; // novo

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
    <Router>
      <Routes>
        {/* Login fora do layout */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas dentro do layout com a AppBar */}
        <Route element={<LayoutComBarra />}>
          <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />

          <Route path="/usuarios" element={
            <ProtectedRoute perfisPermitidos={['Administrador']}>
              <Usuarios />
            </ProtectedRoute>
          } />

          <Route path="/setores" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuário_Editor']}>
              <SetoresPerfis />
            </ProtectedRoute>
          } />

          <Route path="/itens" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuário_Editor']}>
              <CadastroItem />
            </ProtectedRoute>
          } />

          <Route path="/atualizar" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuário_Editor']}>
              <AtualizacaoItem />
            </ProtectedRoute>
          } />

          <Route path="/historico" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuário_Editor', 'Líderes', 'Usuário_Visualização']}>
              <HistoricoAlteracoes />
            </ProtectedRoute>
          } />

          <Route path="/dias-uteis" element={
            <ProtectedRoute perfisPermitidos={['Administrador', 'Usuário_Editor', 'Líderes', 'Usuário_Visualização']}>
              <div>Tabela com Dias Úteis</div>
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
