<?php
// Verificação de autenticação no PHP para segurança adicional
session_start();
include 'config.php';

// Verificar se usuário está autenticado
if (!isset($_SESSION['usuario'])) {
    header('Location: login.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Kanban - Indústria Alimentícia</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Sistema de Gerenciamento de Tarefas</h1>
            <p>Indústria Alimentícia - Modelo Kanban</p>
        </div>
    </header>

    <nav class="main-nav">
        <div class="container">
            <ul>
                <li><a href="index.php" class="active">Início</a></li>
                <li><a href="tarefas.php">Cadastrar Tarefas</a></li>
                <li><a href="gerenciamento.php">Gerenciar Tarefas</a></li>
                <li><a href="usuarios.php">Usuários</a></li>
                <li class="user-info">
                    <span>Olá, <?php echo $_SESSION['usuario']['nome']; ?></span>
                    <button onclick="authService.logout()" class="btn btn-secondary btn-small">Sair</button>
                </li>
            </ul>
        </div>
    </nav>

    <main class="container">
        <section class="welcome">
            <h2>Bem-vindo ao Sistema Kanban</h2>
            <p>Este sistema permite o gerenciamento de tarefas utilizando o método Kanban, com visualização em três colunas: A Fazer, Fazendo e Pronto.</p>
            
            <div class="features">
                <div class="feature-card">
                    <h3>Cadastro de Tarefas</h3>
                    <p>Crie novas tarefas e atribua aos usuários</p>
                    <a href="tarefas.php" class="btn">Acessar</a>
                </div>
                
                <div class="feature-card">
                    <h3>Gerenciamento</h3>
                    <p>Visualize e gerencie tarefas no formato Kanban</p>
                    <a href="gerenciamento.php" class="btn">Acessar</a>
                </div>
                
                <div class="feature-card">
                    <h3>Usuários</h3>
                    <p>Gerencie os usuários do sistema</p>
                    <a href="usuarios.php" class="btn">Acessar</a>
                </div>
            </div>
        </section>

        <!-- Seção de Integração com API -->
        <section class="api-integration">
            <h3>Integração com ViaCEP</h3>
            <p>Busque informações de endereço pelo CEP para preencher automaticamente o setor:</p>
            
            <div class="cep-search">
                <input type="text" id="input-cep" placeholder="Digite o CEP (apenas números)" maxlength="8">
                <button onclick="buscarCEP()" class="btn btn-primary">Buscar CEP</button>
            </div>
            
            <div id="resultado-cep" class="api-result">
                <!-- Resultado da API será exibido aqui -->
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2023 Sistema Kanban - Indústria Alimentícia</p>
        </div>
    </footer>

    <script src="auth.js"></script>
    <script>
    async function buscarCEP() {
        const cep = document.getElementById('input-cep').value;
        const resultadoDiv = document.getElementById('resultado-cep');
        
        if (cep.length !== 8) {
            resultadoDiv.innerHTML = '<p style="color: red;">CEP deve ter 8 dígitos</p>';
            resultadoDiv.style.display = 'block';
            return;
        }
        
        try {
            const response = await fetch(`api_externa.php?cep=${cep}`);
            const data = await response.json();
            
            if (data.success) {
                resultadoDiv.innerHTML = `
                    <h4>Endereço encontrado:</h4>
                    <p><strong>Logradouro:</strong> ${data.endereco.logradouro}</p>
                    <p><strong>Bairro:</strong> ${data.endereco.bairro}</p>
                    <p><strong>Cidade:</strong> ${data.endereco.cidade} - ${data.endereco.estado}</p>
                    <button onclick="usarEndereco('${data.endereco.cidade}')" class="btn btn-small btn-primary">
                        Usar Cidade como Setor
                    </button>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
            }
            resultadoDiv.style.display = 'block';
        } catch (error) {
            resultadoDiv.innerHTML = '<p style="color: red;">Erro ao buscar CEP</p>';
            resultadoDiv.style.display = 'block';
        }
    }
    
    function usarEndereco(cidade) {
        // Esta função pode ser usada para preencher automaticamente campos em outras páginas
        localStorage.setItem('sugestao_setor', cidade);
        alert(`Sugestão "${cidade}" salva. Você pode usá-la ao cadastrar uma tarefa.`);
    }
    </script>
</body>
</html>