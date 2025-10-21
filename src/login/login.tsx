import React, { useState } from "react";
// Importa o hook para navegação
import { useNavigate } from "react-router-dom"; 
import './login.css';
import logo from "../assets/Sicog Logo PNG.png";

// ===============================================
// 1. DADOS DE CONTA SIMULADOS (Em Memória)
// Você substituiria isso por uma chamada a API real
// ===============================================
const USERS: Record<string, string> = {
    admin: "senha123", // Usuário e Senha de exemplo
    saulo: "sisocc2025"
};

// Componente de Login
const Login: React.FC = () => {
    // chama o hook useNavigate dentro do componente para obter 'navigate'
    const navigate = useNavigate();

    // 2. Estados para armazenar os valores dos inputs
    const [usuario, setUsuario] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

    // ===============================================
    // 3. Lógica de Login
    // ===============================================
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página

        setErro(''); // Limpa mensagens de erro anteriores

        // Verifica se o usuário existe e se a senha está correta
        if (USERS[usuario] && USERS[usuario] === senha) {
            
            // 4. Salva a sessão no Local Storage (Persistência)
            // Salvar 'true' ou o nome do usuário/token é a prática comum
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', usuario);

            // 5. Redireciona para a rota do Dashboard
            navigate('/dashboard'); 
            
        } else {
            // Se o login falhar
            setErro('Usuário ou senha inválidos. Tente novamente.');
        }
    };
    
    // ===============================================
    // 6. Lógica de Alternar a Senha (Funcionalidade de Visão)
    // ===============================================
    const toggleMostrarSenha = () => {
        setMostrarSenha(prev => !prev);
    };

    return (
        // Envolve o formulário com o evento onSubmit
        <div className="container">
            {/* Lado esquerdo: formulário */}
            {/* O evento de submit agora é no formulário (ou na div, se preferir) */}
            <div className="formContainer">
                <h1 className="title">Login</h1>
                <p className="subtitle">Insira os detalhes da sua conta</p>
                
                {/* Exibir erro, se houver */}
                {erro && <p style={{ color: 'red', marginBottom: '10px' }}>{erro}</p>}

                <label htmlFor="usuario">Usuário</label>
                <input
                    type="text"
                    id="usuario"
                    className="input"
                    placeholder="Usuário"
                    // Liga o input ao estado 'usuario'
                    value={usuario} 
                    onChange={(e) => setUsuario(e.target.value)}
                />

                <label htmlFor="senha">Senha</label>
                <div className="passwordContainer">
                    <input
                        // Altera o tipo do input baseado no estado 'mostrarSenha'
                        type={mostrarSenha ? "text" : "password"} 
                        id="senha"
                        className="inputPassword"
                        placeholder="Senha"
                        // Liga o input ao estado 'senha'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    
                    {/* Botão de alternar a visibilidade da senha */}
                    <button 
                        type="button" // Evita que o botão submeta o formulário
                        className="iconEye" 
                        onClick={toggleMostrarSenha}
                    >
                        <span role="img" aria-label="eye">{mostrarSenha ? "🙈" : "👁️"}</span>
                    </button>
                </div>

                <a href="#" className="forgotPassword">
                    Esqueceu a senha?
                </a>

                <button 
                    className="loginButton"
                    onClick={handleLogin} // Chama a função de login
                >
                    Login
                </button>
            </div>

            {/* Lado direito: logo */}
            <div className="logoContainer">
                <img src={logo} alt="Logo" className="logo" />
            </div>
        </div>
    );
};

export default Login;

