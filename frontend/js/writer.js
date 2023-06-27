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
var can_run = true;
function typeWriter(initial_text, index, char, fallthrough=true) {
    // fetch the element we're currently working with.
    elem = typewriters[index];
    console.log(can_run);
    if (can_run === false) {
        elem.innerHTML = "";
        elem.style.display = "none";
        clearTimeout(time);
        return;
    }
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
                if (next_elem && fallthrough) {
                    // repeat the process with this new typewriter.
                    typeWriter(next_elem.innerHTML, index + 1, 0);
                }
            }
        }, CHARACTER_DELAY_MS);
    }
}



const JS = `
<span style='color: #A200A2'> class </span>  <span style='color: #EEFF00'> Hecate946</span> {<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> NAME          </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #11575C'> "Cyrus Asasi"                             </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> DISPLAY_NAME  </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #11575C'> "Hecate946"                               </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> AGE           </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #00D54B'> 19                                        </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> EMAIL         </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #11575C'> "hecate946@gmail.com"                     </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> UNIVERSITY    </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #11575C'> "UCLA"                                    </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> GRAD_CLASS    </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #00D54B'> 2026                                      </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> MAJORS        </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> [<span style='color: #11575C'> "Music Performance"<span style='color: white'>,</span> "Computer Science" </span>] ; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> HOMETOWN      </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #11575C'> "San Diego"                               </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> STATUS        </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #11575C'> "Taken :)"                                </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> CHESS_ELO     </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #00D54B'> 2360                                      </span>; }<br>
&emsp; &emsp; <span style='color: #FF0000'>static</span> <span style='color: #A200A2'> get </span> <span style='color: #4CC8F5'> FAVORITE_BOOK </span> <span style='color: #F8F8F0'> () { </span> <span style='color: #A200A2'> return </span> <span style='color: #11575C'> "100 Years of Solitude (Marquez)"         </span>; }<br>
}<br>
<span style='color: #FF008C'>console</span>.<span style='color: #4CC8F5'>log</span>(<span style='color: #11575C'>"Hi! My name is "</span>, <span style='color: #FF008C'>Hecate946</span>.NAME);
`.replace(/\s+/g, " ")

const PY = `
<span style='color: #A200A2'> class </span>  <span style='color: #EEFF00'> Hecate946</span>:<br>
&emsp; &emsp; <span style='color: #FF0000'>NAME              = </span>  <span style='color: #11575C'> "Cyrus Asasi"                             </span><br>
&emsp; &emsp; <span style='color: #FF0000'>DISPLAY_NAME      = </span>  <span style='color: #11575C'> "Hecate946"                               </span><br> 
&emsp; &emsp; <span style='color: #FF0000'>AGE               = </span>  <span style='color: #00D54B'> 19                                        </span><br>   
&emsp; &emsp; <span style='color: #FF0000'>EMAIL             = </span>  <span style='color: #11575C'> "hecate946@gmail.com"                     </span><br>
&emsp; &emsp; <span style='color: #FF0000'>UNIVERSITY        = </span>  <span style='color: #11575C'> "UCLA"                                    </span><br>   
&emsp; &emsp; <span style='color: #FF0000'>GRADUATING_CLASS  = </span>  <span style='color: #00D54B'> 2026                                      </span><br>
&emsp; &emsp; <span style='color: #FF0000'>MAJORS            = </span>  [<span style='color: #11575C'> "Music Performance"<span style='color: white'>,</span> "Computer Science" </span>]<br>
&emsp; &emsp; <span style='color: #FF0000'>HOMETOWN          = </span>  <span style='color: #11575C'> "San Diego"                               </span><br>
&emsp; &emsp; <span style='color: #FF0000'>STATUS            = </span>  <span style='color: #11575C'> "Taken :)"                                </span><br>
&emsp; &emsp; <span style='color: #FF0000'>CHESS_ELO         = </span>  <span style='color: #00D54B'> 2360                                      </span><br>
&emsp; &emsp; <span style='color: #FF0000'>FAVORITE_BOOK     = </span>  <span style='color: #11575C'> "100 Years of Solitude (Marquez)"         </span><br>
<span style='color: #4CC8F5'>print</span>(<span style='color: #11575C'>"Hi! My name is "</span>, <span style='color: #FF008C'>Hecate946</span>.NAME)
`.replace(/\s+/g, " ");

const CPP = `
<span style='color: #A200A2'> #include </span> <span style='color: #11575C'> &lt;iostream&gt;<br></span>
<span style='color: #A200A2'> #include </span> <span style='color: #11575C'> &lt;string&gt;<br></span>
<span style='color: #FF0000'> using </span>  <span style='color: #A200A2'> namespace </span>  std;<br>
<span style='color: #A200A2'> class </span>  <span style='color: #EEFF00'> Hecate946</span> {<br>
    &emsp; &emsp; <span style='color: #ff0000'> public:</span><br>
    &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> NAME              = </span>  <span style='color: #11575C'> "Cyrus Asasi"</span>;<br>
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> DISPLAY_NAME      = </span>  <span style='color: #11575C'> "Hecate946"</span>;<br> 
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> int    </span> AGE               = </span>  <span style='color: #00D54B'> 19</span>;<br>   
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> EMAIL             = </span>  <span style='color: #11575C'> "hecate946@gmail.com"</span>;<br>
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> UNIVERSITY        = </span>  <span style='color: #11575C'> "UCLA"</span>;<br>   
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> int    </span> GRAD_CLASS        = </span>  <span style='color: #00D54B'> 2026</span>;<br>
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> MAJORS[<span style='color: #00D54B'>2</span>]            = </span>  {<span style='color: #11575C'> "Music Performance"<span style='color: white'>,</span> "Computer Science" </span>};<br>
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> HOMETOWN          = </span>  <span style='color: #11575C'> "San Diego"</span>;<br>
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> STATUS            = </span>  <span style='color: #11575C'> "Taken :)"</span>;<br>
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> int    </span> CHESS_ELO         = </span>  <span style='color: #00D54B'> 2360</span>;<br>
 &emsp; &emsp; &emsp; &emsp; <span style='color: #a200a2'> string </span> FAVORITE_BOOK     = </span>  <span style='color: #11575C'> "100 Years of Solitude (Marquez)"</span>;<br>
};<br>
<span style='color: #A200A2'> int </span> <span style='color: #4CC8F5'>main</span>() {<br>
    &emsp; &emsp;<span style='color: #EEFF00'> Hecate946</span> <span style='color: #FF008C'> hecate946</span>;<br>
    &emsp; &emsp; <span style='color: #FF0000'> cout </span> &lt;&lt; <span style='color: #11575C'> "Hi! My name is " </span> &lt;&lt; <span style='color: #FF008C'>hecate946</span>.NAME << <span style='color: #FF0000'> endl</span>;<br>
    &emsp; &emsp; <span style='color: #A200A2'> return </span> <span style='color: #00D54B'>0</span>;<br>
}

`.replace(/ = /g, "<span style='color: #FF0000'>=</span>")

const C = `
<span style='color: #A200A2'> #include </span> <span style='color: #11575C'> &lt;stdio.h&gt;<br></span>
<span style='color: #A200A2'> struct </span> <span style='color: #EEFF00'> Person</span> {<br>
    &emsp; &emsp;<span style='color: #A200A2'> char </span> *NAME, *DISPLAY_NAME, *EMAIL, *HOMETOWN, *UNIVERSITY, *STATUS, *FAVORITE_BOOK;<br>
         &emsp; &emsp;<span style='color: #A200A2'> int </span> AGE, GRAD_CLASS, CHESS_ELO;<br>
         &emsp; &emsp;<span style='color: #A200A2'> char </span> *MAJORS[<span style='color: #00D54B'>2</span>];<br>
};<br>

<span style='color: #A200A2'> int </span> <span style='color: #4CC8F5'>main</span>() {<br>
    &emsp; &emsp; <span style='color: #A200A2'> struct </span>  <span style='color: #EEFF00'> Person</span> <span style='color: #FF008C'>Hecate946</span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.NAME             <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "Cyrus Asasi"</span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.DISPLAY_NAME     <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "Hecate946"</span>;<br> 
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.AGE              <span style='color: #FF0000'> = </span>  <span style='color: #00D54B'> 19</span>;<br>   
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.EMAIL            <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "hecate946@gmail.com"</span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.UNIVERSITY       <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "UCLA"</span>;<br>   
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.GRAD_CLASS <span style='color: #FF0000'> = </span>  <span style='color: #00D54B'> 2026</span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.MAJORS[<span style='color: #00D54B'>0</span>]           <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "Music Performance"                       </span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.MAJORS[<span style='color: #00D54B'>1</span>]           <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "Computer Science"                       </span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.HOMETOWN         <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "San Diego"</span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.STATUS           <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "Taken :)"</span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.CHESS_ELO        <span style='color: #FF0000'> = </span>  <span style='color: #00D54B'> 2360</span>;<br>
    &emsp; &emsp; <span style='color: #FF008C'>Hecate946</span>.FAVORITE_BOOK    <span style='color: #FF0000'> = </span>  <span style='color: #11575C'> "100 Years of Solitude (Marquez)"</span>;<br>
    &emsp; &emsp; <span style='color: #4CC8F5'>printf</span>(<span style='color: #11575C'>"Hi! My name is <span style='color: #FF0000'>%s\\n</span>"</span>, <span style='color: #FF008C'>Hecate946</span>.NAME);<br>
    &emsp; &emsp; <span style='color: #A200A2'> return </span> <span style='color: #00D54B'>0</span>;<br>
}
`.replace(/\*/g, "<span style='color: #FF0000'>*</span>");
const codeBlocks = document.querySelectorAll(".codeblock");
codeBlocks.forEach(element => {
    if (element.classList.contains("js")) {
        element.innerHTML = JS;
    }
    else if (element.classList.contains("py")) {
        element.innerHTML = PY;
    }
    else if (element.classList.contains("c++")) {
        element.innerHTML = CPP;
    }
    else if (element.classList.contains("c")) {
        element.innerHTML = C;
    }

    if (element.classList.contains("default")) {
        element.style.display = "block";
    }

});


function selectTab(tabIndex) {
    // hide all tabs
    document.getElementById("tab1Content").style.display = "none";
    document.getElementById("tab2Content").style.display = "none";
    document.getElementById("tab3Content").style.display = "none";
    document.getElementById("tab4Content").style.display = "none";
    // show the selected
    elem = document.getElementById("tab" + tabIndex + "Content");
    elem.style.display = "block";
 }