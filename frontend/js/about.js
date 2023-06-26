// constant to set the wait between character prints.
const CHARACTER_DELAY_MS = 20;
// array of punctuation marks we should delay on.
const PUNCTUATION_TO_PAUSE = [",", ".", ";", ":", "!"];
// length of time to pause on each punctuation mark
const PUNCTUATION_PAUSE_MS = 200;

// a typewriter is any html element that has the .typewriter class.
// every typewriter will be printed out dynamically character by character.
var typewriters = document.querySelectorAll(".typewriter");

window.addEventListener("load", () => {
    // first typewriter element.
    elem = typewriters[0]
    // we have a typewriter.
    if (elem) {   // make the initial typewriter call with the first element.
        typeWriter(typewriters[0].innerHTML, 0, 0);
    }
});

var time; // create a storage variable for the timeout.
var pause_counter = 0;
function typeWriter(initial_text, index, char) {
    // fetch the element we're currently working with.
    elem = typewriters[index];
    // only do work if it exists.
    if (elem) {
        // use setTimeout to create a delay.
        time = setTimeout(function () {
            if (initial_text[char - 1] === "<") {
                while (initial_text[char - 1] !== ">") {
                    char++;
                }
                char++;
            }
            // create a string with the current characters to display
            var type = initial_text.substring(0, char);
            // update the html to contain the new text.s
            elem.innerHTML = type;
            // set the opacity to 1 so we can see the text.
            elem.style.display = "block";

            
            var pause_length = PUNCTUATION_PAUSE_MS/CHARACTER_DELAY_MS;
            if (elem.classList.contains("no-pause") === true) {
                pause_length = 0;
            }
            if (PUNCTUATION_TO_PAUSE.includes(type.slice(-1)) && pause_counter < pause_length) {
                pause_counter++;
                typeWriter(initial_text, index, char);
                return;
            }
            else {
                pause_counter = 0;
                // recursively call the typewriter to print the next character.
                typeWriter(initial_text, index, char + 1);
            }

            // we've reached the end of a typewriter.
            if (char == initial_text.length) {
                // end the timeout session
                clearTimeout(time);
                // check if there is another typewriter after.
                var next_elem = typewriters[index + 1];
                // if we have a new typewriter.
                if (next_elem) {
                    // repeat the process with this new typewriter.
                    typeWriter(next_elem.innerHTML, index + 1, 0);
                }
            }
        }, CHARACTER_DELAY_MS);
    }
}