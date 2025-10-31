DROP DATABASE kanban_industria;
CREATE DATABASE kanban_industria;
USE kanban_industria;


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
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

INSERT INTO usuarios (nome, email) VALUES 
('João Silva', 'joao.silva@empresa.com'),
('Maria Santos', 'maria.santos@empresa.com'),
('Pedro Oliveira', 'pedro.oliveira@empresa.com');

INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status) VALUES 
(1, 'Revisar relatório de produção', 'Produção', 'alta', 'a_fazer'),
(2, 'Atualizar cardápio do refeitório', 'RH', 'media', 'fazendo'),
(3, 'Calibrar equipamentos de medição', 'Manutenção', 'alta', 'pronto'),
(1, 'Analisar dados de qualidade', 'Qualidade', 'baixa', 'a_fazer');