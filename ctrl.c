#include <cpprest/http_listener.h>
#include <cpprest/json.h>

using namespace web;
using namespace web::http;
using namespace web::http::experimental::listener;

void handle_get(http_request request)
{
    // Handle GET request here
    json::value response;
    response[U("message")] = json::value::string(U("REST"));
    
    request.reply(status_codes::OK, response);
}

int main()
{
    http_listener listener(L"http://localhost:8080/api"); // Replace with your desired URL

    listener.support(methods::GET, handle_get);

    try
    {
        listener.open().wait();
        std::wcout << L"Listening for requests at: " << listener.uri().to_string() << std::endl;

        // Keep the main thread alive
        while (true);
    }
    catch (const std::exception &e)
    {
        std::wcout << e.what() << std::endl;
    }

    return 0;
}
