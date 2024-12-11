<?php
include_once '../../ConectionString/conectionString.php'; // Importa a conexão com o banco de dados.

$conexao = new Conexao(); // Cria a instância de conexão.
$conn = $conexao->conectar(); // Estabelece a conexão.

if ($conn) {    
    // Obtém o sl_id do corpo da requisição POST
    $input = json_decode(file_get_contents('php://input'), true);
    $sala_id = (int) ($input['sala_id'] ?? 0);

if ($sala_id > 0) {
    // Chama a stored procedure com o sl_id
    $sql = "CALL DDL(?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        4, $sala_id, null
    ]);

    // Executa a consulta e captura o resultado
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); 

    echo json_encode([
        "DDLResults" => $items
    ]);
    $stmt->closeCursor();
} else {
    echo json_encode([]);
}
} else {
    echo json_encode(["error" => "Falha na conexão com o banco de dados."]);
}
?>