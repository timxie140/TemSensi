package main

import (
	"fmt"
	"io/ioutil"
	"github.com/gorilla/mux"
	"net/http"
	"encoding/json"
	"log"
)

type temp_sensor struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Room string `json:"room"`
}

func addTempSensorHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Can't read body", http.StatusBadRequest)
		return
	}
	newSensor := temp_sensor{}
	json.Unmarshal(body, &newSensor)
	fmt.Printf("Adding new sensor %s\n", newSensor.ID)
	fmt.Fprintf(w, "Sensor %s added\n", newSensor.ID)
}

func deleteTempSensorHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Can't read body", http.StatusBadRequest) 
		return
	}
	delSensor := temp_sensor{}
	json.Unmarshal(body, &delSensor)
	fmt.Printf("Deleting sensor %s\n", delSensor.ID)
	fmt.Fprintf(w, "Sensor %s deleted\n", delSensor.ID)
}

func handleRequest() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/sensor/temperature", addTempSensorHandler).Methods("POST")
	router.HandleFunc("/sensor/temperature", deleteTempSensorHandler).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":5001", router))
}

func main() {
	handleRequest()
}