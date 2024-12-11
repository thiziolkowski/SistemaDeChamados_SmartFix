document.addEventListener("DOMContentLoaded", function () {
    fetch("../../Components/sidebar.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("sidebar-container").innerHTML = data;
            document
                .getElementById("sidebar")
                .addEventListener("click", function (event) {
                    // Verifica se o clique foi em um item de menu diferente do Cadastro
                    if (!event.target.closest("#cadastro-toggle")) {
                        this.classList.toggle("collapsed");
                        document
                            .getElementById("mainContent")
                            .classList.toggle("expanded");
                    }
                });

            document
                .getElementById("cadastro-toggle")
                .addEventListener("click", function () {
                    const submenu = document.getElementById("submenu");
                    submenu.classList.toggle("show");
                    const dropdownIcon =
                        document.getElementById("dropdown-icon");
                    dropdownIcon.classList.toggle("fa-chevron-up");
                    dropdownIcon.classList.toggle("fa-chevron-down");
                });

            const themeStyle = document.getElementById("theme-style");
            const switchBtn = document.getElementById("switch-theme-btn");
            const toggleInput = document.querySelector(".switch input");

            // Função para alternar o tema
            function toggleTheme() {
                const currentTheme = themeStyle.getAttribute("href");
                const newTheme =
                    currentTheme === "../../style.css"
                        ? "../../darkStyle.css"
                        : "../../style.css";

                themeStyle.setAttribute("href", newTheme);

                // Salva o tema escolhido no localStorage
                localStorage.setItem("theme", newTheme);

                toggleInput.checked = newTheme === "../../darkStyle.css";

                updateLinksColor();
            }
            switchBtn.addEventListener("click", toggleTheme);
            const savedTheme = localStorage.getItem("theme");

            if (savedTheme) {
                themeStyle.setAttribute("href", savedTheme);
                toggleInput.checked = savedTheme === "../../darkStyle.css"; // Sincroniza o botão com o tema
            } else {
                // Define um tema padrão (opcional)
                toggleInput.checked = false;
                themeStyle.setAttribute("href", "../../style.css");
            }
        })
        .catch((error) => console.error("Erro ao carregar a sidebar:", error));
});

function updateLinksColor() {
    const links = document.querySelectorAll("tbody a"); // Seleciona todos os links no tbody
    const savedTheme = localStorage.getItem("theme");

    links.forEach((link) => {
        if (savedTheme === "../../darkStyle.css") {
            link.style.color = "white"; // Tema escuro
        } else {
            link.style.color = "white"; // Tema claro
        }
    });
}
