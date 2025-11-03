// kanban.js
class KanbanManager {
    constructor() {
        this.tarefas = [];
        this.carregando = false;
    }

    async carregarTarefas() {
        if (this.carregando) return;
        
        this.carregando = true;
        const containers = document.querySelectorAll('.tasks-container');
        containers.forEach(container => {
            container.innerHTML = '<div class="loading">Carregando...</div>';
        });

        try {
            const response = await fetch('tarefas.php', {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.tarefas = data.tarefas;
                this.renderizarKanban();
            } else {
                this.mostrarErro('Erro ao carregar tarefas: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            this.mostrarErro('Erro de conexão ao carregar tarefas');
        } finally {
            this.carregando = false;
        }
    }

    renderizarKanban() {
        const tarefasAFazer = this.tarefas.filter(t => t.status === 'a_fazer');
        const tarefasFazendo = this.tarefas.filter(t => t.status === 'fazendo');
        const tarefasPronto = this.tarefas.filter(t => t.status === 'pronto');

        // Atualizar contadores
        document.getElementById('count-a-fazer').textContent = tarefasAFazer.length;
        document.getElementById('count-fazendo').textContent = tarefasFazendo.length;
        document.getElementById('count-pronto').textContent = tarefasPronto.length;

        // Renderizar tarefas
        document.getElementById('tasks-a-fazer').innerHTML = tarefasAFazer.length > 0 ? 
            tarefasAFazer.map(t => this.criarCartaoTarefa(t)).join('') : 
            '<div class="empty-state">Nenhuma tarefa para fazer</div>';

        document.getElementById('tasks-fazendo').innerHTML = tarefasFazendo.length > 0 ? 
            tarefasFazendo.map(t => this.criarCartaoTarefa(t)).join('') : 
            '<div class="empty-state">Nenhuma tarefa em andamento</div>';

        document.getElementById('tasks-pronto').innerHTML = tarefasPronto.length > 0 ? 
            tarefasPronto.map(t => this.criarCartaoTarefa(t)).join('') : 
            '<div class="empty-state">Nenhuma tarefa concluída</div>';

        this.configurarEventos();
    }

    criarCartaoTarefa(tarefa) {
        const prioridadeIcons = {
            'baixa': '🟢',
            'media': '🟡', 
            'alta': '🔴'
        };
        
        const dataFormatada = new Date(tarefa.data_cadastro).toLocaleDateString('pt-BR');
        
        return `
            <div class="task-card ${tarefa.prioridade}" data-id="${tarefa.id}">
                <div class="task-header">
                    <div class="task-descricao">${tarefa.descricao}</div>
                </div>
                <div class="task-info">
                    <span class="task-setor">🏢 ${tarefa.setor}</span>
                    <span class="task-prioridade">${prioridadeIcons[tarefa.prioridade]} ${tarefa.prioridade}</span>
                </div>
                <div class="task-meta">
                    <small>📅 ${dataFormatada}</small>
                </div>
                <div class="task-actions">
                    <button class="btn btn-small btn-primary btn-editar" data-id="${tarefa.id}">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-small btn-danger btn-excluir" data-id="${tarefa.id}">
                        🗑️ Excluir
                    </button>
                    <select class="status-select" data-id="${tarefa.id}">
                        <option value="a_fazer" ${tarefa.status === 'a_fazer' ? 'selected' : ''}>⏳ A Fazer</option>
                        <option value="fazendo" ${tarefa.status === 'fazendo' ? 'selected' : ''}>🔄 Fazendo</option>
                        <option value="pronto" ${tarefa.status === 'pronto' ? 'selected' : ''}>✅ Pronto</option>
                    </select>
                </div>
            </div>
        `;
    }

    configurarEventos() {
        // Eventos de edição
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.abrirModalEdicao(id);
            });
        });

        // Eventos de exclusão
        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const tarefa = this.tarefas.find(t => t.id === id);
                
                if (tarefa && confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.descricao}"?`)) {
                    await this.excluirTarefa(id);
                }
            });
        });

        // Eventos de mudança de status
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const novoStatus = e.target.value;
                await this.atualizarStatusTarefa(id, novoStatus);
            });
        });
    }

    async abrirModalEdicao(id) {
        const tarefa = this.tarefas.find(t => t.id === id);
        if (!tarefa) return;

        // Preencher modal
        document.getElementById('edit-id').value = tarefa.id;
        document.getElementById('edit-descricao').value = tarefa.descricao;
        document.getElementById('edit-setor').value = tarefa.setor;
        document.getElementById('edit-prioridade').value = tarefa.prioridade;
        document.getElementById('edit-status').value = tarefa.status;

        // Mostrar modal
        document.getElementById('modal-edicao').style.display = 'flex';
    }

    async atualizarStatusTarefa(id, novoStatus) {
        try {
            const response = await fetch('tarefas.php', {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({
                    id: id,
                    status: novoStatus
                })
            });

            const data = await response.json();
            if (data.success) {
                await this.carregarTarefas();
            } else {
                this.mostrarErro('Erro ao atualizar status: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            this.mostrarErro('Erro de conexão ao atualizar status');
        }
    }

    async excluirTarefa(id) {
        try {
            const response = await fetch('tarefas.php', {
                method: 'DELETE',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({ id: id })
            });

            const data = await response.json();
            if (data.success) {
                await this.carregarTarefas();
            } else {
                this.mostrarErro('Erro ao excluir tarefa: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            this.mostrarErro('Erro de conexão ao excluir tarefa');
        }
    }

    mostrarErro(mensagem) {
        // Poderia implementar um sistema de notificação mais sofisticado
        console.error(mensagem);
        alert('❌ ' + mensagem);
    }
}

// Função global para recarregar tarefas
async function carregarTarefas() {
    if (window.kanbanManager) {
        await window.kanbanManager.carregarTarefas();
    }
}

// Inicializar Kanban quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('kanban-board')) {
        window.kanbanManager = new KanbanManager();
        window.kanbanManager.carregarTarefas();

        // Configurar modal de edição
        const modal = document.getElementById('modal-edicao');
        const closeBtn = document.querySelector('.close');
        const btnCancelar = document.getElementById('btn-cancelar-edicao');
        const formEdicao = document.getElementById('form-edicao-tarefa');

        // Fechar modal
        const fecharModal = () => modal.style.display = 'none';
        
        closeBtn.addEventListener('click', fecharModal);
        btnCancelar.addEventListener('click', fecharModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });

        // Submissão do formulário de edição
        formEdicao.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('edit-id').value);
            const descricao = document.getElementById('edit-descricao').value;
            const setor = document.getElementById('edit-setor').value;
            const prioridade = document.getElementById('edit-prioridade').value;
            const status = document.getElementById('edit-status').value;

            try {
                const response = await fetch('tarefas.php', {
                    method: 'PUT',
                    headers: authService.getAuthHeaders(),
                    body: JSON.stringify({
                        id: id,
                        descricao: descricao,
                        setor: setor,
                        prioridade: prioridade,
                        status: status
                    })
                });

                const data = await response.json();
                if (data.success) {
                    fecharModal();
                    await window.kanbanManager.carregarTarefas();
                } else {
                    alert('❌ Erro ao atualizar tarefa: ' + data.message);
                }
            } catch (error) {
                console.error('Erro ao atualizar tarefa:', error);
                alert('❌ Erro de conexão ao atualizar tarefa');
            }
        });
    }
});