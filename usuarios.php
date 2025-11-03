<?php
// usuarios.php
session_start();
if(!isset($_SESSION['usuario'])) {
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Usuários - Sistema Kanban</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Gerenciamento de Usuários</h1>
            <p>Visualize os usuários do sistema</p>
        </div>
    </header>

    <nav class="main-nav">
        <div class="container">
            <ul>
                <li><a href="index.php">Início</a></li>
                <li><a href="tarefas.php">Cadastrar Tarefas</a></li>
                <li><a href="gerenciamento.php">Gerenciar Tarefas</a></li>
                <li><a href="usuarios.php" class="active">Usuários</a></li>
                <li class="user-info" style="display: none;">
                    <!-- Será preenchido pelo JavaScript -->
                </li>
            </ul>
        </div>
    </nav>

    <main class="container">
        <section class="list-section">
            <h2>👥 Usuários do Sistema</h2>
            <div id="lista-usuarios" class="lista-usuarios">
                <div class="loading">Carregando usuários...</div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 Sistema Kanban - Indústria Alimentícia</p>
        </div>
    </footer>

    <script src="auth.js"></script>
    <script>
    // Carregar lista de usuários
    async function carregarUsuarios() {
        try {
            const response = await fetch('usuarios.php', {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (data.success) {
                const container = document.getElementById('lista-usuarios');
                if (data.usuarios.length > 0) {
                    container.innerHTML = data.usuarios.map(usuario => `
                        <div class="usuario-card">
                            <h3>${usuario.nome}</h3>
                            <p>📧 ${usuario.email}</p>
                            <small>📅 Cadastrado em: ${new Date(usuario.data_cadastro).toLocaleDateString('pt-BR')}</small>
                        </div>
                    `).join('');
                } else {
                    container.innerHTML = '<p>Nenhum usuário cadastrado no sistema.</p>';
                }
            } else {
                document.getElementById('lista-usuarios').innerHTML = '<p class="error">Erro ao carregar usuários.</p>';
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            document.getElementById('lista-usuarios').innerHTML = '<p class="error">Erro de conexão.</p>';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        atualizarInterfaceUsuario();
        carregarUsuarios();
    });
    </script>
</body>
</html>