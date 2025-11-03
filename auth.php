<?php
// auth.php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$database = new Database();
$db = $database->getConnection();

switch($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($data->action)) {
            switch($data->action) {
                case 'register':
                    // Cadastro de usuário
                    if(!empty($data->nome) && !empty($data->email) && !empty($data->senha)) {
                        // Verificar se email já existe
                        $query = "SELECT id FROM usuarios WHERE email = ?";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$data->email]);
                        
                        if($stmt->rowCount() > 0) {
                            echo json_encode(["success" => false, "message" => "Email já cadastrado"]);
                        } else {
                            $senha_hash = password_hash($data->senha, PASSWORD_BCRYPT);
                            $query = "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)";
                            $stmt = $db->prepare($query);
                            
                            if($stmt->execute([$data->nome, $data->email, $senha_hash])) {
                                echo json_encode(["success" => true, "message" => "Usuário cadastrado com sucesso"]);
                            } else {
                                echo json_encode(["success" => false, "message" => "Erro ao cadastrar usuário"]);
                            }
                        }
                    }
                    break;
                    
                case 'login':
                    // Login de usuário
                    if(!empty($data->email) && !empty($data->senha)) {
                        $query = "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$data->email]);
                        
                        if($stmt->rowCount() == 1) {
                            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                            
                            if(password_verify($data->senha, $usuario['senha_hash'])) {
                                // Criar sessão
                                $token = gerarToken();
                                $expiracao = date('Y-m-d H:i:s', strtotime('+8 hours'));
                                
                                $query_sessao = "INSERT INTO sessoes (id_usuario, token_sessao, data_expiracao) VALUES (?, ?, ?)";
                                $stmt_sessao = $db->prepare($query_sessao);
                                
                                if($stmt_sessao->execute([$usuario['id'], $token, $expiracao])) {
                                    echo json_encode([
                                        "success" => true, 
                                        "message" => "Login realizado com sucesso",
                                        "token" => $token,
                                        "usuario" => [
                                            "id" => $usuario['id'],
                                            "nome" => $usuario['nome'],
                                            "email" => $usuario['email']
                                        ]
                                    ]);
                                }
                            } else {
                                echo json_encode(["success" => false, "message" => "Senha incorreta"]);
                            }
                        } else {
                            echo json_encode(["success" => false, "message" => "Usuário não encontrado"]);
                        }
                    }
                    break;
                    
                case 'logout':
                    // Logout
                    if(!empty($data->token)) {
                        $query = "DELETE FROM sessoes WHERE token_sessao = ?";
                        $stmt = $db->prepare($query);
                        $stmt->execute([$data->token]);
                        echo json_encode(["success" => true, "message" => "Logout realizado"]);
                    }
                    break;
            }
        }
        break;
}
?>