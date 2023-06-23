const REFRESH_RATE_MS = 10; // one hundreth of a second.

var can_run = true;
window.addEventListener("load", () => {
    recurse();
});

function recurse() {
    if (can_run) {
        setTimeout(function() {
            get_stats();
            recurse();
        }, REFRESH_RATE_MS);
    }
}

function get_stats() {
    fetch(window.location.origin + "/api/get_stats").then(function(response) {
        if (response.ok)
        {
            return response.json();
        }
        else
        {
            can_run = false;
        }
    }).then(function(data) {
        var parent = document.querySelector("#data-container");
        parent.innerHTML = "";
        for (const key in data) {
            var div = document.createElement("div");
            parent.appendChild(div);
            if (key == "Total physical memory") {
                data[key] /= 1000000;
                data[key] = data[key].toFixed(2);
                data[key] += " GB";
            }
            spacer = "&nbsp;".repeat(25 - key.length)
            div.innerHTML = `${key + spacer}: ${data[key]}`
        }
    }).catch(() =>  {
        can_run = false;
    });
}

