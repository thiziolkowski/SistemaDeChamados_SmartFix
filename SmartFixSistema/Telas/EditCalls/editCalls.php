<?php
include_once '../../ConectionString/conectionString.php'; // Importa a conexão com o banco de dados.

$conexao = new Conexao(); // Cria a instância de conexão.
$conn = $conexao->conectar(); // Estabelece a conexão.

if ($conn) {
    try {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['classificacao'],$_POST['cha_id'],$_POST['maquina'],$_POST['sala'], $_POST['bloco'], $_POST['action'], $_POST['item'], $_POST['dtinicio'], $_POST['dtfinal'], $_POST['situacao'], $_POST['cha_notes'])) {
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
            $cha_notes = filter_var($_POST['cha_notes'] ?? null, FILTER_SANITIZE_STRING);
            $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

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
            if ($id === false) {
                $id = null; 
            }
            if ($cha_notes === false) {
                $cha_notes = null; 
            }

            if($actionType === "buscar"){
            $action = "Select_TbCha_Edit";
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
        if($actionType === "atualizar"){
            $action = "Update_TbCha";
            // Chamada da segunda procedure ComandosSmartFix.
            $sqlSearch = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmtSearch = $conn->prepare($sqlSearch);
            
            // var_dump($maq_num);
            $stmtSearch->execute([
                $action, $id, $situacao, $dtfinal, $cha_notes, null, null, null, null,
                null, null, null, $bloco, $classificacao, $item, $maquina, $sala, null, null,$dtinicio
            ]);

            $updateResults = $stmtSearch->fetchAll(PDO::FETCH_ASSOC); // Obtém os resultados.
            $stmtSearch->closeCursor();

            // Buscar e-mail relacionado ao chamado
            $sqlEmail = "SELECT user_email, cha_assunto FROM tb_usuario left join tb_chamado on tb_chamado.cha_id = tb_usuario.cha_id WHERE tb_usuario.cha_id = ?";
            $stmtEmail = $conn->prepare($sqlEmail);
            $stmtEmail->execute([$id]);
            $emailResult = $stmtEmail->fetch(PDO::FETCH_ASSOC);

            if ($emailResult) {
            $email = $emailResult["user_email"];
            $assunto = $emailResult["cha_assunto"];

            if($email != null){

                $to = $email;
                $subject = "Atualização de Chamado com ID: #$id";
                
                // Definindo a imagem (o caminho da imagem ou a imagem em base64)
                $imagePath = '../../Img/LogoCompleta2.png'; // ou a URL da imagem
                $imageData = base64_encode(file_get_contents($imagePath));
                $imageType = pathinfo($imagePath, PATHINFO_EXTENSION);
                $imageName = basename($imagePath);
                
                // Definindo o conteúdo do e-mail
                if ($situacao === "Finalizado") {
                    $message = "<html><body>" .
                               "<p>Olá!</p></br>" .
                               "<p>Seu chamado: <strong> $assunto </strong>, foi atualizado com as seguintes informações:</p>" .
                               "<p>Situação: <strong> $situacao </strong></p>" .
                               "<p>Data de finalização: <strong> $dtfinal </strong></p>" .
                               "<p>Notas do técnico: <strong> $cha_notes </strong></p>" .
                               "<p>Atenciosamente,</br>Equipe SmartFix</p>" .
                               "<img src='cid:image1' />" .
                               "</body></html>";
                } else {
                    $message = "<html><body>" .
                               "<p>Olá!</p></br>" .
                               "<p>Seu chamado: <strong> $assunto </strong>, foi atualizado com as seguintes informações:</p>" .
                               "<p>Situação: <strong> $situacao </strong></p>" .
                               "<p>Notas do técnico: <strong> $cha_notes </strong></p>" .
                               "<p>Atenciosamente,</br>Equipe SmartFix</p>" .
                               "<img src='cid:image1' />" .
                               "</body></html>";
                }
                
                // Definindo o cabeçalho do e-mail com MIME type multipart/related
                $boundary = md5(uniqid(time()));
                
                // Cabeçalhos para o envio do e-mail com conteúdo misto
                $headers = "From: smartfixsuporte07@gmail.com\r\n" .
                           "Reply-To: smartfixsuporte07@gmail.com\r\n" .
                           "MIME-Version: 1.0\r\n" .
                           "Content-Type: multipart/related; boundary=\"$boundary\"\r\n";
                
                // Corpo do e-mail com a imagem embutida
                $body = "--$boundary\r\n" .
                        "Content-Type: text/html; charset=UTF-8\r\n" .
                        "Content-Transfer-Encoding: 7bit\r\n\r\n" .
                        $message . "\r\n" .
                        "--$boundary\r\n" .
                        "Content-Type: image/$imageType; name=\"$imageName\"\r\n" .
                        "Content-Transfer-Encoding: base64\r\n" .
                        "Content-ID: <image1>\r\n\r\n" .
                        $imageData . "\r\n" .
                        "--$boundary--";
                
                // Enviar o e-mail
                mail($to, $subject, $body, $headers);
        }

            $stmtEmail->closeCursor();
        }
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