// Criar uma nova data para hoje
const today = new Date();

today.setHours(0, 0, 0, 0); // Zerando as horas, minutos, segundos e milissegundos (fuso)

// Converter a data para o formato YYYY-MM-DD
const maxDate = today.toISOString().split("T")[0];

document.getElementById("dtfinal").setAttribute("max", maxDate);

let selectedLinkContent = null;
let initialFieldOrder = [];

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

    let select = document.getElementById("sala");
    select.disabled = true;
    select = document.getElementById("maquina");
    select.disabled = true;
});

function searchCalls() {
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
    let cha_notes = document.getElementById("cha_notes").value;

    fetch("editCalls.php", {
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
            cha_notes: cha_notes,
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
                        if (key === "cha_id") {
                            // Substitua 'suaColunaEspecifica' pela chave da coluna desejada.
                            let linkButton = document.createElement("a"); // Cria um elemento de link.
                            linkButton.textContent = item[key]; // Texto do link.
                            linkButton.href = "#";
                            const savedTheme = localStorage.getItem("theme");
                            if (savedTheme === "../../darkStyle.css") {
                                linkButton.style.backgroundColor = "#2563eb";
                                linkButton.style.padding = "5px 10px";
                                linkButton.style.borderRadius = "15px";
                                linkButton.style.fontWeight = "bold";
                                linkButton.style.minWidth = "60px";
                                linkButton.style.whiteSpace = "nowrap";
                                linkButton.style.color = "white";
                            } else {
                                linkButton.style.backgroundColor = "#2563eb";
                                linkButton.style.padding = "5px 10px";
                                linkButton.style.borderRadius = "15px";
                                linkButton.style.fontWeight = "bold";
                                linkButton.style.minWidth = "60px";
                                linkButton.style.whiteSpace = "nowrap";
                                linkButton.style.color = "white";
                            }
                            // linkButton.style.textDecoration = "none";
                            linkButton.onclick = function (event) {
                                event.preventDefault();
                                selectedLinkContent = linkButton.textContent;

                                document.getElementById(
                                    "btnAtualizar"
                                ).style.display = "inline-block";
                                document.getElementById(
                                    "btnVoltar"
                                ).style.display = "inline-block";
                                document.getElementById(
                                    "btnBuscar"
                                ).style.display = "none";
                                document.getElementById(
                                    "btnLimpar"
                                ).style.display = "none";

                                const campos =
                                    document.querySelectorAll(".div_campos");
                                campos.forEach((campo) => {
                                    campo.style.display = "none";
                                });

                                document.getElementById("notes").style.display =
                                    "inline-block";
                                document.getElementById(
                                    "cha_id"
                                ).disabled = true;
                                document.getElementById("cha_id").value =
                                    item.cha_id;

                                // Reordenar os campos
                                const formRow =
                                    document.querySelector(".form-row"); // Container dos campos

                                // Selecionar os campos para reordenar
                                const chaIdField = document
                                    .getElementById("cha_id")
                                    .closest(".form-group");
                                const situacaoField = document
                                    .getElementById("situacao")
                                    .closest(".form-group");
                                const dtFinalField = document
                                    .getElementById("dtfinal")
                                    .closest(".form-group");
                                const notesField =
                                    document.getElementById("notes");

                                // Adicionar os campos na nova ordem
                                formRow.appendChild(chaIdField);
                                formRow.appendChild(situacaoField);
                                formRow.appendChild(dtFinalField);
                                formRow.appendChild(notesField);
                            };
                            td.appendChild(linkButton); // Adiciona o link à célula.
                        } else {
                            td.textContent = item[key];
                        }
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
}

document.getElementById("btnBuscar").addEventListener("click", function () {
    searchCalls();
});

document.getElementById("btnAtualizar").addEventListener("click", function () {
    document.getElementById("loading-screen").style.display = "flex";
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
    let id = parseInt(selectedLinkContent);
    let cha_notes = document.getElementById("cha_notes").value;

    const input = document.getElementById("maquina");
    let select = document.getElementById("bloco");

    fetch("editCalls.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            action: "atualizar",
            cha_id: cha_id,
            classificacao: classificacao,
            maquina: maquina,
            sala: sala,
            bloco: bloco,
            item: item,
            dtinicio: dtinicio,
            dtfinal: dtfinal,
            situacao: situacao,
            cha_notes: cha_notes,
            id: id,
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
            debugger;
            if (data.UpdateResults[0].erro !== "erro") {
                // Você pode manipular ou exibir esses dados conforme necessário.
                searchCalls();
                document.querySelector(".form-alert-success").style.display =
                    "block";
                document.getElementById("cha_id").value = NaN;
                document.getElementById("situacao").value = "";
                document.getElementById("cha_notes").value = "";
                document.getElementById("dtfinal").value = "";
            } else {
                window.alert("Não é possivel atualizar um chamado Finalizado");
            }
        })
        .catch((error) => {
            console.error("Erro ao processar os dados:", error);
        })
        .finally(() => {
            // Esconder o loading após a resposta
            document.getElementById("loading-screen").style.display = "none";
        });
});

document.getElementById("btnVoltar").addEventListener("click", function () {
    document.getElementById("btnAtualizar").style.display = "none";
    document.getElementById("btnVoltar").style.display = "none";
    document.getElementById("btnBuscar").style.display = "inline-block";
    document.getElementById("btnLimpar").style.display = "inline-block";

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

    const campos = document.querySelectorAll(".div_campos");
    campos.forEach((campo) => {
        campo.style.display = "inline-block";
    });

    document.getElementById("notes").style.display = "none";
    document.getElementById("cha_id").disabled = false;

    // Selecionar os campos para reordenar
    // Reordenar os campos
    const formRow = document.querySelector(".form-row"); // Container dos campos
    initialFieldOrder.forEach((field) => {
        formRow.appendChild(field); // Reanexa os campos na ordem original
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

function onSituationChange(situacao) {
    let dtfinal = document.getElementById("dtfinal");
    let notes = document.getElementById("cha_notes");

    if (situacao === "Em Andamento") {
        dtfinal.disabled = true;
    } else if (situacao === "Finalizado") {
        dtfinal.disabled = false;
        notes.disabled = false;
    } else if (situacao === "") {
        dtfinal.disabled = false;
        notes.disabled = false;
    }
}

window.onload = function () {
    if (!localStorage.getItem("isLoggedIn")) {
        debugger;
        window.location.href = "../Login/index.html";
    }
    const formRow = document.querySelector(".form-row");
    initialFieldOrder = Array.from(formRow.children);
    onSituationChange();
    populateBlNomeDropdown();
    populateSalaDropdown();
    populateClassificacaoDropdown();
    populateMaquinaDropdown();
    populateItemDropdown();
};
