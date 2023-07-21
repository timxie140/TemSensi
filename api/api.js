const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

let sensorList = [];

class TempSensor {
    constructor(id, room, temperature) {
        this.id = id;
        this.room = room;
        this.temperature = temperature;
    }
}


app.use(bodyParser.json());

fs.readFile('sensors.json', (err, data) => {
    if (err) {
        console.error('Error reading sensors.json:', err);
    } 
    else {
        let sensorsData = JSON.parse(data);
        sensorList = sensorsData.map(sensorData => {
            let sensor = new TempSensor(sensorData.id, sensorData.room, sensorData.temperature);
            return sensor;
        });
    }
});

app.post('/sensor/temperature', (req, res) => {  
    if (Array.isArray(req.body)) {
        let newSensors = req.body.map(sensorData => {
            let newSensor = new TempSensor(sensorData.id, sensorData.room, sensorData.temperature);
            sensorList.push(newSensor);
            console.log(`Adding new sensor ${newSensor.id}`);
            return `Sensor ${newSensor.id} added`;
        }); 
        res.send(newSensors.join('\n'));
    } 
    else {
        let newSensor = new TempSensor(req.body.id, req.body.room, req.body.temperature);
        sensorList.push(newSensor);
        console.log(`Adding new sensor ${newSensor.id}`);
        res.send(`Sensor ${newSensor.id} added\n`);
    }
    fs.writeFile('sensors.json', JSON.stringify(sensorList, null, 2), (err) => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
        } else {
            console.log(`Sensor list saved to file`);
        }
    });
});

app.delete('/sensor/temperature/:id', (req, res) => {
    let idToDelete = req.params.id;

    if (!sensorList.find(sensor => sensor.id === idToDelete)) {
        console.log(`Sensor ${idToDelete} not found.`);
        res.status(404).send('Sensor not found');
        return;
    }

    sensorList = sensorList.filter(sensor => sensor.id !== idToDelete);
    console.log(`Deleting sensor ${idToDelete}`);
    fs.writeFile('sensors.json', JSON.stringify(sensorList), (err) => {
        if(err) {
            console.error('An error occurred while writing the updated list to the file:', err);
            res.status(500).send('An error occurred while deleting the sensor');
            return;
        }
        res.send(`Sensor ${idToDelete} deleted\n`);
    });
});

app.get('/sensor/temperature/:id', (req, res) => {
    let sensorId = req.params.id;
    let sensor = sensorList.find(sensor => sensor.id === sensorId);
    if (sensor) {
        res.send(`${sensor.temperature}, ${sensor.room}`);
    } 
    else {
        res.status(404).send('Sensor not found');
    }
});

app.get('/sensor/temperature', (req, res) => {
    let response = sensorList.map(sensor => `Sensor: ${sensor.id}, Location: ${sensor.room}, Temperature: ${sensor.temperature}`).join('\n');
    if (response === '') {
        response = 'No sensors added yet';
    }
    res.send(response);
});

app.listen(5001, () => {
    console.log('Server running on port 5001');
});
