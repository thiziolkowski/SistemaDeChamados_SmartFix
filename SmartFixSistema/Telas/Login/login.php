<?php
include_once '../../ConectionString/conectionString.php'; //import da conectionString

$conexao = new Conexao(); //busca a classe de conexao
$conn = $conexao->conectar(); //conecta

if ($conn) {
    $Senha = $_POST['password'] ?? null;
    $Nome = $_POST['username'] ?? null;
    // echo '<br/>' .$bl_nome;
    // echo '<br/>' .$cla_nome;
    if ($Nome && $Senha) {
        // Prepara a consulta SQL para inserir os dados
        $sql = "CALL LOGIN(?, ?)";

        // Prepara a execução do SQL
        $stmt = $conn->prepare($sql);

        // Executa a consulta com os parâmetros
        $executado = $stmt->execute([
            $Senha,
            $Nome,
        ]);

        // Verifica se foi executado com sucesso
        if ($stmt->rowCount() > 0) {
            echo json_encode(['sucesso' => true]);
        } else {
            echo json_encode(['erro' => 'Usuário ou senha incorretos.']);
        }
        }else{
            echo json_encode(['erro' => 'Preencha todos os campos.']);
        }

}else{
    echo "Falha ao conectar com o banco de dados.";
}
?>
