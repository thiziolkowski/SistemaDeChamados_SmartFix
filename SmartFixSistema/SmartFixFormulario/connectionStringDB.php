<?php
// Configurações de conexão com o banco de dados
class Conexao 
{       
    private $host = '127.0.0.1';  
    private $dbname = 'smart_fix';
    private $usuario = 'root';  // Use o nome de usuário do MySQL, o padrão no XAMPP é 'root'
    private $senha = '';  // Deixe em branco se não houver senha no MySQL

    public function conectar()
    {
        try 
        {
            $conexao = new PDO(
                "mysql:host=$this->host;dbname=$this->dbname;charset=utf8",
                $this->usuario,
                $this->senha
            );
            // Definindo o modo de erro do PDO para exceções
            $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            echo '<p>Conexão bem sucedida</p>';
            return $conexao;
            
        } 
        catch (PDOException $erro) 
        {
            echo '<p>Erro de conexão: '.$erro->getMessage().'</p>';
        }
    }
}

// Obtém os dados do formulário e verifica se estão presentes
$action = "Insert_TbCha";
$cha_id = null;
$cha_sit = null;
$cha_dt_fim = null;
$cha_notes = null;
$cla_nome = null;
$itm_nome = null;
$cha_assunto = $_POST['titulo'] ?? null;       //preenchido 
$maq_num = null;
$sl_num = null;
$bl_nome = null;
$cha_desc = $_POST['descricao'] ?? null;       //preenchido
$bl_id = (int) $_POST['bl_nomeDdl'] ?? null;       //preenchido
$cl_id = $_POST['class_Ddl'] ?? null;   //preenchido
$itm_id = $_POST['itm_nomeDdl'] ?? null;            //preenchido
$maq_id = (int) ($_POST['maq_Ddl'] ?? 0); //preenchido
$sl_id = (int) ($_POST['sala_Ddl'] ?? 0);         //preenchido
$bl_departamento = null;
$user_email = $_POST['email'] ?? null; 

// Instancia a conexão
$conexao = (new Conexao())->conectar();

// Prepara a consulta SQL para inserir os dados
$sql = "CALL ComandosSmartFix(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

// Prepara a execução do SQL
$stmt = $conexao->prepare($sql);

// Executa a consulta com os parâmetros
$executado = $stmt->execute([
    $action,
    $cha_id,
    $cha_sit,
    $cha_dt_fim,
    $cha_notes,
    $cla_nome,
    $itm_nome,
    $cha_assunto,
    $maq_num,
    $sl_num,
    $bl_nome,
    $cha_desc,
    $bl_id,
    $cl_id,
    $itm_id,
    $maq_id,
    $sl_id,
    $bl_departamento,
    $user_email,
    null
]);

// Verifica se foi executado com sucesso
if ($executado) {
    header('Location: index1.html?status=incluido');
    //echo "Chamado inserido com sucesso!";
} else {
    echo "Erro ao inserir o chamado.";
}



// Fecha a conexão (opcional, pois o PHP fecha automaticamente ao final do script)
$conexao = null;
?>
