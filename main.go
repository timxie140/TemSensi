package main

import (
	"fmt"
	"io/ioutil"
	"github.com/gorilla/mux"
	
	"net/http"
	"encoding/json"
	"log"
)

var sensorList = []temp_sensor{}

type temp_sensor struct {
	ID string `json:"id"`
	Room string `json:"room"`
	Temperature int `json:"temperature"`
}

func addTempSensorHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Can't read body", http.StatusBadRequest)
		return
	}
	newSensor := temp_sensor{"A", "", 34}
	sensorList = append(sensorList, newSensor)
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
	delSensor := temp_sensor{"B", "", 22}

	json.Unmarshal(body, &delSensor)
	fmt.Printf("Deleting sensor %s\n", delSensor.ID)
	fmt.Fprintf(w, "Sensor %s deleted\n", delSensor.ID)
}

func getTemperatureHandler (w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sensorID := vars["id"]
	for _, sensor := range sensorList {
		if sensor.ID == sensorID {
			fmt.Fprint(w, sensor.Temperature)
			return
		}
	}
}

func handleRequest() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/sensor/temperature", addTempSensorHandler).Methods("POST")
	router.HandleFunc("/sensor/temperature", deleteTempSensorHandler).Methods("DELETE")
	router.HandleFunc("/sensor/temperature/{id}", getTemperatureHandler).Methods("GET")

	log.Fatal(http.ListenAndServe(":5001", router))
}

func main() {
	handleRequest()
}