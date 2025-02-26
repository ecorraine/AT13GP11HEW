document.addEventListener("DOMContentLoaded", function () {
    const currentYear = new Date().getFullYear();

    document.title = "HAL大阪" + currentYear + "年度 AT・GP学科 HAL EVENT WEEK";

    const yearElements = document.querySelectorAll(".current-year");
    yearElements.forEach(function (element) {
        element.textContent = currentYear;
    });
});