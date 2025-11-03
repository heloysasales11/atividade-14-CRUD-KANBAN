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
            <p>Crie e atribua tarefas aos colaboradores</p>
        </div>
    </header>

    <nav class="main-nav">
        <div class="container">
            <ul>
                <li><a href="index.html">Início</a></li>
                <li><a href="usuarios.html">Cadastrar Usuários</a></li>
                <li><a href="tarefas.html" class="active">Cadastrar Tarefas</a></li>
                <li><a href="gerenciamento.html">Gerenciar Tarefas</a></li>
            </ul>
        </div>
    </nav>

    <main class="container">
        <section class="form-section">
            <h2>Nova Tarefa</h2>
            
            <form id="form-tarefa">
                <div class="form-group">
                    <label for="usuario">Usuário Responsável:</label>
                    <select id="usuario" name="usuario" required>
                        <option value="">Selecione um usuário</option>
                        
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="descricao">Descrição da Tarefa:</label>
                    <textarea id="descricao" name="descricao" rows="4" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="setor">Setor:</label>
                    <input type="text" id="setor" name="setor" required>
                </div>
                
                <div class="form-group">
                    <label for="prioridade">Prioridade:</label>
                    <select id="prioridade" name="prioridade" required>
                        <option value="">Selecione a prioridade</option>
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="status">Status:</label>
                    <select id="status" name="status" required>
                        <option value="a_fazer">A Fazer</option>
                        <option value="fazendo">Fazendo</option>
                        <option value="pronto">Pronto</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Cadastrar Tarefa</button>
                    <button type="reset" class="btn btn-secondary">Limpar</button>
                </div>
            </form>
            
            <div id="mensagem-sucesso" class="mensagem-sucesso" style="display: none;">
                Tarefa cadastrada com sucesso!
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2023 Sistema Kanban - Indústria Alimentícia</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>