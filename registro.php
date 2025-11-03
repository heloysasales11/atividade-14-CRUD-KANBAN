<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Sistema Kanban</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <h1>Criar Conta</h1>
            <p class="auth-subtitle">Sistema Kanban - Indústria Alimentícia</p>
            
            <form id="form-registro" class="auth-form">
                <div class="form-group">
                    <label for="nome">Nome Completo:</label>
                    <input type="text" id="nome" name="nome" required>
                </div>
                
                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" minlength="6" required>
                </div>
                
                <div class="form-group">
                    <label for="confirmar_senha">Confirmar Senha:</label>
                    <input type="password" id="confirmar_senha" name="confirmar_senha" required>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">Cadastrar</button>
            </form>
            
            <div class="auth-links">
                <p>Já tem conta? <a href="login.php">Faça login</a></p>
            </div>
            
            <div id="mensagem-sucesso" class="mensagem-sucesso" style="display: none;"></div>
            <div id="mensagem-erro" class="mensagem-erro" style="display: none;"></div>
        </div>
    </div>

    <script src="auth.js"></script>
</body>
</html>