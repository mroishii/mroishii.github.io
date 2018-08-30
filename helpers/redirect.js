function closeWindows() {
    setTimeout(function () {
        window.close();
    }, 3000);
}

window.onload = function() {
    localStorage.setItem("URL", location.href);
    closeWindows();
}