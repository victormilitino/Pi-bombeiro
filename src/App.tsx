import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OccurrencesProvider } from "./components/OccurrencesContext";
import Login from "./login/login";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  return (
    <OccurrencesProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota de Login */}
          <Route path="/" element={<Login />} />

          {/* Rota do Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />} />

          {/* Adicione outras rotas do sistema aqui */}
        </Routes>
      </BrowserRouter>
    </OccurrencesProvider>
  );
}

export default App;
