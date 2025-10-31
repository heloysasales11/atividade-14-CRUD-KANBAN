const DB_USUARIOS = 'kanban_usuarios';
const DB_TAREFAS = 'kanban_tarefas';

function inicializarDados() {
    if (!localStorage.getItem(DB_USUARIOS)) {
        const usuariosExemplo = []; // Array vazio - sem usuários pré-cadastrados
        localStorage.setItem(DB_USUARIOS, JSON.stringify(usuariosExemplo));
    }
    
    if (!localStorage.getItem(DB_TAREFAS)) {
        const tarefasExemplo = []; // Também pode deixar sem tarefas iniciais
        localStorage.setItem(DB_TAREFAS, JSON.stringify(tarefasExemplo));
    }
}
    
    if (!localStorage.getItem(DB_TAREFAS)) {
        const tarefasExemplo = [
            { 
                id: 1, 
                id_usuario: 1, 
                descricao: 'Revisar relatório de produção', 
                setor: 'Produção', 
                prioridade: 'alta', 
                data_cadastro: new Date().toISOString(), 
                status: 'a_fazer' 
            },
            { 
                id: 2, 
                id_usuario: 2, 
                descricao: 'Atualizar cardápio do refeitório', 
                setor: 'RH', 
                prioridade: 'media', 
                data_cadastro: new Date().toISOString(), 
                status: 'fazendo' 
            },
            { 
                id: 3, 
                id_usuario: 3, 
                descricao: 'Calibrar equipamentos de medição', 
                setor: 'Manutenção', 
                prioridade: 'alta', 
                data_cadastro: new Date().toISOString(), 
                status: 'pronto' 
            },
            { 
                id: 4, 
                id_usuario: 1, 
                descricao: 'Analisar dados de qualidade', 
                setor: 'Qualidade', 
                prioridade: 'baixa', 
                data_cadastro: new Date().toISOString(), 
                status: 'a_fazer' 
            }
        ];
        localStorage.setItem(DB_TAREFAS, JSON.stringify(tarefasExemplo));
    }


function obterUsuarios() {
    return JSON.parse(localStorage.getItem(DB_USUARIOS) || '[]');
}


function obterTarefas() {
    return JSON.parse(localStorage.getItem(DB_TAREFAS) || '[]');
}


function salvarUsuarios(usuarios) {
    localStorage.setItem(DB_USUARIOS, JSON.stringify(usuarios));
}


function salvarTarefas(tarefas) {
    localStorage.setItem(DB_TAREFAS, JSON.stringify(tarefas));
}


function gerarProximoId(array) {
    if (array.length === 0) return 1;
    return Math.max(...array.map(item => item.id)) + 1;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function carregarUsuariosNoSelect(selectId) {
    const select = document.getElementById(selectId);
    const usuarios = obterUsuarios();
    
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario.id;
        option.textContent = usuario.nome;
        select.appendChild(option);
    });
}

function carregarListaUsuarios() {
    const container = document.getElementById('lista-usuarios');
    if (!container) return;
    
    const usuarios = obterUsuarios();
    
    if (usuarios.length === 0) {
        container.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
        return;
    }
    
    container.innerHTML = usuarios.map(usuario => `
        <div class="usuario-card">
            <h3>${usuario.nome}</h3>
            <p>${usuario.email}</p>
        </div>
    `).join('');
}

function carregarQuadroKanban() {
    const tarefas = obterTarefas();
    const usuarios = obterUsuarios();
    
    const countAFazer = document.getElementById('count-a-fazer');
    const countFazendo = document.getElementById('count-fazendo');
    const countPronto = document.getElementById('count-pronto');
    
    const containerAFazer = document.getElementById('tasks-a-fazer');
    const containerFazendo = document.getElementById('tasks-fazendo');
    const containerPronto = document.getElementById('tasks-pronto');
    
    containerAFazer.innerHTML = '';
    containerFazendo.innerHTML = '';
    containerPronto.innerHTML = '';
    
    const tarefasAFazer = tarefas.filter(t => t.status === 'a_fazer');
    const tarefasFazendo = tarefas.filter(t => t.status === 'fazendo');
    const tarefasPronto = tarefas.filter(t => t.status === 'pronto');
    
    countAFazer.textContent = tarefasAFazer.length;
    countFazendo.textContent = tarefasFazendo.length;
    countPronto.textContent = tarefasPronto.length;
    
    function criarCartaoTarefa(tarefa) {
        const usuario = usuarios.find(u => u.id === tarefa.id_usuario);
        const data = new Date(tarefa.data_cadastro).toLocaleDateString('pt-BR');
        
        return `
            <div class="task-card ${tarefa.prioridade}" data-id="${tarefa.id}">
                <div class="task-header">
                    <div class="task-descricao">${tarefa.descricao}</div>
                </div>
                <div class="task-info">
                    <span class="task-setor">${tarefa.setor}</span>
                    <span class="task-usuario">${usuario ? usuario.nome : 'N/A'}</span>
                    <span class="task-prioridade">${tarefa.prioridade}</span>
                </div>
                <div class="task-actions">
                    <button class="btn btn-small btn-primary btn-editar" data-id="${tarefa.id}">Editar</button>
                    <button class="btn btn-small btn-danger btn-excluir" data-id="${tarefa.id}">Excluir</button>
                    <select class="status-select" data-id="${tarefa.id}">
                        <option value="a_fazer" ${tarefa.status === 'a_fazer' ? 'selected' : ''}>A Fazer</option>
                        <option value="fazendo" ${tarefa.status === 'fazendo' ? 'selected' : ''}>Fazendo</option>
                        <option value="pronto" ${tarefa.status === 'pronto' ? 'selected' : ''}>Pronto</option>
                    </select>
                </div>
            </div>
        `;
    }
    
    containerAFazer.innerHTML = tarefasAFazer.map(criarCartaoTarefa).join('');
    containerFazendo.innerHTML = tarefasFazendo.map(criarCartaoTarefa).join('');
    containerPronto.innerHTML = tarefasPronto.map(criarCartaoTarefa).join('');
    
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            abrirModalEdicao(id);
        });
    });
    
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            excluirTarefa(id);
        });
    });
    
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const novoStatus = this.value;
            atualizarStatusTarefa(id, novoStatus);
        });
    });
}

function abrirModalEdicao(idTarefa) {
    const modal = document.getElementById('modal-edicao');
    const tarefas = obterTarefas();
    const tarefa = tarefas.find(t => t.id === idTarefa);
    
    if (!tarefa) return;
    
    document.getElementById('edit-id').value = tarefa.id;
    document.getElementById('edit-descricao').value = tarefa.descricao;
    document.getElementById('edit-setor').value = tarefa.setor;
    document.getElementById('edit-prioridade').value = tarefa.prioridade;
    document.getElementById('edit-status').value = tarefa.status;
    
    carregarUsuariosNoSelect('edit-usuario');
    document.getElementById('edit-usuario').value = tarefa.id_usuario;
    
    modal.style.display = 'flex';
}

function fecharModalEdicao() {
    const modal = document.getElementById('modal-edicao');
    modal.style.display = 'none';
}

function atualizarStatusTarefa(id, novoStatus) {
    const tarefas = obterTarefas();
    const index = tarefas.findIndex(t => t.id === id);
    
    if (index !== -1) {
        tarefas[index].status = novoStatus;
        salvarTarefas(tarefas);
        carregarQuadroKanban();
    }
}

function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        const tarefas = obterTarefas();
        const novasTarefas = tarefas.filter(t => t.id !== id);
        salvarTarefas(novasTarefas);
        carregarQuadroKanban();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarDados();
    
    const formUsuario = document.getElementById('form-usuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const emailError = document.getElementById('email-error');
            
            if (!validarEmail(email)) {
                emailError.textContent = 'Por favor, insira um e-mail válido.';
                return;
            } else {
                emailError.textContent = '';
            }
            
            const usuarios = obterUsuarios();
            if (usuarios.some(u => u.email === email)) {
                emailError.textContent = 'Este e-mail já está cadastrado.';
                return;
            }
            
            const novoUsuario = {
                id: gerarProximoId(usuarios),
                nome: nome,
                email: email
            };
            
            usuarios.push(novoUsuario);
            salvarUsuarios(usuarios);
            
            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            mensagemSucesso.style.display = 'block';
            
            formUsuario.reset();
            
            carregarListaUsuarios();
            
            setTimeout(() => {
                mensagemSucesso.style.display = 'none';
            }, 3000);
        });
        
        carregarListaUsuarios();
    }
    
    const formTarefa = document.getElementById('form-tarefa');
    if (formTarefa) {
        carregarUsuariosNoSelect('usuario');
        
        formTarefa.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const idUsuario = parseInt(document.getElementById('usuario').value);
            const descricao = document.getElementById('descricao').value;
            const setor = document.getElementById('setor').value;
            const prioridade = document.getElementById('prioridade').value;
            const status = document.getElementById('status').value;
            
            const tarefas = obterTarefas();
            const novaTarefa = {
                id: gerarProximoId(tarefas),
                id_usuario: idUsuario,
                descricao: descricao,
                setor: setor,
                prioridade: prioridade,
                data_cadastro: new Date().toISOString(),
                status: status
            };
            
            tarefas.push(novaTarefa);
            salvarTarefas(tarefas);
            
            const mensagemSucesso = document.getElementById('mensagem-sucesso');
            mensagemSucesso.style.display = 'block';
            
            formTarefa.reset();
            document.getElementById('status').value = 'a_fazer';
            
            setTimeout(() => {
                mensagemSucesso.style.display = 'none';
            }, 3000);
        });
    }
    
    if (document.getElementById('kanban-board')) {
        carregarQuadroKanban();
        
        const modal = document.getElementById('modal-edicao');
        const closeBtn = document.querySelector('.close');
        const btnCancelar = document.getElementById('btn-cancelar-edicao');
        const formEdicao = document.getElementById('form-edicao-tarefa');
        
        closeBtn.addEventListener('click', fecharModalEdicao);
        btnCancelar.addEventListener('click', fecharModalEdicao);
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharModalEdicao();
            }
        });
        
        formEdicao.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('edit-id').value);
            const idUsuario = parseInt(document.getElementById('edit-usuario').value);
            const descricao = document.getElementById('edit-descricao').value;
            const setor = document.getElementById('edit-setor').value;
            const prioridade = document.getElementById('edit-prioridade').value;
            const status = document.getElementById('edit-status').value;
            
            const tarefas = obterTarefas();
            const index = tarefas.findIndex(t => t.id === id);
            
            if (index !== -1) {
                tarefas[index].id_usuario = idUsuario;
                tarefas[index].descricao = descricao;
                tarefas[index].setor = setor;
                tarefas[index].prioridade = prioridade;
                tarefas[index].status = status;
                
                salvarTarefas(tarefas);
                carregarQuadroKanban();
                fecharModalEdicao();
            }
        });
    }
});