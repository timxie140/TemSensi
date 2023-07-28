#include <cpprest/http_listener.h>
#include <cpprest/json.h>
#include <fstream>
#include <iostream>

using namespace web;
using namespace web::http;
using namespace web::http::experimental::listener;

class TempSensor {
public:
    std::string id;
    std::string room;
    int temperature;

    TempSensor(std::string id, std::string room, int temperature)
        : id(std::move(id)), room(std::move(room)), temperature(temperature) {}
};

std::vector<TempSensor> sensorList;

void handle_get(http_request message) {
    utility::string_t relative_uri = message.relative_uri().to_string();
    std::vector<utility::string_t> components;
    utility::string_t delimiter = U("/");
    size_t pos = 0;
    std::string token;
    while ((pos = relative_uri.find(delimiter)) != std::string::npos) {
        token = relative_uri.substr(0, pos);
        components.push_back(token);
        relative_uri.erase(0, pos + delimiter.length());
    }

    for (const auto& component : components) {
        std::cout << component << std::endl;
    }

    // Check if URL is in correct format.
    if (components.size() != 4 || components[1] != U("sensor") || components[2] != U("temperature")) {
        message.reply(status_codes::BadRequest);
        return;
    }

    // Extract sensor ID.
    utility::string_t sensor_id = components[3];

    // Find sensor in sensor list.
    auto sensor_it = std::find_if(sensorList.begin(), sensorList.end(),
        [&sensor_id](const TempSensor& sensor) {
            return sensor.id == sensor_id;
        });

    // If sensor is found, send temperature and room as response.
    if (sensor_it != sensorList.end()) {
        json::value jsonValue;
        jsonValue[U("temperature")] = json::value::number(sensor_it->temperature);
        jsonValue[U("room")] = json::value::string(sensor_it->room);
        message.reply(status_codes::OK, jsonValue);
    }
    // If sensor is not found, send error message.
    else {
        message.reply(status_codes::NotFound, U("Sensor not found"));
    }
}


void handle_post(http_request message) {
    auto j = message.extract_json().get();

    utility::string_t id = j[U("id")].as_string();
    utility::string_t room = j[U("room")].as_string();
    int temperature = j[U("temperature")].as_integer();

    TempSensor sensor(id, room, temperature);
    sensorList.push_back(sensor);
    
    std::vector<json::value> sensorList_json;
    for (const auto& sensor : sensorList) {
        json::value device;
        device[U("id")] = json::value::string(sensor.id);
        device[U("room")] = json::value::string(sensor.room);
        device[U("temperature")] = json::value::number(sensor.temperature);
        sensorList_json.push_back(device);
    }
    json::value jsonValue = json::value::array(sensorList_json);

    std::ofstream o("sensors.json");
    o << jsonValue.serialize() << std::endl;

    utility::string_t reply_message = U("Temperature: " + std::to_string(sensor.temperature) + ", Room: " + sensor.room);
    message.reply(status_codes::OK, reply_message);
}

int main() {
    http_listener listener("http://172.27.165.245:5001");

    listener.support(methods::GET, handle_get);
    listener.support(methods::POST, handle_post);

    try {
        listener
            .open()
            .then([&listener]() { std::cout << "Starting to listen at: " << listener.uri().to_string() << std::endl; })
            .wait();

        while (true);
    }
    catch (std::exception const& e) {
        std::cout << e.what() << std::endl;
    }

    return 0;
}
