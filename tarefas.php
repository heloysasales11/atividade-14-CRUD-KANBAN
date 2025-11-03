<?php
// tarefas.php
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
    <title>Cadastro de Tarefas - Sistema Kanban</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Cadastro de Tarefas</h1>
            <p>Crie e gerencie suas tarefas</p>
        </div>
    </header>

    <nav class="main-nav">
        <div class="container">
            <ul>
                <li><a href="index.php">Início</a></li>
                <li><a href="tarefas.php" class="active">Cadastrar Tarefas</a></li>
                <li><a href="gerenciamento.php">Gerenciar Tarefas</a></li>
                <li><a href="usuarios.php">Usuários</a></li>
                <li class="user-info" style="display: none;">
                    <!-- Será preenchido pelo JavaScript -->
                </li>
            </ul>
        </div>
    </nav>

    <main class="container">
        <section class="form-section">
            <h2>➕ Nova Tarefa</h2>
            
            <!-- Integração com API para sugestão de tarefas -->
            <div class="api-integration">
                <button type="button" onclick="buscarSugestaoTarefa()" class="btn btn-secondary">
                    🎲 Buscar Sugestão de Tarefa Aleatória
                </button>
                <div id="sugestao-tarefa" class="api-result" style="display: none;"></div>
            </div>
            
            <form id="form-tarefa">
                <div class="form-group">
                    <label for="descricao">📝 Descrição da Tarefa:</label>
                    <textarea id="descricao" name="descricao" rows="4" required placeholder="Descreva a tarefa..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="setor">🏢 Setor:</label>
                    <input type="text" id="setor" name="setor" required placeholder="Ex: Produção, RH, Qualidade...">
                    <small id="sugestao-setor-container" style="display: none;">
                        Sugestão: <span id="sugestao-setor"></span>
                        <button type="button" onclick="usarSugestaoSetor()" class="btn-link">Usar esta sugestão</button>
                    </small>
                </div>
                
                <div class="form-group">
                    <label for="prioridade">🚨 Prioridade:</label>
                    <select id="prioridade" name="prioridade" required>
                        <option value="">Selecione a prioridade</option>
                        <option value="baixa">🟢 Baixa</option>
                        <option value="media">🟡 Média</option>
                        <option value="alta">🔴 Alta</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="status">📋 Status:</label>
                    <select id="status" name="status" required>
                        <option value="a_fazer">⏳ A Fazer</option>
                        <option value="fazendo">🔄 Fazendo</option>
                        <option value="pronto">✅ Pronto</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">💾 Salvar Tarefa</button>
                    <button type="reset" class="btn btn-secondary">🗑️ Limpar</button>
                </div>
            </form>
            
            <div id="mensagem-sucesso" class="mensagem-sucesso" style="display: none;"></div>
            <div id="mensagem-erro" class="mensagem-erro" style="display: none;"></div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 Sistema Kanban - Indústria Alimentícia</p>
        </div>
    </footer>

    <script src="auth.js"></script>
    <script>
    // Carregar sugestão de setor do localStorage
    document.addEventListener('DOMContentLoaded', function() {
        atualizarInterfaceUsuario();
        
        const sugestao = localStorage.getItem('sugestao_setor');
        if (sugestao) {
            document.getElementById('sugestao-setor').textContent = sugestao;
            document.getElementById('sugestao-setor-container').style.display = 'block';
        }

        // Configurar formulário de tarefa
        document.getElementById('form-tarefa').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const descricao = document.getElementById('descricao').value;
            const setor = document.getElementById('setor').value;
            const prioridade = document.getElementById('prioridade').value;
            const status = document.getElementById('status').value;
            
            if (!prioridade) {
                document.getElementById('mensagem-erro').textContent = 'Por favor, selecione uma prioridade.';
                document.getElementById('mensagem-erro').style.display = 'block';
                return;
            }
            
            try {
                const response = await fetch('tarefas.php', {
                    method: 'POST',
                    headers: authService.getAuthHeaders(),
                    body: JSON.stringify({
                        descricao: descricao,
                        setor: setor,
                        prioridade: prioridade,
                        status: status
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('mensagem-sucesso').textContent = '✅ ' + data.message;
                    document.getElementById('mensagem-sucesso').style.display = 'block';
                    document.getElementById('mensagem-erro').style.display = 'none';
                    document.getElementById('form-tarefa').reset();
                    
                    setTimeout(() => {
                        document.getElementById('mensagem-sucesso').style.display = 'none';
                    }, 3000);
                } else {
                    document.getElementById('mensagem-erro').textContent = '❌ ' + data.message;
                    document.getElementById('mensagem-erro').style.display = 'block';
                }
            } catch (error) {
                document.getElementById('mensagem-erro').textContent = '❌ Erro de conexão. Tente novamente.';
                document.getElementById('mensagem-erro').style.display = 'block';
            }
        });
    });

    function usarSugestaoSetor() {
        const sugestao = document.getElementById('sugestao-setor').textContent;
        document.getElementById('setor').value = sugestao;
    }

    async function buscarSugestaoTarefa() {
        const sugestaoDiv = document.getElementById('sugestao-tarefa');
        
        try {
            sugestaoDiv.innerHTML = '<p>🔍 Buscando sugestão...</p>';
            sugestaoDiv.style.display = 'block';
            
            const response = await fetch('https://www.boredapi.com/api/activity');
            const data = await response.json();
            
            sugestaoDiv.innerHTML = `
                <h4>💡 Sugestão de Tarefa:</h4>
                <p><strong>${data.activity}</strong></p>
                <p><em>📊 Tipo: ${data.type} | 👥 Participantes: ${data.participants}</em></p>
                <button onclick="usarSugestaoTarefa('${data.activity.replace(/'/g, "\\'")}')" 
                        class="btn btn-small btn-primary">
                    ✅ Usar esta sugestão
                </button>
            `;
            sugestaoDiv.style.display = 'block';
        } catch (error) {
            sugestaoDiv.innerHTML = '<p style="color: red;">❌ Erro ao buscar sugestão. Tente novamente.</p>';
            sugestaoDiv.style.display = 'block';
        }
    }

    function usarSugestaoTarefa(sugestao) {
        document.getElementById('descricao').value = sugestao;
    }
    </script>
</body>
</html>