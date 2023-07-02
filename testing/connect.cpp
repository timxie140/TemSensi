#include <iostream>

using namespace std;

extern "C"{
    void my_func() {
        cout << "My name is tim." << endl;
    }
}