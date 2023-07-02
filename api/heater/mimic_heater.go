package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func setTemperatureHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Can't read body", http.StatusBadRequest)
		return
	}
	desiredTemperature := string(body)

	fmt.Printf("Setting temperature to %s\n", desiredTemperature)
	fmt.Fprintf(w, "Temperature set to %s\n", desiredTemperature)
}

func main() {
	http.HandleFunc("/heater/temperature", setTemperatureHandler)

	log.Fatal(http.ListenAndServe(":5002", nil))
}
