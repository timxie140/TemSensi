const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

let sensorList = [];

class TempSensor {
    constructor(id, room, temperature, deviceType) { // Added deviceType
        this.id = id;
        this.room = room;
        this.temperature = temperature;
        this.deviceType = deviceType; // Store the deviceType
    }
}

app.use(bodyParser.json());

if (!fs.existsSync('sensors.json')) {
    fs.writeFileSync('sensors.json', '[]', 'utf8'); // Initialize it with an empty array.
}

fs.readFile('sensors.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading sensors.json:', err);
        return;
    }
    let sensorsData = JSON.parse(data);
    sensorList = sensorsData.map(sensorData => {
        let sensor = new TempSensor(sensorData.id, sensorData.room, sensorData.temperature, sensorData.deviceType); // Adjusted for deviceType
        return sensor;
    });
});

app.post('/sensor/temperature', (req, res) => {
    if (Array.isArray(req.body)) {
        let newSensors = req.body.map(sensorData => {
            // Check if sensor with given ID already exists
            if (sensorList.some(sensor => sensor.id === sensorData.id)) {
                console.log(`Sensor ${sensorData.id} already exists. Ignoring.`);
                return `Device ${sensorData.id} already exists`;
            }
            let newSensor = new TempSensor(sensorData.id, sensorData.room, sensorData.temperature, sensorData.deviceType); // Adjusted for deviceType
            sensorList.push(newSensor);
            console.log(`Adding new sensor ${newSensor.id}`);
            return `Device ${newSensor.id} added`;
        });
        res.send(newSensors.join('\n'));
    } else {
        // Check if sensor with given ID already exists
        if (sensorList.some(sensor => sensor.id === req.body.id)) {
            console.log(`Sensor ${req.body.id} already exists. Ignoring.`);
            res.status(400).send(`Sensor ${req.body.id} already exists\n`);
            return;
        }
        let newSensor = new TempSensor(req.body.id, req.body.room, req.body.temperature, req.body.deviceType); // Adjusted for deviceType
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
        res.send(`${sensor.temperature}, ${sensor.room}, ${sensor.deviceType}`); // Adjusted for deviceType
    } else {
        res.status(404).send('Sensor not found');
    }
});

app.get('/sensor/temperature', (req, res) => {
    let response = sensorList.map(sensor => `Sensor: ${sensor.id}, Location: ${sensor.room}, Temperature: ${sensor.temperature}, Device Type: ${sensor.deviceType}`).join('\n'); // Adjusted for deviceType
    if (response === '') {
        response = 'No sensors added yet';
    }
    res.send(response);
});

app.listen(5001, () => {
    console.log('Server running on port 5001');
});
