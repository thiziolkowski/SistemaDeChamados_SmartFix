<?php
include_once '../../ConectionString/conectionString.php'; // Importa a conexão com o banco de dados.

$conexao = new Conexao(); // Cria a instância de conexão.
$conn = $conexao->conectar(); // Estabelece a conexão.

if ($conn) {
    try {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['bloco'], $_POST['action'])) {
            $actionType = $_POST['action'];

            $bl_nome = filter_var($_POST['bloco'] ?? null, FILTER_SANITIZE_STRING);
            $bl_id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

            if ($bl_id === false) {
                $bl_id = null; 
            }
            if ($bl_nome === false) {
                $bl_nome = null; 
            }

            if($actionType === "buscar"){
            $action = "Select_TbBlo";
            // Chamada da segunda procedure ComandosSmartFix.
            $sqlSearch = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSearch = $conn->prepare($sqlSearch);

            $stmtSearch->execute([
                $action, null, null, null, null, null, null, null, null,
                null, $bl_nome, null, null, null, null, null, null, null, null, null
            ]);

            $searchResults = $stmtSearch->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSearch->closeCursor();

            echo json_encode(["SearchResults" => $searchResults]);
        }elseif($actionType === "salvar"){
            $action = "Insert_TbBlo";
            $sqlSave = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSave = $conn->prepare($sqlSave);

            $stmtSave->execute([
                $action, null, null, null, null, null, null, null, null,
                null, $bl_nome, null, null, null, null, null, null, null, null, null
            ]);

            $saveResults = $stmtSave->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSave->closeCursor();

            echo json_encode(["SaveResults" => $saveResults]);
        }elseif($actionType === "atualizar"){
            $action = "Update_TbBlo";
            $sqlUpdate = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtUpdate = $conn->prepare($sqlUpdate);

            $stmtUpdate->execute([
                $action, null, null, null, null, null, null, null, null,
                null, $bl_nome, null, $bl_id, null, null, null, null, null, null, null
            ]);

            $updateResults = $stmtUpdate->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtUpdate->closeCursor();

            echo json_encode(["UpdateResults" => $updateResults]);
        }
        } else {
            return;
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Falha na conexão com o banco de dados."]);
}
?>