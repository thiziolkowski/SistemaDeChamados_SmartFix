<?php
include_once '../../ConectionString/conectionString.php'; // Importa a conexão com o banco de dados.

$conexao = new Conexao(); // Cria a instância de conexão.
$conn = $conexao->conectar(); // Estabelece a conexão.

if ($conn) {
    try {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['maquina'],$_POST['sala'], $_POST['bloco'], $_POST['action'])) {
            $actionType = $_POST['action'];

            $maq_num = filter_var($_POST['maquina'] ?? null, FILTER_SANITIZE_STRING);
            $sl_id = filter_var($_POST['sala'] ?? null, FILTER_VALIDATE_INT);  
            $bl_id = filter_var($_POST['bloco'] ?? null, FILTER_VALIDATE_INT);
            $maq_id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

            if ($sl_id === false) {
                $sl_id = null; 
            }
            if ($bl_id === false) {
                $bl_id = null; 
            }
            if ($maq_id === false) {
                $maq_id = null; 
            }
            if($maq_num === ""){
                $maq_num = null; 
            }

            if($actionType === "buscar"){
            $action = "Select_TbMaq";
            // Chamada da segunda procedure ComandosSmartFix.
            $sqlSearch = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSearch = $conn->prepare($sqlSearch);
            
            // var_dump($maq_num);
            $stmtSearch->execute([
                $action, null, null, null, null, null, null, null, $maq_num,
                null, null, null, $bl_id, null, null, null, $sl_id, null, null, null
            ]);

            $searchResults = $stmtSearch->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSearch->closeCursor();

            echo json_encode(["SearchResults" => $searchResults]);
        }elseif($actionType === "salvar"){
            $action = "Insert_TbMaq";
            $sqlSave = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSave = $conn->prepare($sqlSave);

            $stmtSave->execute([
                $action, null, null, null, null, null, null, null, $maq_num,
                null, null, null, $bl_id, null, null, null, $sl_id, null, null, null
            ]);

            $saveResults = $stmtSave->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSave->closeCursor();

            echo json_encode(["SaveResults" => $saveResults]);
        }elseif($actionType === "atualizar"){
            $action = "Update_TbMaq";
            $sqlUpdate = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtUpdate = $conn->prepare($sqlUpdate);

            $stmtUpdate->execute([
                $action, null, null, null, null, null, null, null, $maq_num,
                null, null, null, $bl_id, null, null, $maq_id, $sl_id, null, null, null
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