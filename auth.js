// auth.js
const API_BASE = 'http://localhost:8000'; // Ajuste conforme sua configuração

class AuthService {
    constructor() {
        this.token = localStorage.getItem('kanban_token');
        this.usuario = JSON.parse(localStorage.getItem('kanban_usuario') || 'null');
    }

    async login(email, senha) {
        try {
            const response = await fetch(`${API_BASE}/auth.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email: email,
                    senha: senha
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                this.usuario = data.usuario;
                
                localStorage.setItem('kanban_token', this.token);
                localStorage.setItem('kanban_usuario', JSON.stringify(this.usuario));
                
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async registrar(nome, email, senha) {
        try {
            const response = await fetch(`${API_BASE}/auth.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    nome: nome,
                    email: email,
                    senha: senha
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            return { success: false, message: 'Erro de conexão' };
        }
    }

    async logout() {
        if (this.token) {
            try {
                await fetch(`${API_BASE}/auth.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'logout',
                        token: this.token
                    })
                });
            } catch (error) {
                console.error('Erro no logout:', error);
            }
        }

        this.token = null;
        this.usuario = null;
        localStorage.removeItem('kanban_token');
        localStorage.removeItem('kanban_usuario');
        
        window.location.href = 'login.html';
    }

    isAuthenticated() {
        return !!this.token && !!this.usuario;
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
}

const authService = new AuthService();

// Funções para consumo de API externa
class APIService {
    async consultarCEP(cep) {
        try {
            const response = await fetch(`${API_BASE}/api_externa.php?cep=${cep}`);
            const data = await response.json();
            return data;
        } catch (error) {
            return { success: false, message: 'Erro ao consultar CEP' };
        }
    }

    async buscarSugestaoTarefa() {
        try {
            // Exemplo com BoredAPI - pode ser substituída por outra API
            const response = await fetch('https://www.boredapi.com/api/activity');
            const data = await response.json();
            return data.activity;
        } catch (error) {
            return null;
        }
    }
}

const apiService = new APIService();

// Verificação de autenticação em páginas protegidas
function verificarAutenticacao() {
    if (!authService.isAuthenticated() && 
        !window.location.pathname.includes('login.html') &&
        !window.location.pathname.includes('registro.html')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Atualizar interface com informações do usuário
function atualizarInterfaceUsuario() {
    const usuario = authService.usuario;
    if (usuario) {
        // Atualizar navbar com informações do usuário
        const navElements = document.querySelectorAll('.user-info');
        navElements.forEach(element => {
            element.innerHTML = `
                <span>Olá, ${usuario.nome}</span>
                <button onclick="authService.logout()" class="btn btn-secondary btn-small">Sair</button>
            `;
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('registro.html')) {
        // Se já estiver autenticado, redirecionar para a página principal
        if (authService.isAuthenticated()) {
            window.location.href = 'index.html';
        }
        
        // Configurar formulários de autenticação
        const formLogin = document.getElementById('form-login');
        if (formLogin) {
            formLogin.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const senha = document.getElementById('senha').value;
                const mensagemErro = document.getElementById('mensagem-erro');
                
                const resultado = await authService.login(email, senha);
                
                if (resultado.success) {
                    window.location.href = 'index.html';
                } else {
                    mensagemErro.textContent = resultado.message;
                    mensagemErro.style.display = 'block';
                }
            });
        }
        
        const formRegistro = document.getElementById('form-registro');
        if (formRegistro) {
            formRegistro.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const nome = document.getElementById('nome').value;
                const email = document.getElementById('email').value;
                const senha = document.getElementById('senha').value;
                const confirmarSenha = document.getElementById('confirmar_senha').value;
                
                const mensagemSucesso = document.getElementById('mensagem-sucesso');
                const mensagemErro = document.getElementById('mensagem-erro');
                
                if (senha !== confirmarSenha) {
                    mensagemErro.textContent = 'As senhas não coincidem';
                    mensagemErro.style.display = 'block';
                    return;
                }
                
                if (senha.length < 6) {
                    mensagemErro.textContent = 'A senha deve ter pelo menos 6 caracteres';
                    mensagemErro.style.display = 'block';
                    return;
                }
                
                const resultado = await authService.registrar(nome, email, senha);
                
                if (resultado.success) {
                    mensagemSucesso.textContent = resultado.message;
                    mensagemSucesso.style.display = 'block';
                    mensagemErro.style.display = 'none';
                    
                    // Redirecionar após 2 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    mensagemErro.textContent = resultado.message;
                    mensagemErro.style.display = 'block';
                    mensagemSucesso.style.display = 'none';
                }
            });
        }
    } else {
        // Páginas protegidas
        if (verificarAutenticacao()) {
            atualizarInterfaceUsuario();
        }
    }
});