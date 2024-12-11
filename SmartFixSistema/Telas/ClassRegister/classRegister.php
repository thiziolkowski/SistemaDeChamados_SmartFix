<?php
include_once '../../ConectionString/conectionString.php'; // Importa a conexão com o banco de dados.

$conexao = new Conexao(); // Cria a instância de conexão.
$conn = $conexao->conectar(); // Estabelece a conexão.

if ($conn) {
    // Chamada da primeira procedure DDL.
    $sql = "CALL DDL(1, null, null)";

    try {
        $stmt = $conn->prepare($sql); 
        $stmt->execute(); 

        $items = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        $stmt->closeCursor();

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['sala'], $_POST['bloco'], $_POST['action'])) {
            $actionType = $_POST['action'];

            $sl_num = filter_var($_POST['sala'] ?? null, FILTER_SANITIZE_STRING);  
            $bl_id = filter_var($_POST['bloco'] ?? null, FILTER_VALIDATE_INT);
            $sl_id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

            if ($sl_num === "") {
                $sl_num = null; 
            }
            if ($bl_id === false) {
                $bl_id = null; 
            }
            if ($sl_id === false) {
                $sl_id = null; 
            }

            if($actionType === "buscar"){
            $action = "Select_TbSal";
            // Chamada da segunda procedure ComandosSmartFix.
            $sqlSearch = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSearch = $conn->prepare($sqlSearch);

            $stmtSearch->execute([
                $action, null, null, null, null, null, null, null, null,
                $sl_num, null, null, $bl_id, null, null, null, null, null, null, null
            ]);

            $searchResults = $stmtSearch->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSearch->closeCursor();

            echo json_encode(["SearchResults" => $searchResults]);
        }elseif($actionType === "salvar"){
            $action = "Insert_TbSal";
            $sqlSave = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSave = $conn->prepare($sqlSave);

            $stmtSave->execute([
                $action, null, null, null, null, null, null, null, null,
                $sl_num, null, null, $bl_id, null, null, null, null, null, null, null
            ]);

            $saveResults = $stmtSave->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSave->closeCursor();

            echo json_encode(["SaveResults" => $saveResults]);
        }elseif($actionType === "atualizar"){
            $action = "Update_TbSal";
            $sqlUpdate = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtUpdate = $conn->prepare($sqlUpdate);

            $stmtUpdate->execute([
                $action, null, null, null, null, null, null, null, null,
                $sl_num, null, null, $bl_id, null, null, null, $sl_id, null, null, null
            ]);

            $updateResults = $stmtUpdate->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtUpdate->closeCursor();

            echo json_encode(["UpdateResults" => $updateResults]);
        }
        } else {
            // Retorna apenas os resultados da primeira procedure se não houver POST.
            echo json_encode([
                "DDLResults" => $items
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Falha na conexão com o banco de dados."]);
}
?>