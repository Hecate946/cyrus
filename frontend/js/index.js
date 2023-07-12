var mousePosition;
var offset = [0, 0];
var div;
var isDown = false;


const draggables = document.querySelectorAll(".draggable-div");
draggables.forEach(function (draggable) {
    if (draggable.style.opacity === 0) {
        return; // we only care about the visible elements!
    }
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
