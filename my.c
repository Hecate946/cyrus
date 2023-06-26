#include <stdio.h>
struct Person {
    char *NAME, *DISPLAY_NAME, *EMAIL, *HOMETOWN,
         *UNIVERSITY, *STATUS, *FAVORITE_BOOK;
    int AGE, GRAD_CLASS, CHESS_ELO;
    char *MAJORS[2];
};

int main() {
    struct Person Hecate946;
    Hecate946.NAME = "Cyrus Asasi";
    Hecate946.DISPLAY_NAME = "Hecate946";
    Hecate946.AGE = 19;
    Hecate946.EMAIL = "hecate946@gmail.com";
    Hecate946.UNIVERSITY = "UCLA";
    Hecate946.GRAD_CLASS = 2026;
    Hecate946.MAJORS[0] = "Music Performance";
    Hecate946.MAJORS[1] = "Computer Science";
    Hecate946.HOMETOWN = "San Diego";
    Hecate946.STATUS = "Taken :)";
    Hecate946.CHESS_ELO = 2360;
    Hecate946.FAVORITE_BOOK = "100 Years of Solitude (Marquez)";
    printf("Hi! My name is %s\n", Hecate946.NAME);
    return 0;
}

// class Hecate946:
//     NAME = "Cyrus Asasi"
//     DISPLAY_NAME = "Hecate946"
//     AGE = 19
//     EMAIL = "hecate946@gmail.com"
//     UNIVERSITY = "UCLA"
//     GRADUATING_CLASS = 2026
//     MAJORS = ["Music Performance", "Computer Science"]
//     HOMETOWN = "San Diego"
//     STATUS = "Taken :)"
//     CHESS_ELO = 2360
//     FAVORITE_BOOK = "100 Years Of Solitude (Marquez)"

// print(f"Hi! My name is {Hecate946.NAME}")