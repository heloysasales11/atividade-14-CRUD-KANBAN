// kanban.js
class KanbanManager {
    constructor() {
        this.tarefas = [];
    }

    async carregarTarefas() {
        try {
            const response = await fetch('tarefas.php', {
                method: 'GET',
                headers: authService.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.tarefas = data.tarefas;
                this.renderizarKanban();
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    renderizarKanban() {
        const tarefasAFazer = this.tarefas.filter(t => t.status === 'a_fazer');
        const tarefasFazendo = this.tarefas.filter(t => t.status === 'fazendo');
        const tarefasPronto = this.tarefas.filter(t => t.status === 'pronto');

        document.getElementById('count-a-fazer').textContent = tarefasAFazer.length;
        document.getElementById('count-fazendo').textContent = tarefasFazendo.length;
        document.getElementById('count-pronto').textContent = tarefasPronto.length;

        document.getElementById('tasks-a-fazer').innerHTML = tarefasAFazer.map(t => this.criarCartaoTarefa(t)).join('');
        document.getElementById('tasks-fazendo').innerHTML = tarefasFazendo.map(t => this.criarCartaoTarefa(t)).join('');
        document.getElementById('tasks-pronto').innerHTML = tarefasPronto.map(t => this.criarCartaoTarefa(t)).join('');

        this.configurarEventos();
    }

    criarCartaoTarefa(tarefa) {
        return `
            <div class="task-card ${tarefa.prioridade}" data-id="${tarefa.id}">
                <div class="task-header">
                    <div class="task-descricao">${tarefa.descricao}</div>
                </div>
                <div class="task-info">
                    <span class="task-setor">${tarefa.setor}</span>
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

    configurarEventos() {
        // Configurar eventos de edição, exclusão e mudança de status
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                this.abrirModalEdicao(id);
            });
        });

        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    await this.excluirTarefa(id);
                }
            });
        });

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

        document.getElementById('edit-id').value = tarefa.id;
        document.getElementById('edit-descricao').value = tarefa.descricao;
        document.getElementById('edit-setor').value = tarefa.setor;
        document.getElementById('edit-prioridade').value = tarefa.prioridade;
        document.getElementById('edit-status').value = tarefa.status;

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
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
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
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }
}

// Inicializar Kanban quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('kanban-board')) {
        const kanbanManager = new KanbanManager();
        kanbanManager.carregarTarefas();

        // Configurar modal
        const modal = document.getElementById('modal-edicao');
        const closeBtn = document.querySelector('.close');
        const btnCancelar = document.getElementById('btn-cancelar-edicao');
        const formEdicao = document.getElementById('form-edicao-tarefa');

        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        btnCancelar.addEventListener('click', () => modal.style.display = 'none');

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

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
                    modal.style.display = 'none';
                    await kanbanManager.carregarTarefas();
                }
            } catch (error) {
                console.error('Erro ao atualizar tarefa:', error);
            }
        });
    }
});