var timeout;
const simulationWidth = document.getElementById("simulation").scrollWidth;
console.log(simulationWidth);

function handleForm() {
    var force = document.getElementById('force').value;
    var mass = document.getElementById('mass').value;
    var friction = document.getElementById('friction').value;
    if (isNaN(force)) {
        alert("Force value must be a real number");
        return;
    }
    if (isNaN(mass)) {
        alert("Mass value must be a real number");
        return;
    }
    if (isNaN(friction) || friction < 0 || friction > 1) {
        alert("Frictional coefficient must be a real number between 0.00 and 1.00");
        return;
    }
    clearTimeout(timeout);
    moveBlock(force, mass, friction, 0);
}

function moveBlock(force, mass, friction, milliseconds) {
    milliseconds++;
    var seconds = milliseconds / 1000;
    var accel_due_to_gravity = 9.81;
    var frictional_force = accel_due_to_gravity * friction;
    var accel = (force - frictional_force) / mass; // result in meters/second
    // distance = 1/2 * accel * t^2
    var toTravel = 0.5 * accel * seconds * seconds;
    // assume 1 meter = 100 pixels
    toTravel*=100;

    timeout = setTimeout(function () {
        var block = document.getElementById("block");
        block.style.left = toTravel + "px";
        moveBlock(force, mass, friction, milliseconds);
        if (toTravel + block.scrollWidth >= simulationWidth) {
            clearTimeout(timeout);
            block.style.left = "auto";
            block.style.right = 0;
        }
    }, 1);
}