<?php
// Configurações de conexão com o banco de dados
class Conexao 
{       
    private $host = '127.0.0.1';  
    private $dbname = 'smart_fix';
    private $usuario = 'root';  // Use o nome de usuário do MySQL, o padrão no XAMPP é 'root'
    private $senha = '';  // Deixe em branco se não houver senha no MySQL
    private $conn;

    public function conectar()
    {
        try 
        {
            $this->conn = new PDO(
                "mysql:host=$this->host;dbname=$this->dbname;charset=utf8",
                $this->usuario,
                $this->senha
            );
            // Definindo o modo de erro do PDO para exceções
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);       
        } 
        catch (PDOException $erro) 
        {
            echo '<p>Erro de conexão: '.$erro->getMessage().'</p>';
        }
        return $this->conn;
    }
    
}
?>