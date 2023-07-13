var skillBars = document.querySelectorAll(".skills-bar");
skillBars.forEach(function(skillBar) {
    var progressBar = skillBar.firstElementChild;
    var percentage = skillBar.parentElement.getAttribute("data-percent");
    progressBar.style.maxWidth = percentage + "%";
})
