#include <iostream>
#include <string>
using namespace std;

class Hecate946 {
    public:
        const string NAME = "Cyrus Asasi";
        string DISPLAY_NAME = "Hecate946";
        int AGE = 19;
        string EMAIL = "hecate946@gmail.com";
        const string UNIVERSITY = "UCLA";
        const int GRAD_CLASS = 2026;
        string MAJORS[2] = {"Music Performance", "Computer Science"};
        const string HOMETOWN = "San Diego";
        const string STATUS = "Taken :)";
        int CHESS_ELO = 2360;
        string FAVORITE_BOOK = "100 Years of Solitude (Marquez)";
};

int main() {
    Hecate946 hecate946;
    cout << "Hi! My name is " << hecate946.NAME << endl; 
    return 0;
}
