
var timeout;
function handleForm(button) {

    // establish some constant elements.

    const DGRAPH = document.getElementById("distance-graph");
    const VGRAPH = document.getElementById("velocity-graph");

    const TIME_LABEL = document.getElementById("time-label");
    const DISTANCE_LABEL = document.getElementById("distance-label");
    const BLOCK = document.getElementById("block");
    const LINE = document.getElementById("line");
    // 1 meter = 30 pixels for our animation.
    const METERS_TO_PIXELS = LINE.offsetWidth/10
    const TOTAL_TRAVEL_DISTANCE = (LINE.offsetWidth - BLOCK.offsetWidth) / METERS_TO_PIXELS;

    // establish the form input variables.
    var force = Number(document.getElementById('force').value);
    var mass = Number(document.getElementById('mass').value);
    var slope = Number(document.getElementById('slope').value);
    var gravity = Number(document.getElementById('gravity').value);
    var staticFriction = Number(document.getElementById('sfriction').value);
    var kineticFriction = Number(document.getElementById('kfriction').value);

    // do some checks on input validity.
    if (isNaN(force) || force < 0) {
        alert("Force value must be a positive real number");
        return;
    }
    if (isNaN(mass) || mass < 0) {
        alert("Mass value must be a positive real number");
        return;
    }
    if (isNaN(slope) || slope < -90 || slope > 90) {
        alert("Slope must be between -90 and 90 degrees.");
        return;
    }
    if (isNaN(gravity) || gravity < 0) {
        alert("Gravity acceleration value must be a positive real number");
        return;
    }
    if (isNaN(staticFriction) || staticFriction < 0 ) {
        alert("Static frictional coefficient must be a positive real number");
        return;
    }
    if (isNaN(kineticFriction) || kineticFriction < 0) {
        alert("Kinetic frictional coefficient must be a positive real number");
        return;
    }



    // stop the recursive function in case we were running.
    clearTimeout(timeout);
    // put the block at starting position
    BLOCK.style.marginLeft = 0;
    // reset counters
    TIME_LABEL.innerHTML = "Time: 0 ms";
    DISTANCE_LABEL.innerHTML = "Distance: 0 m";
    // rotate the line.
    LINE.style.transform = `rotate(${slope}deg)`

    // clear the graphs
    DGRAPH.innerHTML = "";
    VGRAPH.innerHTML = "";
    if (button == "reset") {
        // we already reset all the counters
        return; // just return.
    }

    // start moving our block with time = 0.
    moveBlock(0);

    // move the block to a position based on time in milliseconds.
    function moveBlock(timeMs) {
        timeMs+=5.3; // time measured on my computer to match actual times.
        // distance in meters.
        var distToMove = distanceFromTimeMs(timeMs);
        if (distToMove == 0) {
            return;
        }

        timeout = setTimeout(function () {
            TIME_LABEL.innerHTML = `Time: ${timeMs.toFixed(0)} ms`;
            DISTANCE_LABEL.innerHTML = `Distance: ${distToMove.toFixed(2)} m`;
            updateDistanceGraph(timeMs, distToMove);
            updateVelocityGraph(timeMs, distToMove);

            BLOCK.style.marginLeft = distToMove * METERS_TO_PIXELS + "px";
            moveBlock(timeMs); // run again.

            if (distToMove * METERS_TO_PIXELS + BLOCK.offsetWidth >= LINE.offsetWidth) { // we've reached the end.
                // update to reflect final values.
                TIME_LABEL.innerHTML = `Time: ${timeMsFromDistance(TOTAL_TRAVEL_DISTANCE)} ms`;
                DISTANCE_LABEL.innerHTML = `Distance: ${TOTAL_TRAVEL_DISTANCE.toFixed(2)} m`;
                BLOCK.style.marginLeft = LINE.offsetWidth - BLOCK.offsetWidth + "px";
                clearTimeout(timeout);
            }
        }, 1); // this function runs once per millisecond.
    }

    function toRadians (angle) { // utility function
        return angle * (Math.PI / 180);
    }
    function calculateAcceleration() {
        var forceParallel = mass * gravity * Math.sin(toRadians(slope)) + force;
        var normalForce = mass * gravity * Math.cos(toRadians(slope));

        var staticFrictionalForce = normalForce * staticFriction;
        if (staticFrictionalForce > forceParallel) {
            return 0; // no work needed, the block won't move.
        }

        var kineticFrictionalForce = normalForce * kineticFriction;
        var totalForce = forceParallel - kineticFrictionalForce;
        return totalForce / mass;
    }

    function timeMsFromDistance(meters) {
        var accel = calculateAcceleration();
        // time = sqrt(distance/(1/2 * accel))
        var time = Math.sqrt(meters/(0.5 * accel));
        return Math.round(time*1000);
    }

    function distanceFromTimeMs(timeMs) {
        var t = timeMs / 1000; // convert from ms to seconds.
        var accel = calculateAcceleration();
        // distance = 1/2 * accel * time^2
        return 0.5 * accel * t * t;
    }

    function updateDistanceGraph(time, distance) {
        // 1 meter = 30 px
        // 1 ms = 30 px/100 ms
        var bottom = 30 * distance;
        var left = 0.30 * time;
        if (bottom >= 300 || left >= 300) {
            return;
        }

        var div = document.createElement("div");
        div.classList.add("data-point");
        div.style.bottom =  bottom + "px";
        div.style.left = left + "px";
        DGRAPH.appendChild(div);
    }

    function updateVelocityGraph(time, distance) {
        // 1 meter = 30 px
        // 1 ms = 30 px/100 ms
        var bottom = 30 * distance / (time / 1000);
        var left = 0.30 * time;
        if (bottom >= 300 || left >= 300) {
            return;
        }

        var div = document.createElement("div");
        div.classList.add("data-point");
        div.style.bottom =  bottom + "px";
        div.style.left = left + "px";
        VGRAPH.appendChild(div);
    }
}