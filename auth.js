// auth.js
const API_BASE = window.location.origin; // Usa a origem atual do servidor

class AuthService {
    constructor() {
        this.token = localStorage.getItem('kanban_token');
        this.usuario = JSON.parse(localStorage.getItem('kanban_usuario') || 'null');
    }

    async login(email, senha) {
        try {
            const response = await fetch(`auth.php`, {
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
                
                // Atualizar sessão PHP
                await this.atualizarSessaoPHP();
                
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, message: 'Erro de conexão com o servidor' };
        }
    }

    async atualizarSessaoPHP() {
        try {
            const formData = new FormData();
            formData.append('token', this.token);
            formData.append('usuario', JSON.stringify(this.usuario));
            
            await fetch('atualizar_sessao.php', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Erro ao atualizar sessão PHP:', error);
        }
    }

    async registrar(nome, email, senha) {
        try {
            const response = await fetch(`auth.php`, {
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
            console.error('Erro no registro:', error);
            return { success: false, message: 'Erro de conexão com o servidor' };
        }
    }

    async logout() {
        if (this.token) {
            try {
                await fetch(`auth.php`, {
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
        
        // Limpar sessão PHP
        try {
            await fetch('logout.php');
        } catch (error) {
            console.error('Erro ao limpar sessão PHP:', error);
        }
        
        window.location.href = 'login.php';
    }

    async verificarAutenticacao() {
        if (!this.token) return false;
        
        try {
            const response = await fetch(`auth.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({
                    action: 'check',
                    token: this.token
                })
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    }

    isAuthenticated() {
        return !!this.token && !!this.usuario;
    }

    getAuthHeaders() {
        if (!this.token) {
            console.warn('Token não disponível para headers de autenticação');
            return {
                'Content-Type': 'application/json'
            };
        }
        
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
}

const authService = new AuthService();

// Função para atualizar a interface com informações do usuário
function atualizarInterfaceUsuario() {
    const usuario = authService.usuario;
    const userInfoElements = document.querySelectorAll('.user-info');
    
    if (usuario && userInfoElements.length > 0) {
        userInfoElements.forEach(element => {
            element.innerHTML = `
                <span>👋 Olá, ${usuario.nome}</span>
                <button onclick="authService.logout()" class="btn btn-secondary btn-small">🚪 Sair</button>
            `;
            element.style.display = 'flex';
        });
    }
}

// Verificação de autenticação em páginas protegidas
function verificarAutenticacao() {
    const isAuthPage = window.location.pathname.includes('login.php') || 
                      window.location.pathname.includes('registro.php');
    
    if (!authService.isAuthenticated() && !isAuthPage) {
        window.location.href = 'login.php';
        return false;
    }
    
    if (authService.isAuthenticated() && isAuthPage) {
        window.location.href = 'index.php';
        return false;
    }
    
    return true;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!verificarAutenticacao()) {
        return;
    }
    
    // Atualizar interface do usuário se estiver autenticado
    if (authService.isAuthenticated()) {
        atualizarInterfaceUsuario();
    }
    
    // Configurar formulários de autenticação
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const mensagemErro = document.getElementById('mensagem-erro');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Feedback visual
            submitBtn.textContent = 'Entrando...';
            submitBtn.disabled = true;
            
            const resultado = await authService.login(email, senha);
            
            if (resultado.success) {
                window.location.href = 'index.php';
            } else {
                mensagemErro.textContent = resultado.message;
                mensagemErro.style.display = 'block';
                submitBtn.textContent = 'Entrar';
                submitBtn.disabled = false;
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
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Validações
            if (senha !== confirmarSenha) {
                mensagemErro.textContent = '❌ As senhas não coincidem';
                mensagemErro.style.display = 'block';
                return;
            }
            
            if (senha.length < 6) {
                mensagemErro.textContent = '❌ A senha deve ter pelo menos 6 caracteres';
                mensagemErro.style.display = 'block';
                return;
            }
            
            // Feedback visual
            submitBtn.textContent = 'Cadastrando...';
            submitBtn.disabled = true;
            
            const resultado = await authService.registrar(nome, email, senha);
            
            if (resultado.success) {
                mensagemSucesso.textContent = '✅ ' + resultado.message;
                mensagemSucesso.style.display = 'block';
                mensagemErro.style.display = 'none';
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = 'login.php';
                }, 2000);
            } else {
                mensagemErro.textContent = '❌ ' + resultado.message;
                mensagemErro.style.display = 'block';
                mensagemSucesso.style.display = 'none';
            }
            
            submitBtn.textContent = 'Cadastrar';
            submitBtn.disabled = false;
        });
    }
});