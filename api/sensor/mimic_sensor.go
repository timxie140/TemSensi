package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
)

func temperatureHandler(w http.ResponseWriter, r *http.Request) {
	temperature := 15 + rand.Intn(16)
	fmt.Fprintf(w, "%d\n", temperature)
}

func main() {
	http.HandleFunc("/sensor/temperature", temperatureHandler)

	log.Fatal(http.ListenAndServe(":5001", nil))
}
