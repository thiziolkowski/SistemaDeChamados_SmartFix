<?php
include_once '../../ConectionString/conectionString.php'; // Importa a conexão com o banco de dados.

$conexao = new Conexao(); // Cria a instância de conexão.
$conn = $conexao->conectar(); // Estabelece a conexão.

if ($conn) {    
    // Chamando a stored procedure
    $sql = "CALL DDL(1, null, null)";

    $stmt = $conn->prepare($sql); 
    $stmt->execute(); 

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); 

    echo json_encode([
        "DDLResults" => $items
    ]);
} else {
    echo json_encode(["error" => "Falha na conexão com o banco de dados."]);
}
?>