const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

let deviceList = [];

class Device {
    constructor(id, room, temperature, deviceType) { // Added deviceType
        this.id = id || uuidv4();
        this.room = room;
        this.temperature = temperature;
        this.deviceType = deviceType; // Store the deviceType
    }

    get_id() {
        return this.id;
    }
}

app.use(bodyParser.json());

if (!fs.existsSync('devices.json')) {
    fs.writeFileSync('devices.json', '[]', 'utf8'); // Initialize it with an empty array.
}

fs.readFile('devices.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading devices.json:', err);
        return;
    }
    let deviceData = JSON.parse(data);
    deviceList = deviceData.map(deviceData => {
        let device = new Device(deviceData.id, deviceData.room, deviceData.temperature, deviceData.deviceType); // Adjusted for deviceType
        return device;
    });
});

app.post('/device', (req, res) => {
    if (Array.isArray(req.body)) {
        let newDevices = req.body.map(deviceData => {
            // Check if device with given ID already exists
            if (deviceList.some(device => device.id === deviceData.id)) {
                console.log(`Device ${deviceData.id} already exists. Ignoring.`);
                return `Device ${deviceData.id} already exists`;
            }
            let newDevice = new Device(deviceData.id, deviceData.room, deviceData.temperature, deviceData.deviceType); // Adjusted for deviceType
            deviceList.push(newDevice);
            console.log(`Adding new device ${newDevice.id}`);
            return `Device ${newDevice.deviceType} added`;
        });
        res.send(newDevices.join('\n'));
    } else {
        // Check if device with given ID already exists
        if (deviceList.some(device => device.id === req.body.id)) {
            console.log(`Device ${req.body.id} already exists. Ignoring.`);
            res.status(400).send(`Device ${req.body.id} already exists\n`);
            return;
        }
        let newDevice = new Device(req.id, req.body.room, req.body.temperature, req.body.deviceType); // Adjusted for deviceType
        deviceList.push(newDevice);
        console.log(`Adding new device ${newDevice.id}`);
        res.send(`Device ${newDevice.deviceType} added\n`);
    }
    fs.writeFile('devices.json', JSON.stringify(deviceList, null, 2), (err) => {
        if (err) {
            console.error(`Error writing to file: ${err}`);
        } else {
            console.log(`Device list saved to file`);
        }
    });
});


app.delete('/device/:id', (req, res) => {
    let idToDelete = req.params.id;
    if (!deviceList.find(device => device.id === idToDelete)) {
        console.log(`Device ${idToDelete} not found.`);
        res.status(404).send('Device not found');
        return;
    }
    deviceList = deviceList.filter(device => device.id !== idToDelete);
    console.log(`Deleting device ${idToDelete}`);
    fs.writeFile('devices.json', JSON.stringify(deviceList), (err) => {
        if(err) {
            console.error('An error occurred while writing the updated list to the file:', err);
            res.status(500).send('An error occurred while deleting the device');
            return;
        }
        res.send(`Device deleted\n`);
    });
});

app.get('/device/:id', (req, res) => {
    let deviceId = req.params.id;
    let device = deviceList.find(device => device.id === deviceId);
    if (device) {
        res.send(`Temperature: ${device.temperature}, Room: ${device.room}, Type: ${device.deviceType}`); // Adjusted for deviceType
    } else {
        res.status(404).send('Device not found');
    }
});

app.get('/device/type/:deviceType', (req, res) => {
    const deviceTypeParam = req.params.deviceType; 

    const deviceType = deviceTypeParam.replace('_', ' '); 

    const matchingDevices = deviceList.filter(device => device.deviceType === deviceType);

    if (matchingDevices.length === 0) {
        res.status(404).send('No devices found');
    } else {
        const response = matchingDevices.map(device => `Location: ${device.room}, Temperature: ${device.temperature}, Device: ${device.deviceType}`).join('\n');
        res.send(response);
    }
});


app.get('/device', (req, res) => {
    let sortedDevices = deviceList;

    // Check for the 'sort' query parameter. If its value is 'deviceType', sort by that attribute.
    if (req.query.sort === 'deviceType') {
        sortedDevices = deviceList.slice().sort((a, b) => {
            if (a.deviceType < b.deviceType) return -1;
            if (a.deviceType > b.deviceType) return 1;
            return 0;
        });
    }

    let response = sortedDevices.map(device => `Location: ${device.room}, Temperature: ${device.temperature}, Device Type: ${device.deviceType}`).join('\n'); 
    if (response === '') {
        response = 'No device added yet';
    }
    res.send(response);
});

app.patch('/device/:id', (req, res) => {
    let deviceId = req.params.id;
    let device = deviceList.find(device => device.id === deviceId);
    if (device) {
        if (req.body.temperature) {
            device.temperature = req.body.temperature;
        }
        if (req.body.room) {
            device.room = req.body.room;
        }
        if (req.body.deviceType) { // Added for deviceType
            device.deviceType = req.body.deviceType;
        }
        fs.writeFile('devices.json', JSON.stringify(deviceList), (err) => {
            if(err) {
                console.error('An error occurred while writing the updated list to the file:', err);
                res.status(500).send('An error occurred while updating the device');
                return;
            }
            res.send(`Device ${deviceId} updated\n`);
        });
    } else {
        res.status(404).send('Device not found');
    }
});

app.listen(5001, () => {
    console.log('Server running on port 5001');
});
