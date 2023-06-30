package testing

/*
#include <stdlib.h>
#cgo CXXFLAGS: -std=c++11
#cgo LDFLAGS: -lstdc++
extern void my_func();
*/
import "C"

func testing () {
	C.my_func()
}
