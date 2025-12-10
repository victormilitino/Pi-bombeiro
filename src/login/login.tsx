import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../assets/SicogLogo.png";
import authAPI from "../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [erro, setErro] = useState<string>("");
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await authAPI.post("/auth/login", { email, senha });
      const response = res.data;

      if (response && response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      } else {
        setErro(response?.message || "Email ou senha inválidos");
      }
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          error.message ||
          "Email ou senha inválidos"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1 className="title">Login</h1>
        <p className="subtitle">Insira os detalhes da sua conta</p>

        {erro && <p style={{ color: "red", marginBottom: "10px" }}>{erro}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="input"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="senha">Senha</label>
        <div className="passwordContainer">
          <input
            type={mostrarSenha ? "text" : "password"}
            id="senha"
            className="inputPassword"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button
            type="button"
            className="iconEye"
            onClick={toggleMostrarSenha}
          >
            <span role="img" aria-label="eye">
              {mostrarSenha ? "🙈" : "👁️"}
            </span>
          </button>
        </div>

        <a href="#" className="forgotPassword">
          Esqueceu a senha?
        </a>

        <button
          className="loginButton"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Login"}
        </button>
      </div>

      <div className="logoContainer">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default Login;
