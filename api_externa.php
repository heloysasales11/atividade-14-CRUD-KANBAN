<?php
// api_externa.php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['cep'])) {
            $cep = preg_replace('/[^0-9]/', '', $_GET['cep']);
            
            if(strlen($cep) === 8) {
                // Consultar ViaCEP
                $url = "https://viacep.com.br/ws/{$cep}/json/";
                $response = file_get_contents($url);
                $dados = json_decode($response);
                
                if(!isset($dados->erro)) {
                    echo json_encode([
                        "success" => true,
                        "endereco" => [
                            "logradouro" => $dados->logradouro,
                            "bairro" => $dados->bairro,
                            "cidade" => $dados->localidade,
                            "estado" => $dados->uf
                        ]
                    ]);
                } else {
                    echo json_encode(["success" => false, "message" => "CEP não encontrado"]);
                }
            } else {
                echo json_encode(["success" => false, "message" => "CEP inválido"]);
            }
        }
        break;
}
?>