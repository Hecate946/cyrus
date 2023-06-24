var accordLabels = document.querySelectorAll(".accordion-label");
accordLabels.forEach(function (label) {
    label.addEventListener("click", function () {
        var content = label.nextElementSibling;
        if (!content.style.maxHeight || content.style.maxHeight === "0px") {
            label.classList.add("active");
            content.style.maxHeight = content.scrollHeight;
        }
        else {
            label.classList.remove("active");
            content.style.maxHeight = "0px";
        }
    })
})