var text = $('.typewriter').text();

var length = text.length;
var timeOut;
var character = 0;


(function typeWriter() { 
    timeOut = setTimeout(function() {
        $('.typewriter').css("opacity", 1);
        character++;
        var type = text.substring(0, character);
        $('.typewriter').text(type);
        typeWriter();
        
        if (character == length) {
            clearTimeout(timeOut);
        }
        
    }, 7);
}());
