<?php
include_once '../../ConectionString/conectionString.php'; // Importa a conexão com o banco de dados.

$conexao = new Conexao(); // Cria a instância de conexão.
$conn = $conexao->conectar(); // Estabelece a conexão.

if ($conn) {
    try {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['classificacao'],$_POST['cha_id'],$_POST['maquina'],$_POST['sala'], $_POST['bloco'], $_POST['action'], $_POST['item'], $_POST['dtinicio'], $_POST['dtfinal'], $_POST['situacao'])) {
            $actionType = $_POST['action'];
            

            $maquina = filter_var($_POST['maquina'] ?? null, FILTER_VALIDATE_INT);
            $sala = filter_var($_POST['sala'] ?? null, FILTER_VALIDATE_INT);  
            $bloco = filter_var($_POST['bloco'] ?? null, FILTER_VALIDATE_INT);
            $cha_id = filter_var($_POST['cha_id'] ?? null, FILTER_VALIDATE_INT);
            $classificacao = filter_var($_POST['classificacao'] ?? null, FILTER_VALIDATE_INT);
            $item = filter_var($_POST['item'] ?? null, FILTER_VALIDATE_INT);
            $dtinicio = filter_var($_POST['dtinicio'] ?? null, FILTER_SANITIZE_STRING);
            $dtfinal = filter_var($_POST['dtfinal'] ?? null, FILTER_SANITIZE_STRING);
            $situacao = filter_var($_POST['situacao'] ?? null, FILTER_SANITIZE_STRING);

            if ($cha_id === false) {
                $cha_id = null; 
            }
            if ($item === false) {
                $item = null; 
            }
            if ($sala === false) {
                $sala = null; 
            }
            if ($bloco === false) {
                $bloco = null; 
            }
            if ($maquina === false) {
                $maquina = null; 
            }
            if($situacao === ""){
                $situacao = null; 
            }
            if($classificacao === false){
                $classificacao = null; 
            }
            if($dtinicio === ""){
                $dtinicio = null; 
            }
            if($dtfinal === ""){
                $dtfinal = null; 
            }

            if($actionType === "buscar"){
            $action = "Select_TbCha";
            // Chamada da segunda procedure ComandosSmartFix.
            $sqlSearch = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSearch = $conn->prepare($sqlSearch);
            
            // var_dump($maq_num);
            $stmtSearch->execute([
                $action, $cha_id, $situacao, $dtfinal, null, null, null, null, null,
                null, null, null, $bloco, $classificacao, $item, $maquina, $sala, null, null,$dtinicio
            ]);

            $searchResults = $stmtSearch->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSearch->closeCursor();

            echo json_encode(["SearchResults" => $searchResults]);
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