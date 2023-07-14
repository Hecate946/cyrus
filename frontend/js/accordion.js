const page_sound = new Audio("./assets/sounds/page.mp3");
const page_sound2 = new Audio("./assets/sounds/page_close.mp3");
var accordLabels = document.querySelectorAll(".accordion-label");
accordLabels.forEach(function (label) {
    label.addEventListener("click", function () {
        var content = label.nextElementSibling;
        if (!content.style.maxHeight || content.style.maxHeight === "0px") {
            page_sound.play();
            label.classList.add("active");
            content.style.maxHeight = content.scrollHeight + "px";
        }
        else {
            page_sound2.play();
            label.classList.remove("active");
            content.style.maxHeight = "0px";
        }
    });
});
