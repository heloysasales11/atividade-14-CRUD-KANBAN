-- db.sql
DROP DATABASE IF EXISTS kanban_industria;
CREATE DATABASE kanban_industria;
USE kanban_industria;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    descricao TEXT NOT NULL,
    setor VARCHAR(50) NOT NULL,
    prioridade ENUM('baixa', 'media', 'alta') NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('a_fazer', 'fazendo', 'pronto') DEFAULT 'a_fazer',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE sessoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    token_sessao VARCHAR(255) NOT NULL UNIQUE,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_expiracao DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Inserir usuário de exemplo (senha: 123456)
INSERT INTO usuarios (nome, email, senha_hash) VALUES 
('João Silva', 'joao@empresa.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Maria Santos', 'maria@empresa.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Inserir algumas tarefas de exemplo
INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status) VALUES 
(1, 'Revisar relatório de produção', 'Produção', 'alta', 'a_fazer'),
(2, 'Atualizar cardápio do refeitório', 'RH', 'media', 'fazendo'),
(1, 'Calibrar equipamentos de medição', 'Manutenção', 'alta', 'pronto');