fetch(window.location.origin + "/api/get_stats").then(function(response) {
    if (response.ok) {
        return response.json();
    }
    else {
        return Promise.reject(response);
    }
}).then(function(data) {
    console.log(data.length)
    var parent = document.querySelector("#data-container");
    for (const key in data) {
        var div = document.createElement("div");
        parent.appendChild(div);
        div.innerHTML = `${key}: ${data[key]}`
    }
    // .innerHTML = data.hostname;
});

