<?php
// config.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

class Database {
    private $host = 'localhost';
    private $db_name = 'kanban_industria';
    private $username = 'root';
    private $password = '';
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo json_encode(["success" => false, "message" => "Connection error: " . $exception->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}

function gerarToken() {
    return bin2hex(random_bytes(32));
}

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
?>