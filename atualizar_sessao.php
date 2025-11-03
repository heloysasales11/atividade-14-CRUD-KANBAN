<?php
// atualizar_sessao.php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['token']) && isset($_POST['usuario'])) {
        $_SESSION['token'] = $_POST['token'];
        $_SESSION['usuario'] = json_decode($_POST['usuario'], true);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos']);
    }
}
?>