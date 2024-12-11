window.onload = function () {
    localStorage.removeItem("isLoggedIn");
};

async function fazerLogin(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const usuario = document.getElementById("username").value;
    const senha = document.getElementById("password").value;
    const mensagem = document.getElementById("mensagem");

    try {
        const resposta = await fetch("login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `username=${usuario}&password=${senha}`,
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            debugger;
            localStorage.setItem("isLoggedIn", true);
            window.location.href = "../Home/home.html";
        } else {
            localStorage.setItem("isLoggedIn", false);
            mensagem.textContent = resultado.erro;
            mensagem.style.color = "red";
        }
    } catch (erro) {
        mensagem.textContent = "Erro ao conectar ao servidor." + erro;
        mensagem.style.color = "red";
    }
}
