var timeout;

function handleForm(button) {
    if (button == "reset") {
        document.getElementById("block").style.left = 0;
        document.getElementById("time").innerHTML = "Time taken: 0 ms";
        document.getElementById("distance").innerHTML = "Distance traveled: 0 m";
        clearTimeout(timeout);
        return;
    }
    var force = document.getElementById('force').value;
    var mass = document.getElementById('mass').value;
    var friction = document.getElementById('friction').value;
    var slope = document.getElementById('slope').value;
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
    if (isNaN(slope) || slope < 0 || slope > 90) {
        alert("Slope must be between 0 and 90 degrees.");
        return;
    }
    document.getElementById("time").innerHTML = "Time taken: 0 ms";
    document.getElementById("distance").innerHTML = "Distance traveled: 0 m";
    document.getElementById("parent").style.transform = `rotate(${slope}deg)`
    document.getElementById("block").style.left = 0;

    clearTimeout(timeout);
    moveBlock(force, mass, friction, slope, 0, 0);
}

function toRadians (angle) {
    return angle * (Math.PI / 180);
  }

function moveBlock(force, mass, friction, slope, milliseconds, traveled) {
    // 10 meter = 300 pixels
    var parentWidth = document.getElementById("inner").offsetWidth;
    const METERS_TO_PIXELS = parentWidth/10;
    milliseconds++;
    var seconds = milliseconds / 1000;

    var gravitational_force_parallel = mass * force * Math.sin(toRadians(slope));
    var normal_force = mass * force * Math.cos(toRadians(slope));

    var frictional_force = normal_force * friction;

    if (gravitational_force_parallel <= frictional_force) {
        return; // no work needed.
    }
    var accel = (gravitational_force_parallel - frictional_force) / mass;

    // distance = 1/2 * accel * t^2
    var toTravel = 0.5 * accel * seconds * seconds; // result in meters.
    // assume 1 meter = 30 pixels
    traveled = toTravel * METERS_TO_PIXELS;

    timeout = setTimeout(function () {
        var block = document.getElementById("block");
        document.getElementById("time").innerHTML = `Time taken: ${milliseconds} ms`;
        document.getElementById("distance").innerHTML = `Distance traveled: ${(traveled/METERS_TO_PIXELS).toFixed(2)} m`;
        block.style.left = traveled + "px";
        moveBlock(force, mass, friction, slope, milliseconds, traveled);
        if (traveled + block.offsetWidth >= parentWidth) {
            document.getElementById("time").innerHTML = `Time taken: ${Math.round(Math.sqrt(18/(force * Math.sin(toRadians(slope)))) * 1000)} ms`;
            document.getElementById("distance").innerHTML = `Distance traveled: 9.00 m`;
            block.style.left = parentWidth - block.offsetWidth + "px";
            clearTimeout(timeout);
        }
    }, 1);
}