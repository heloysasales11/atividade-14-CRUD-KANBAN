<?php
// index.php
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
                <li class="user-info" style="display: none;">
                    <!-- Será preenchido pelo JavaScript -->
                </li>
            </ul>
        </div>
    </nav>

    <main class="container">
        <section class="welcome">
            <h2>Bem-vindo ao Sistema Kanban, <?php echo $_SESSION['usuario']['nome']; ?>!</h2>
            <p>Este sistema permite o gerenciamento de tarefas utilizando o método Kanban, com visualização em três colunas: A Fazer, Fazendo e Pronto.</p>
            
            <div class="features">
                <div class="feature-card">
                    <h3>📝 Cadastro de Tarefas</h3>
                    <p>Crie novas tarefas e organize por prioridade</p>
                    <a href="tarefas.php" class="btn">Acessar</a>
                </div>
                
                <div class="feature-card">
                    <h3>📊 Gerenciamento</h3>
                    <p>Visualize e gerencie tarefas no formato Kanban</p>
                    <a href="gerenciamento.php" class="btn">Acessar</a>
                </div>
                
                <div class="feature-card">
                    <h3>👥 Usuários</h3>
                    <p>Veja os usuários cadastrados no sistema</p>
                    <a href="usuarios.php" class="btn">Acessar</a>
                </div>
            </div>
        </section>

        <!-- Seção de Integração com API -->
        <section class="api-integration">
            <h3>🌐 Integração com ViaCEP</h3>
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
            <p>&copy; 2024 Sistema Kanban - Indústria Alimentícia</p>
        </div>
    </footer>

    <script src="auth.js"></script>
    <script>
    // Função para buscar CEP
    async function buscarCEP() {
        const cep = document.getElementById('input-cep').value;
        const resultadoDiv = document.getElementById('resultado-cep');
        
        if (cep.length !== 8) {
            resultadoDiv.innerHTML = '<p style="color: red;">⚠️ CEP deve ter exatamente 8 dígitos</p>';
            resultadoDiv.style.display = 'block';
            return;
        }
        
        try {
            resultadoDiv.innerHTML = '<p>🔍 Buscando CEP...</p>';
            resultadoDiv.style.display = 'block';
            
            const response = await fetch(`api_externa.php?cep=${cep}`);
            const data = await response.json();
            
            if (data.success) {
                resultadoDiv.innerHTML = `
                    <h4>📍 Endereço encontrado:</h4>
                    <p><strong>Logradouro:</strong> ${data.endereco.logradouro}</p>
                    <p><strong>Bairro:</strong> ${data.endereco.bairro}</p>
                    <p><strong>Cidade:</strong> ${data.endereco.cidade} - ${data.endereco.estado}</p>
                    <button onclick="usarEndereco('${data.endereco.cidade}')" class="btn btn-small btn-primary">
                        🏢 Usar Cidade como Setor
                    </button>
                `;
            } else {
                resultadoDiv.innerHTML = `<p style="color: red;">❌ ${data.message}</p>`;
            }
            resultadoDiv.style.display = 'block';
        } catch (error) {
            resultadoDiv.innerHTML = '<p style="color: red;">❌ Erro ao buscar CEP. Verifique sua conexão.</p>';
            resultadoDiv.style.display = 'block';
        }
    }
    
    function usarEndereco(cidade) {
        // Salvar sugestão no localStorage para usar em outras páginas
        localStorage.setItem('sugestao_setor', cidade);
        alert(`✅ Sugestão "${cidade}" salva! Você pode usá-la ao cadastrar uma tarefa na página de Cadastro.`);
    }

    // Carregar informações do usuário
    document.addEventListener('DOMContentLoaded', function() {
        atualizarInterfaceUsuario();
    });
    </script>
</body>
</html>