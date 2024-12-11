window.onload = function () {
    if (!localStorage.getItem("isLoggedIn")) {
        debugger;
        window.location.href = "../Login/index.html";
    }
};
