let selectedLinkContent = null;

document.getElementById("btnLimpar").addEventListener("click", function () {
    // Seleciona todos os campos de entrada dentro do main-content
    const inputs = document.querySelectorAll(
        "#mainContent input[type='text'], #mainContent input[type='number'], #mainContent select, #mainContent textarea, #mainContent input[type='date']"
    );

    // Itera sobre os campos e limpa cada um deles
    inputs.forEach(function (input) {
        input.value = ""; // Limpa o valor dos campos de texto
        if (input.tagName.toLowerCase() === "select") {
            input.selectedIndex = 0; // Reseta o dropdown para a primeira opção
        }
    });

    // Seleciona o tbody da tabela
    const tbody = document.querySelector("tbody");

    // Limpa o conteúdo de todas as células dentro do tbody
    if (tbody) {
        const rows = tbody.querySelectorAll("tr");
        rows.forEach(function (row) {
            row.remove(); // Remove cada linha <tr>
        });
    }
    document.getElementById("btnAtualizar").style.display = "none";
    document.querySelector(".form-alert").style.display = "none";
    document.querySelector(".form-alert-success").style.display = "none";
    document.querySelector(".form-alert-alreadyexists").style.display = "none";
    const input = document.getElementById("bloco");

    input.classList.remove("error");
});

document.getElementById("btnBuscar").addEventListener("click", function () {
    let bloco = document.getElementById("bloco").value;

    fetch("blockRegister.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            action: "buscar",
            bloco: bloco,
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
                        if (key === "bl_id") {
                            debugger;
                            // Substitua 'suaColunaEspecifica' pela chave da coluna desejada.
                            const savedTheme = localStorage.getItem("theme");
                            let linkButton = document.createElement("a"); // Cria um elemento de link.
                            linkButton.textContent = item[key]; // Texto do link.
                            linkButton.href = "#";
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

                                document.getElementById("bloco").value =
                                    item.bl_nome;

                                document.getElementById(
                                    "btnAtualizar"
                                ).style.display = "inline-block";
                            };
                            td.appendChild(linkButton); // Adiciona o link à célula.
                        } else {
                            td.textContent = item[key];
                        }
                        tr.appendChild(td); // Adiciona a célula à linha.
                    }

                    tbody.appendChild(tr); // Adiciona a linha ao corpo da tabela.
                });
            }
        })
        .catch((error) => {
            console.error("Erro ao processar os dados:", error);
        });
});

document.getElementById("btnSalvar").addEventListener("click", function () {
    let bloco = document.getElementById("bloco").value;
    const input = document.getElementById("bloco");

    if (bloco === "") {
        debugger;
        document.querySelector(".form-alert").style.display = "block";
        input.classList.add("error");
    } else {
        fetch("blockRegister.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                action: "salvar",
                bloco: bloco,
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
                if (data.SaveResults[0].erro !== "erro") {
                    // Você pode manipular ou exibir esses dados conforme necessário.

                    let tbody = document.getElementById("tbody");
                    tbody.innerHTML = ""; // Limpa o conteúdo atual da tabela, se houver.

                    data.SaveResults.forEach((item) => {
                        let tr = document.createElement("tr"); // Cria uma linha para a tabela.

                        // Adiciona as colunas (td) com os valores de cada item.
                        for (let key in item) {
                            let td = document.createElement("td");
                            td.textContent = item[key]; // Define o conteúdo da célula com o valor do item.
                            tr.appendChild(td); // Adiciona a célula à linha.
                        }

                        tbody.appendChild(tr); // Adiciona a linha ao corpo da tabela.
                    });
                    document.querySelector(
                        ".form-alert-success"
                    ).style.display = "block";
                } else {
                    document.querySelector(
                        ".form-alert-alreadyexists"
                    ).style.display = "block";
                }
            })
            .catch((error) => {
                console.error("Erro ao processar os dados:", error);
            });
    }
});

document.getElementById("btnAtualizar").addEventListener("click", function () {
    let bloco = document.getElementById("bloco").value;
    let id = parseInt(selectedLinkContent);
    const input = document.getElementById("bloco");

    if (bloco === "") {
        document.querySelector(".form-alert").style.display = "block";
        input.classList.add("error");
    } else {
        fetch("blockRegister.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                action: "atualizar",
                bloco: bloco,
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
                if (data.UpdateResults[0].erro !== "erro") {
                    // Você pode manipular ou exibir esses dados conforme necessário.

                    let tbody = document.getElementById("tbody");
                    tbody.innerHTML = ""; // Limpa o conteúdo atual da tabela, se houver.

                    data.UpdateResults.forEach((item) => {
                        let tr = document.createElement("tr"); // Cria uma linha para a tabela.

                        // Adiciona as colunas (td) com os valores de cada item.
                        for (let key in item) {
                            let td = document.createElement("td");
                            td.textContent = item[key]; // Define o conteúdo da célula com o valor do item.
                            tr.appendChild(td); // Adiciona a célula à linha.
                        }

                        tbody.appendChild(tr); // Adiciona a linha ao corpo da tabela.
                    });
                    document.getElementById("btnAtualizar").style.display =
                        "none";
                    document.querySelector(
                        ".form-alert-success"
                    ).style.display = "block";
                } else {
                    document.querySelector(
                        ".form-alert-alreadyexists"
                    ).style.display = "block";
                }
            })
            .catch((error) => {
                console.error("Erro ao processar os dados:", error);
            });
    }
});

document.getElementById("bloco").addEventListener("change", function () {
    const input = document.getElementById("bloco");
    input.classList.remove("error");
});

window.onload = function () {
    if (!localStorage.getItem("isLoggedIn")) {
        debugger;
        window.location.href = "../Login/index.html";
    }
};
