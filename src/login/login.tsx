import React from "react";
import './login.css';
import logo from "../assets/Sicog Logo PNG.png";

const Login = () => {
  return (
    <div className="container">
      {/* Lado esquerdo: formulário */}
      <div className="formContainer">
        <h1 className="title">Login</h1>
        <p className="subtitle">Insira os detalhes da sua conta</p>

        <label htmlFor="usuario">Usuário</label>
        <input
          type="text"
          id="usuario"
          className="input"
          placeholder="Usuário"
        />

        <label htmlFor="senha">Senha</label>
        <div className="passwordContainer">
          <input
            type="password"
            id="senha"
            className="inputPassword"
            placeholder="Senha"
          />
          <button className="iconEye">
            <span role="img" aria-label="eye">👁️</span>
          </button>
        </div>

        <a href="#" className="forgotPassword">
          Esqueceu a senha?
        </a>

        <button className="loginButton">Login</button>
      </div>

      {/* Lado direito: logo */}
      <div className="logoContainer">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default Login;

