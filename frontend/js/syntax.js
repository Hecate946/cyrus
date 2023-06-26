codeBlock = document.getElementById("codeblock");
codeBlock.style.color = "white";
codeBlock.innerHTML = `
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
`.replace(/\s+/g, " ").replace(/\s+\(/, "("); // .replace(" (", "(");

// w3CodeColor(codeBlock, "js");





function w3CodeColor(elmnt, mode) {
    var elmntObj = (document.getElementById(elmnt) || elmnt);
    var elmntTxt = elmntObj.innerHTML;

    var jscolor = "black";
    var jskeywordcolor = "mediumblue";
    var jsstringcolor = "brown";
    var jsnumbercolor = "red";
    var jspropertycolor = "white";

    elmntObj.style.fontFamily = "Consolas,'Courier New', monospace";
    if (mode === "py") { elmntTxt = htmlMode(elmntTxt); }
    if (mode === "c++") { elmntTxt = cssMode(elmntTxt); }
    if (mode === "c") { elmntTxt = cssMode(elmntTxt); }
    if (mode === "js") { elmntTxt = jsMode(elmntTxt); }
    elmntObj.innerHTML = elmntTxt;

    function jsMode(txt) {
        var rest = txt, done = "", esc = [], i, cc, tt = "", sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, numpos, mypos, dotpos, y;
        for (i = 0; i < rest.length; i++) {
            cc = rest.substr(i, 1);
            if (cc == "\\") {
                esc.push(rest.substr(i, 2));
                cc = "W3JSESCAPE";
                i++;
            }
            tt += cc;
        }
        rest = tt;
        y = 1;
        while (y == 1) {
            sfnuttpos = getPos(rest, "'", "'", jsStringMode);
            dfnuttpos = getPos(rest, '"', '"', jsStringMode);
            numpos = getNumPos(rest, jsNumberMode);
            keywordpos = getKeywordPos("js", rest, jsKeywordMode);
            dotpos = getDotPos(rest, jsPropertyMode);
            if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], keywordpos[0], dotpos[0]) == -1) { break; }
            mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, keywordpos, dotpos);
            if (mypos[0] == -1) { break; }
            if (mypos[0] > -1) {
                done += rest.substring(0, mypos[0]);
                done += mypos[2](rest.substring(mypos[0], mypos[1]));
                rest = rest.substr(mypos[1]);
            }
        }
        rest = done + rest;
        for (i = 0; i < esc.length; i++) {
            rest = rest.replace("W3JSESCAPE", esc[i]);
        }
        return "<span style=color:" + jscolor + ">" + rest + "</span>";
    }
    function jsStringMode(txt) {
        return "<span style=color:" + jsstringcolor + ">" + txt + "</span>";
    }
    function jsKeywordMode(txt) {
        return "<span style=color:" + jskeywordcolor + ">" + txt + "</span>";
    }
    function jsNumberMode(txt) {
        return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";
    }
    function jsPropertyMode(txt) {
        return "<span style=color:" + jspropertycolor + ">" + txt + "</span>";
    }
    function getDotPos(txt, func) {
        var x, i, j, s, e, arr = [".", "<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/", "-", "*", "|", "%"];
        s = txt.indexOf(".");
        if (s > -1) {
            x = txt.substr(s + 1);
            for (j = 0; j < x.length; j++) {
                cc = x[j];
                for (i = 0; i < arr.length; i++) {
                    if (cc.indexOf(arr[i]) > -1) {
                        e = j;
                        return [s + 1, e + s + 1, func];
                    }
                }
            }
        }
        return [-1, -1, func];
    }
    function getMinPos() {
        var i, arr = [];
        for (i = 0; i < arguments.length; i++) {
            if (arguments[i][0] > -1) {
                if (arr.length == 0 || arguments[i][0] < arr[0]) { arr = arguments[i]; }
            }
        }
        if (arr.length == 0) { arr = arguments[i]; }
        return arr;
    }
    function getKeywordPos(typ, txt, func) {
        var words, i, pos, rpos = -1, rpos2 = -1, patt;
        if (typ == "js") {
            words = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete",
                "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import",
                "in", "instanceof", "int", "interface", "let", "long", "NaN", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static",
                "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];
        }
        for (i = 0; i < words.length; i++) {
            pos = txt.indexOf(words[i]);
            if (pos > -1) {
                patt = /\W/g;
                if (txt.substr(pos + words[i].length, 1).match(patt) && txt.substr(pos - 1, 1).match(patt)) {
                    if (pos > -1 && (rpos == -1 || pos < rpos)) {
                        rpos = pos;
                        rpos2 = rpos + words[i].length;
                    }
                }
            }
        }
        return [rpos, rpos2, func];
    }
    function getPos(txt, start, end, func) {
        var s, e;
        s = txt.search(start);
        e = txt.indexOf(end, s + (end.length));
        if (e == -1) { e = txt.length; }
        return [s, e + (end.length), func];
    }
    function getNumPos(txt, func) {
        var arr = ["<br>", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/", "-", "*", "|", "%", "="], i, j, c, startpos = 0, endpos, word;
        for (i = 0; i < txt.length; i++) {
            for (j = 0; j < arr.length; j++) {
                c = txt.substr(i, arr[j].length);
                if (c == arr[j]) {
                    if (c == "-" && (txt.substr(i - 1, 1) == "e" || txt.substr(i - 1, 1) == "E")) {
                        continue;
                    }
                    endpos = i;
                    if (startpos < endpos) {
                        word = txt.substring(startpos, endpos);
                        if (!isNaN(word)) { return [startpos, endpos, func]; }
                    }
                    i += arr[j].length;
                    startpos = i;
                    i -= 1;
                    break;
                }
            }
        }
        return [-1, -1, func];
    }
}
