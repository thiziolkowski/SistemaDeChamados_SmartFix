document.getElementById("btnLimpar").addEventListener("click", function () {
    // Seleciona todos os campos de entrada dentro do main-content
    const inputs = document.querySelectorAll(
        "#mainContent input[type='text'], #mainContent input[type='number'], #mainContent select, #mainContent textarea, #mainContent input[type='date']"
    );

    // Itera sobre os campos e limpa cada um deles
    inputs.forEach(function (input) {
        input.value = ""; // Limpa o valor dos campos de texto
        if (input.type === "date") {
            input.value = "yyyy-MM-dd";
        }
        if (input.tagName.toLowerCase() === "select") {
            input.selectedIndex = 0; // Reseta o dropdown para a primeira opção
        }
    });

    const tbody = document.querySelector("tbody");

    // Limpa o conteúdo de todas as células dentro do tbody
    if (tbody) {
        const rows = tbody.querySelectorAll("tr");
        rows.forEach(function (row) {
            row.remove(); // Remove cada linha <tr>
        });
    }

    document.getElementById("btnExportar").style.display = "none";

    const btnBuscarEvent = document.getElementById("btnBuscar");

    // Altera apenas o texto, mantendo o ícone
    const icon = btnBuscarEvent.querySelector("i"); // Seleciona o ícone
    const newText = "Buscar Todos";

    // Se o botão tem um ícone, ajusta o texto sem removê-lo
    btnBuscarEvent.innerHTML = `${icon.outerHTML} ${newText}`;

    let select = document.getElementById("sala");
    select.disabled = true;
    select = document.getElementById("maquina");
    select.disabled = true;
});

document.getElementById("btnBuscar").addEventListener("click", function () {
    debugger;
    let cha_id = parseInt(document.getElementById("cha_id").value);
    let classificacao = parseInt(
        document.getElementById("classificacao").value
    );
    let maquina = parseInt(document.getElementById("maquina").value);
    let sala = parseInt(document.getElementById("sala").value); // Campo de texto.
    let bloco = parseInt(document.getElementById("bloco").value);
    let item = parseInt(document.getElementById("item").value);
    let dtinicio = document.getElementById("dtinicio").value;
    let dtfinal = document.getElementById("dtfinal").value;
    let situacao = document.getElementById("situacao").value;

    fetch("ticketCalls.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            action: "buscar",
            cha_id: cha_id,
            classificacao: classificacao,
            maquina: maquina,
            sala: sala,
            bloco: bloco,
            item: item,
            dtinicio: dtinicio,
            dtfinal: dtfinal,
            situacao: situacao,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Erro ao buscar os dados: " + response.statusText
                );
            }
            return response.json();
        })
        .then((data) => {
            if (data.SearchResults) {
                let tbody = document.getElementById("tbody");
                tbody.innerHTML = ""; // Limpa o conteúdo atual da tabela, se houver.

                data.SearchResults.forEach((item) => {
                    let tr = document.createElement("tr"); // Cria uma linha para a tabela.

                    // Adiciona as colunas (td) com os valores de cada item.
                    for (let key in item) {
                        let td = document.createElement("td");
                        if (key === "cha_sit" && item[key] === "Aberto") {
                            td.style.backgroundColor = "#f8c3c0"; // Fundo verde claro.
                            td.style.color = "#ff0000"; // Texto verde escuro.
                            td.style.padding = "5px 10px"; // Espaçamento interno.
                            td.style.borderRadius = "15px"; // Bordas arredondadas.
                            td.style.fontWeight = "bold"; // Texto em negrito.
                            td.style.minWidth = "60px"; // Define uma largura mínima para consistência.
                            td.style.whiteSpace = "nowrap"; // Evita quebra de linha.
                        }
                        if (key === "cha_sit" && item[key] === "Em Andamento") {
                            td.style.backgroundColor = "#fffdd0"; // Fundo verde claro.
                            td.style.color = "#eead2d"; // Texto verde escuro.
                            td.style.padding = "5px 10px"; // Espaçamento interno.
                            td.style.borderRadius = "15px"; // Bordas arredondadas.
                            td.style.fontWeight = "bold"; // Texto em negrito.
                            td.style.minWidth = "60px"; // Define uma largura mínima para consistência.
                            td.style.whiteSpace = "nowrap"; // Evita quebra de linha.
                        }
                        if (key === "cha_sit" && item[key] === "Finalizado") {
                            td.style.backgroundColor = "#d4edda"; // Fundo verde claro.
                            td.style.color = "#155724"; // Texto verde escuro.
                            td.style.padding = "5px 10px"; // Espaçamento interno.
                            td.style.borderRadius = "15px"; // Bordas arredondadas.
                            td.style.fontWeight = "bold"; // Texto em negrito.
                            td.style.minWidth = "60px"; // Define uma largura mínima para consistência.
                            td.style.whiteSpace = "nowrap"; // Evita quebra de linha.
                        }
                        if (key === "cha_notes" && item[key] !== null) {
                            let notasTd = document.createElement("td");
                            let notasButton = document.createElement("button");
                            notasButton.textContent = "Notas";
                            notasButton.className = "btn btn-primary";
                            notasButton.onclick = () => abrirDialogo(item[key]);
                            notasTd.appendChild(notasButton);
                            tr.appendChild(notasTd);
                            td.style.display = "none";
                        }
                        td.textContent = item[key];
                        tr.appendChild(td); // Adiciona a célula à linha.
                    }

                    tbody.appendChild(tr); // Adiciona a linha ao corpo da tabela.
                });
                document.getElementById("btnExportar").style.display = "block";
            }
        })
        .catch((error) => {
            console.error("Erro ao processar os dados:", error);
        });
});

document.getElementById("btnExportar").addEventListener("click", function () {
    let cha_id = parseInt(document.getElementById("cha_id").value);
    let classificacao = parseInt(
        document.getElementById("classificacao").value
    );
    let maquina = parseInt(document.getElementById("maquina").value);
    let sala = parseInt(document.getElementById("sala").value); // Campo de texto.
    let bloco = parseInt(document.getElementById("bloco").value);
    let item = parseInt(document.getElementById("item").value);
    let dtinicio = document.getElementById("dtinicio").value;
    let dtfinal = document.getElementById("dtfinal").value;
    let situacao = document.getElementById("situacao").value;

    fetch("ticketCalls.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            action: "buscar",
            cha_id: cha_id,
            classificacao: classificacao,
            maquina: maquina,
            sala: sala,
            bloco: bloco,
            item: item,
            dtinicio: dtinicio,
            dtfinal: dtfinal,
            situacao: situacao,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Erro ao buscar os dados: " + response.statusText
                );
            }
            return response.json();
        })
        .then((data) => {
            if (data.SearchResults) {
                //converte json para o formato de planilha e adiciona na constante "ws"
                const ws = XLSX.utils.json_to_sheet(data.SearchResults);

                //cria um webbook
                const wb = XLSX.utils.book_new();
                //cria uma nova folha de calculo com o nome "Chamados" e adiciona os resultados convertidos de "ws"
                XLSX.utils.book_append_sheet(wb, ws, "Chamados");

                // Gerar o arquivo Excel e baixa automatico
                XLSX.writeFile(wb, "RelatorioChamados.xlsx");
            } else {
                alert("Nenhum dado encontrado.");
            }
        });
});

const campos = document.getElementsByClassName("campos");

// Converte a coleção em um array para iterar e adicionar event listeners
Array.from(campos).forEach((campo) => {
    campo.addEventListener("change", function () {
        debugger; // Para depuração
        const btnBuscarEvent = document.getElementById("btnBuscar");

        // Altera apenas o texto, mantendo o ícone
        const icon = btnBuscarEvent.querySelector("i"); // Seleciona o ícone
        const newText = "Buscar";

        // Se o botão tem um ícone, ajusta o texto sem removê-lo
        btnBuscarEvent.innerHTML = `${icon.outerHTML} ${newText}`;
    });
});

function populateClassificacaoDropdown() {
    // Faz uma requisição ao PHP
    fetch("DDL_classificacao.php")
        .then((response) => response.json()) // Converte a resposta para JSON
        .then((data) => {
            debugger;
            // Seleciona o elemento dropdown
            let dropdown = document.getElementById("classificacao");

            // Limpa o dropdown
            dropdown.innerHTML =
                '<option value="">Selecione a classificação</option>';

            // Itera sobre os dados retornados
            data.DDLResults.forEach((item) => {
                // Cria uma nova opção
                let option = document.createElement("option");
                option.value = item.cla_id; // Define o valor do option
                option.text = item.cla_nome; // Define o texto a ser exibido

                // Adiciona a opção ao dropdown
                dropdown.appendChild(option);
            });
        })
        .catch((error) => console.error("Erro:", error));
}

function populateItemDropdown() {
    // Faz uma requisição ao PHP
    fetch("DDL_item.php")
        .then((response) => response.json()) // Converte a resposta para JSON
        .then((data) => {
            debugger;
            // Seleciona o elemento dropdown
            let dropdown = document.getElementById("item");

            // Limpa o dropdown
            dropdown.innerHTML = '<option value="">Selecione o item</option>';

            // Itera sobre os dados retornados
            data.DDLResults.forEach((item) => {
                // Cria uma nova opção
                let option = document.createElement("option");
                option.value = item.itm_id; // Define o valor do option
                option.text = item.itm_nome; // Define o texto a ser exibido

                // Adiciona a opção ao dropdown
                dropdown.appendChild(option);
            });
        })
        .catch((error) => console.error("Erro:", error));
}

function populateBlNomeDropdown() {
    // Faz uma requisição ao PHP
    fetch("DDL_bloco.php")
        .then((response) => response.json()) // Converte a resposta para JSON
        .then((data) => {
            debugger;
            // Seleciona o elemento dropdown
            let dropdown = document.getElementById("bloco");

            // Limpa o dropdown
            dropdown.innerHTML =
                '<option value="">Selecione a localização</option>';

            // Itera sobre os dados retornados
            data.DDLResults.forEach((item) => {
                // Cria uma nova opção
                let option = document.createElement("option");
                option.value = item.bl_id; // Define o valor do option
                option.text = item.bl_nome; // Define o texto a ser exibido

                // Adiciona a opção ao dropdown
                dropdown.appendChild(option);
            });
        })
        .catch((error) => console.error("Erro:", error));
}

function populateSalaDropdown(bloco_id) {
    const dropdownSala = document.getElementById("sala");
    if (!bloco_id) {
        document.getElementById("sala").innerHTML =
            '<option value="">Selecione uma sala</option>';
        dropdownSala.disabled = true;
        dropdownSala.value = "";
        return;
    }
    dropdownSala.disabled = false;
    dropdownSala.innerHTML = '<option value="">Selecione uma sala</option>';
    fetch("DDL_sala.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bloco_id: bloco_id,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            let dropdown = document.getElementById("sala");

            // Itera sobre os dados retornados
            data.DDLResults.forEach((item) => {
                // Cria uma nova opção
                let option = document.createElement("option");
                option.value = item.sl_id; // Define o valor do option
                option.text = item.sl_num; // Define o texto a ser exibido

                // Adiciona a opção ao dropdown
                dropdown.appendChild(option);
            });
        })
        .catch((error) => console.error("Erro:", error));
}

function populateMaquinaDropdown(sala_id) {
    const dropdownMaquina = document.getElementById("maquina");
    if (!sala_id) {
        document.getElementById("maquina").innerHTML =
            '<option value="">Selecione uma máquina</option>';
        dropdownMaquina.disabled = true;
        dropdownMaquina.value = "";
        return;
    }
    dropdownMaquina.disabled = false;
    dropdownMaquina.innerHTML =
        '<option value="">Selecione uma máquina</option>';
    fetch("DDL_maquina.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sala_id: sala_id,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            let dropdown = document.getElementById("maquina");

            // Itera sobre os dados retornados
            data.DDLResults.forEach((item) => {
                // Cria uma nova opção
                let option = document.createElement("option");
                option.value = item.maq_id; // Define o valor do option
                option.text = item.maq_num; // Define o texto a ser exibido

                // Adiciona a opção ao dropdown
                dropdown.appendChild(option);
            });
        })
        .catch((error) => console.error("Erro:", error));
}

function abrirDialogo(item) {
    const overlay = document.getElementById("dialogOverlay");
    const textarea = document.getElementById("notasTextarea");
    overlay.style.display = "flex"; // Exibe o modal
    textarea.textContent = item; // Opcional: Preencha com notas associadas ao item
}

function fecharDialogo() {
    const overlay = document.getElementById("dialogOverlay");
    overlay.style.display = "none"; // Esconde o modal
}

window.onload = function () {
    if (!localStorage.getItem("isLoggedIn")) {
        debugger;
        window.location.href = "../Login/index.html";
    }
    populateBlNomeDropdown();
    populateSalaDropdown();
    populateClassificacaoDropdown();
    populateMaquinaDropdown();
    populateItemDropdown();
};
