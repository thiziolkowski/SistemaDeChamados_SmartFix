function validarFormulario() {
    try {
        var titulo = document.getElementById("titulo").value;
        var classificacao = document.getElementById("class_Ddl").value;
        var bloco = document.getElementById("bl_nomeDdl").value;
        var item = document.getElementById("itm_nomeDdl").value;
        var sala = document.getElementById("sala_Ddl").value;
        var maquina = document.getElementById("maq_Ddl").value;
        var descricao = document.getElementById("descricao").value;

        // Validação simples
        if (
            titulo === "" ||
            classificacao === undefined ||
            bloco === undefined ||
            item === undefined ||
            sala === undefined ||
            maquina === undefined ||
            descricao === ""
        ) {
            alert("Todos os campos são obrigatórios.");
            return false; // Não enviar o formulário
        }
        return true; // Enviar o formulário
    } catch (error) {
        console.log(error.message);
    }
}

// ******************************************************************************************************
