# Sistema de Gerenciamento de Tarefas - Kanban

Sistema desenvolvido para a indústria alimentícia para gerenciamento de tarefas utilizando o método Kanban.

## Funcionalidades

- **Cadastro de Usuários**: Registro de colaboradores com nome e e-mail
- **Cadastro de Tarefas**: Criação de tarefas com descrição, setor, prioridade e status
- **Gerenciamento Kanban**: Visualização e gestão de tarefas em três colunas (A Fazer, Fazendo, Pronto)
- **Atualização de Status**: Alteração direta do status das tarefas
- **Edição e Exclusão**: Modificação e remoção de tarefas existentes

## Estrutura do Banco de Dados

### Tabela: usuarios
- id (INT, PK, AUTO_INCREMENT)
- nome (VARCHAR(100), NOT NULL)
- email (VARCHAR(100), NOT NULL, UNIQUE)

### Tabela: tarefas
- id (INT, PK, AUTO_INCREMENT)
- id_usuario (INT, FK, NOT NULL)
- descricao (TEXT, NOT NULL)
- setor (VARCHAR(50), NOT NULL)
- prioridade (ENUM: 'baixa', 'media', 'alta', NOT NULL)
- data_cadastro (DATETIME, NOT NULL)
- status (ENUM: 'a_fazer', 'fazendo', 'pronto', NOT NULL)

## Como Utilizar

1. **Cadastrar Usuários**: Acesse a página "Cadastrar Usuários" e preencha os dados dos colaboradores
2. **Cadastrar Tarefas**: Na página "Cadastrar Tarefas", crie novas tarefas atribuindo-as a usuários
3. **Gerenciar Tarefas**: Na página "Gerenciar Tarefas", visualize as tarefas organizadas por status
   - Altere o status diretamente nos selects
   - Edite tarefas clicando no botão "Editar"
   - Exclua tarefas com o botão "Excluir"

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage para persistência de dados

## Estrutura de Arquivos
