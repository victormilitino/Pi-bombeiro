import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import './login.css';
import logo from "../assets/SicogLogo.png";

const Login: React.FC = () => {
    const navigate = useNavigate();


    const [usuario, setUsuario] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    const FALLBACK_LOGIN = 'victor';
    const FALLBACK_SENHA = '123456';


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {

            const response = await api.post('/auth/login', { 
                email: usuario, 
                senha: senha
            });


            const { token, user } = response.data.data;


            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');

            console.log("Login realizado (servidor):", user.nome);

            navigate('/dashboard'); 

        } catch (err: any) {
            console.error("Erro ao conectar com servidor:", err);


            const isNetworkError = !err.response || err.code === 'ERR_NETWORK';
            
            if (isNetworkError) {
                console.log("Servidor offline. Tentando login local...");
                

                if (usuario === FALLBACK_LOGIN && senha === FALLBACK_SENHA) {

                    const userLocal = {
                        id: 999,
                        nome: 'Victor',
                        email: 'victor@local.com',
                        role: 'admin'
                    };

                    localStorage.setItem('token', 'offline-mode');
                    localStorage.setItem('user', JSON.stringify(userLocal));
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('offlineMode', 'true'); // Flag para identificar modo offline

                    console.log("Login realizado (modo offline):", userLocal.nome);
                    navigate('/dashboard');
                } else {
                    setErro('Servidor offline. Use login: victor / senha: 123456');
                }
            } else {

                const mensagem = err.response?.data?.message || 'Credenciais inválidas.';
                setErro(mensagem);
            }
        } finally {
            setLoading(false);
        }
    };
    
    const toggleMostrarSenha = () => {
        setMostrarSenha(prev => !prev);
    };

    return (
        <div className="container">
            <div className="formContainer">
                <h1 className="title">Login</h1>
                <p className="subtitle">Insira suas credenciais de acesso</p>
                
                {erro && (
                    <div style={{ 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        {erro}
                    </div>
                )}

                <label htmlFor="usuario">E-mail ou Usuário</label>
                <input
                    type="text"
                    id="usuario"
                    className="input"
                    placeholder="ex: admin@bombeiros.pe.gov.br"
                    value={usuario} 
                    onChange={(e) => setUsuario(e.target.value)}
                    disabled={loading}
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
                        disabled={loading}
                    />
                    
                    <button 
                        type="button" 
                        className="iconEye" 
                        onClick={toggleMostrarSenha}
                        tabIndex={-1}
                    >
                        <span role="img" aria-label="eye">{mostrarSenha ? "🙈" : "👁️"}</span>
                    </button>
                </div>

                <a href="#" className="forgotPassword">
                    Esqueceu a senha?
                </a>

                <button 
                    className="loginButton"
                    onClick={handleLogin}
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Entrando...' : 'Login'}
                </button>

                <p style={{ 
                    marginTop: '15px', 
                    fontSize: '12px', 
                    color: '#666', 
                    textAlign: 'center' 
                }}>
                    Modo offline: victor / 123456
                </p>
            </div>

            <div className="logoContainer">
                <img src={logo} alt="Logo" className="logo" />
            </div>
        </div>
    );
};

export default Login;