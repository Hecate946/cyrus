
const click_sound = new Audio("./assets/sounds/open.mp3");
const links = document.querySelectorAll(".click");

const close_sound = new Audio("./assets/sounds/close.mp3");
const close_buttons = document.querySelectorAll(".close");

const redirect_sound = new Audio("./assets/sounds/swoosh.mp3");
const redirects = document.querySelectorAll(".redirect");



redirects.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
        event.preventDefault();
        redirect_sound.play();
        if(btn.href) {
            window.open(btn.href);
        }
    });
});

close_buttons.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
        event.preventDefault();
        close_sound.play();
        close_sound.onended = function () {
            if (btn.id == "links-close") {
                var box = btn.parentElement.parentElement.parentElement;
                box.classList.add('visuallyhidden');    
                box.addEventListener('transitionend', function(e) {
                  box.classList.add('hidden');
                }, {
                  capture: false,
                  once: true,
                  passive: false
                });
            }
        };
    });
});

links.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        click_sound.play();
        click_sound.onended = function () {
            if (link.id == "#links-popup") {
                var popup = document.getElementById("links-div")
                popup.classList.remove('hidden');
                setTimeout(function () {
                    popup.classList.remove('visuallyhidden');
                }, 20);
            }
            else if (link.href) {
                window.location = link.href;   // navigate to clicked link when audio stops playing
            }
        };
    });
});