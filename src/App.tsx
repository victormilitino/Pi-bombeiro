import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OccurrencesProvider } from "./components/OccurrencesContext";
import Login from "./login/login";
import DashboardLayout from "./components/DashboardLayout";
// Importe o conteúdo principal do Dashboard
import DashboardContent from "./components/DashboardContent"; 
import Lista from "./Lista/Lista";
import MapPage from "./pages/MapPage";
import UsersPage from './pages/UsersPage';
import Reports from "./pages/Reports";

function App() {
  return (
    // 1. BrowserRouter deve ficar por fora de tudo
    <BrowserRouter>
      <OccurrencesProvider>
        <Routes>
          {/* Rota Pública: Login */}
          <Route path="/" element={<Login />} />

          {/* ROTAS PROTEGIDAS 
             Todas estas rotas ficarão DENTRO do DashboardLayout (Sidebar + Header)
          */}
          <Route element={<DashboardLayout />}>
            
            {/* Quando acessar /dashboard, mostra os cards e métricas */}
            <Route path="/dashboard" element={<DashboardContent />} />

            {/* Outras páginas do sistema (renderizadas no lugar do Outlet) */}
            <Route path="/occurrences" element={<Lista />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/reports" element={<Reports />} />
            
          </Route>

          {/* Rota coringa: Se digitar algo errado, volta pro login */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </OccurrencesProvider>
    </BrowserRouter>
  );
}

export default App;