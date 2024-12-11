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

// Chamando a stored procedure
$sql = "CALL DDL(3, null, null)";

$result = $conn->query($sql);

// Array para armazenar os resultados
$items = array();

if ($result->num_rows > 0) {
    // Itera pelos resultados e adiciona ao array
    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
}

// Retorna os dados em formato JSON
echo json_encode($items);

// Fechando conexão
$conn->close();
?>