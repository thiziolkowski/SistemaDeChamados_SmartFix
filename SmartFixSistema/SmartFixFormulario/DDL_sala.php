<?php
// Conexão com o banco de dados MySQL
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "smart_fix";

// Criando conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Checando conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Obtém o sl_id do corpo da requisição POST
$input = json_decode(file_get_contents('php://input'), true);
$bloco_id = (int) ($input['bloco_id'] ?? 0);

if ($bloco_id > 0) {
    // Chama a stored procedure com o sl_id
    $sql = "CALL DDL(5, null, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i",$bloco_id);

    // Executa a consulta e captura o resultado
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $items = array();

        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }

        // Retorna os dados em formato JSON
        echo json_encode($items);
    } else {
        echo json_encode([]);
    }

    $stmt->close();
} else {
    echo json_encode([]);
}

// Fecha a conexão
$conn->close();
?>