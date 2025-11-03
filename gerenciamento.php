<?php
// gerenciamento.php
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
    <title>Gerenciamento de Tarefas - Sistema Kanban</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Gerenciamento de Tarefas</h1>
            <p>Visualize e gerencie suas tarefas no formato Kanban</p>
        </div>
    </header>

    <nav class="main-nav">
        <div class="container">
            <ul>
                <li><a href="index.php">Início</a></li>
                <li><a href="tarefas.php">Cadastrar Tarefas</a></li>
                <li><a href="gerenciamento.php" class="active">Gerenciar Tarefas</a></li>
                <li><a href="usuarios.php">Usuários</a></li>
                <li class="user-info" style="display: none;">
                    <!-- Será preenchido pelo JavaScript -->
                </li>
            </ul>
        </div>
    </nav>

    <main class="container">
        <div class="kanban-header">
            <h2>📊 Quadro Kanban</h2>
            <button onclick="carregarTarefas()" class="btn btn-secondary">🔄 Atualizar</button>
        </div>
        
        <section class="kanban-board">
            <div class="kanban-column" id="coluna-a-fazer">
                <div class="column-header">
                    <h2>⏳ A Fazer</h2>
                    <span class="task-count" id="count-a-fazer">0</span>
                </div>
                <div class="tasks-container" id="tasks-a-fazer">
                    <div class="loading">Carregando...</div>
                </div>
            </div>
            
            <div class="kanban-column" id="coluna-fazendo">
                <div class="column-header">
                    <h2>🔄 Fazendo</h2>
                    <span class="task-count" id="count-fazendo">0</span>
                </div>
                <div class="tasks-container" id="tasks-fazendo"></div>
            </div>
            
            <div class="kanban-column" id="coluna-pronto">
                <div class="column-header">
                    <h2>✅ Pronto</h2>
                    <span class="task-count" id="count-pronto">0</span>
                </div>
                <div class="tasks-container" id="tasks-pronto"></div>
            </div>
        </section>
    </main>

    <!-- Modal de Edição -->
    <div id="modal-edicao" class="modal" style="display: none;">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>✏️ Editar Tarefa</h2>
            <form id="form-edicao-tarefa">
                <input type="hidden" id="edit-id" name="id">
                
                <div class="form-group">
                    <label for="edit-descricao">Descrição da Tarefa:</label>
                    <textarea id="edit-descricao" name="descricao" rows="4" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="edit-setor">Setor:</label>
                    <input type="text" id="edit-setor" name="setor" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-prioridade">Prioridade:</label>
                    <select id="edit-prioridade" name="prioridade" required>
                        <option value="baixa">🟢 Baixa</option>
                        <option value="media">🟡 Média</option>
                        <option value="alta">🔴 Alta</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-status">Status:</label>
                    <select id="edit-status" name="status" required>
                        <option value="a_fazer">⏳ A Fazer</option>
                        <option value="fazendo">🔄 Fazendo</option>
                        <option value="pronto">✅ Pronto</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">💾 Salvar Alterações</button>
                    <button type="button" class="btn btn-secondary" id="btn-cancelar-edicao">❌ Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <footer>
        <div class="container">
            <p>&copy; 2024 Sistema Kanban - Indústria Alimentícia</p>
        </div>
    </footer>

    <script src="auth.js"></script>
    <script src="kanban.js"></script>
</body>
</html>