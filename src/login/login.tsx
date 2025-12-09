import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // <--- Importando a API que configuramos
import './login.css';
import logo from "../assets/SicogLogo.png";

const Login: React.FC = () => {
    const navigate = useNavigate();

    // Estados
    const [usuario, setUsuario] = useState<string>(''); // Aqui o usuário vai digitar o EMAIL
    const [senha, setSenha] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false); // Novo estado de carregamento

    // ===============================================
    // Lógica de Login Real (Integrada)
    // ===============================================
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setLoading(true); // Bloqueia o botão

        try {
            // 1. Chama o Backend
            // O backend espera { email, senha }, mas seu estado chama 'usuario'
            const response = await api.post('/auth/login', { 
                email: usuario, 
                senha: senha 
            });

            // 2. Se deu certo (200 OK), pega os dados
            const { token, user } = response.data.data;

            // 3. Salva o Token (Fundamental para as próximas requisições)
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');

            console.log("Login realizado:", user.nome);

            // 4. Redireciona para o Dashboard
            navigate('/dashboard'); 

        } catch (err: any) {
            console.error(err);
            // Pega a mensagem de erro do backend ou define uma padrão
            const mensagem = err.response?.data?.message || 'Falha ao conectar com o servidor.';
            setErro(mensagem);
        } finally {
            setLoading(false); // Libera o botão
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
                
                {/* Exibir erro vindo da API */}
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

                <label htmlFor="usuario">E-mail</label>
                <input
                    type="email" // Mudei para email para ajudar na validação do browser
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
                        tabIndex={-1} // Evita foco ao dar Tab
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
                    disabled={loading} // Desabilita enquanto carrega
                    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'Entrando...' : 'Login'}
                </button>
            </div>

            <div className="logoContainer">
                <img src={logo} alt="Logo" className="logo" />
            </div>
        </div>
    );
};

export default Login;