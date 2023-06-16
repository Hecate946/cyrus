
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
        window.open(btn.href);
    });
});

close_buttons.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
        event.preventDefault();
        close_sound.play();
        close_sound.onended = function () {
            btn.parentElement.parentElement.parentElement.style.opacity = 0;
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
                popup.style.opacity = 1;
            }
            else {
                window.location = link.href;   // navigate to clicked link when audio stops playing
            }
        };
    });
});

var mousePosition;
var offset = [0, 0];
var div;
var isDown = false;


const draggables = document.querySelectorAll(".draggable-div");
draggables.forEach(function (draggable) {
    draggable.addEventListener('mousedown', function (e) {
        isDown = true;
        offset = [
            draggable.offsetLeft - e.clientX,
            draggable.offsetTop - e.clientY
        ];
    }, true);

    draggable.addEventListener('mousedown', function (e) {
        isDown = true;
        offset = [
            draggable.offsetLeft - e.clientX,
            draggable.offsetTop - e.clientY
        ];
    }, true);

    document.addEventListener('mouseup', function () {
        isDown = false;
    }, true);

    document.addEventListener('mousemove', function (event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {

                x: event.clientX,
                y: event.clientY

            };
            var gotoX = mousePosition.x + offset[0];
            var gotoY = mousePosition.y + offset[1];
            var right_boundary = window.innerWidth - draggable.offsetWidth;
            var bottom_boundary = window.innerHeight - draggable.offsetHeight;

            gotoX = ((gotoX > 0) ? gotoX : 0);
            gotoX = ((gotoX < right_boundary) ? gotoX : right_boundary - 1);
            gotoY = ((gotoY > 0) ? gotoY : 0);
            gotoY = ((gotoY < bottom_boundary) ? gotoY : bottom_boundary - 1);
            draggable.style.left = gotoX + 'px';
            draggable.style.top = gotoY + 'px';
        }
    }, true);
});