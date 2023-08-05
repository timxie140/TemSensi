#include <iostream>
#include <string>
#include <curl/curl.h>

size_t write_callback(void* contents, size_t size, size_t nmemb, std::string* response) {
    size_t total_size = size * nmemb;
    response->append((char*)contents, total_size);
    return total_size;
}

int main() {
    // Initialize libcurl
    curl_global_init(CURL_GLOBAL_ALL);
    CURL* curl = curl_easy_init();

    if (!curl) {
        std::cerr << "Error initializing libcurl." << std::endl;
        return 1;
    }

    // Base URL for the API
    std::string base_url = "http://172.27.165.245:5001/sensor/temperature";

    // Test case 1: Get all sensors' temperature and room
    {
        std::string response;
        curl_easy_setopt(curl, CURLOPT_URL, base_url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);

        if (res == CURLE_OK) {
            std::cout << "Test case 1 (Get all sensors' temperature and room):" << std::endl;
            std::cout << response << std::endl;
        } else {
            std::cerr << "Test case 1 failed: " << curl_easy_strerror(res) << std::endl;
        }
    }

    // Test case 2: Get a specific sensor's temperature and room
    {
        std::string response;
        std::string sensor_id = "sensor1";
        std::string url = base_url + "/" + sensor_id;

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);

        if (res == CURLE_OK) {
            std::cout << "Test case 2 (Get specific sensor's temperature and room):" << std::endl;
            std::cout << response << std::endl;
        } else {
            std::cerr << "Test case 2 failed: " << curl_easy_strerror(res) << std::endl;
        }
    }

    // Test case 3: Add a new sensor
    {
        std::string response;
        std::string post_data = "{\"id\": \"sensor3\", \"room\": \"kitchen\", \"temperature\": 30}";
        curl_easy_setopt(curl, CURLOPT_URL, base_url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_data.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);

        if (res == CURLE_OK) {
            std::cout << "Test case 3 (Add new sensor):" << std::endl;
            std::cout << response << std::endl;
        } else {
            std::cerr << "Test case 3 failed: " << curl_easy_strerror(res) << std::endl;
        }
    }

    // Test case 4: Delete a sensor
    {
        std::string response;
        std::string sensor_id = "sensor2";
        std::string url = base_url + "/" + sensor_id;

        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "DELETE");
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);

        if (res == CURLE_OK) {
            std::cout << "Test case 4 (Delete a sensor):" << std::endl;
            std::cout << response << std::endl;
        } else {
            std::cerr << "Test case 4 failed: " << curl_easy_strerror(res) << std::endl;
        }
    }

    // Test case 5: Attempt to get a deleted sensor
    {
        std::string response;
        std::string sensor_id = "sensor2";
        std::string url = base_url + "/" + sensor_id;

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);

        if (res == CURLE_OK) {
            std::cout << "Test case 5 (Get a deleted sensor):" << std::endl;
            std::cout << response << std::endl;
        } else {
            std::cerr << "Test case 5 failed: " << curl_easy_strerror(res) << std::endl;
        }
    }

    // Cleanup and close libcurl
    curl_easy_cleanup(curl);
    curl_global_cleanup();

    return 0;
}
