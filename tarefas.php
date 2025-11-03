<?php
// tarefas.php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$db = $database->getConnection();

// Função para verificar autenticação
function verificarAutenticacao($db) {
    $headers = getallheaders();
    if(isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $query = "SELECT u.id, u.nome, u.email FROM sessoes s 
                  JOIN usuarios u ON s.id_usuario = u.id 
                  WHERE s.token_sessao = ? AND s.data_expiracao > NOW()";
        $stmt = $db->prepare($query);
        $stmt->execute([$token]);
        
        if($stmt->rowCount() == 1) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
    return false;
}

switch($method) {
    case 'GET':
        // Listar tarefas do usuário logado
        $usuario = verificarAutenticacao($db);
        if($usuario) {
            $query = "SELECT t.*, u.nome as usuario_nome 
                      FROM tarefas t 
                      JOIN usuarios u ON t.id_usuario = u.id 
                      WHERE t.id_usuario = ? 
                      ORDER BY t.data_cadastro DESC";
            $stmt = $db->prepare($query);
            $stmt->execute([$usuario['id']]);
            $tarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "tarefas" => $tarefas]);
        } else {
            echo json_encode(["success" => false, "message" => "Não autenticado"]);
        }
        break;
        
    case 'POST':
        // Criar nova tarefa
        $usuario = verificarAutenticacao($db);
        if($usuario) {
            $data = json_decode(file_get_contents("php://input"));
            $query = "INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, status) VALUES (?, ?, ?, ?, ?)";
            $stmt = $db->prepare($query);
            
            if($stmt->execute([
                $usuario['id'],
                $data->descricao,
                $data->setor,
                $data->prioridade,
                $data->status ?? 'a_fazer'
            ])) {
                echo json_encode(["success" => true, "message" => "Tarefa criada com sucesso"]);
            } else {
                echo json_encode(["success" => false, "message" => "Erro ao criar tarefa"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Não autenticado"]);
        }
        break;
        
    case 'PUT':
        // Atualizar tarefa
        $usuario = verificarAutenticacao($db);
        if($usuario) {
            $data = json_decode(file_get_contents("php://input"));
            $query = "UPDATE tarefas SET descricao = ?, setor = ?, prioridade = ?, status = ? WHERE id = ? AND id_usuario = ?";
            $stmt = $db->prepare($query);
            
            if($stmt->execute([
                $data->descricao,
                $data->setor,
                $data->prioridade,
                $data->status,
                $data->id,
                $usuario['id']
            ])) {
                echo json_encode(["success" => true, "message" => "Tarefa atualizada"]);
            } else {
                echo json_encode(["success" => false, "message" => "Erro ao atualizar tarefa"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Não autenticado"]);
        }
        break;
        
    case 'DELETE':
        // Excluir tarefa
        $usuario = verificarAutenticacao($db);
        if($usuario) {
            $data = json_decode(file_get_contents("php://input"));
            $query = "DELETE FROM tarefas WHERE id = ? AND id_usuario = ?";
            $stmt = $db->prepare($query);
            
            if($stmt->execute([$data->id, $usuario['id']])) {
                echo json_encode(["success" => true, "message" => "Tarefa excluída"]);
            } else {
                echo json_encode(["success" => false, "message" => "Erro ao excluir tarefa"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Não autenticado"]);
        }
        break;
}
?>