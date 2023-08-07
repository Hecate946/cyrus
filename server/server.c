#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/utsname.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <time.h>
#include <sys/file.h>
#include <fcntl.h>
#include <pthread.h>

#include "net.h"
#include "utils.h"
#include "cache.h"

#define WEBSERVER_PORT "80"          // the port to host the webserver.
#define LOCALHOST_PORT "8080"        // port to host webserver if WEBSERVER_PORT is in use
#define ROOT_HTML_FILE "/index.html" // file to server on '/'.
#define FRONTEND_FILES "../frontend" // path to frontend files.
#define MAX_CACHE_SIZE 30            // the max number of pages to cache.

// global variable for uptime
time_t START_UNIX_TIME;

int send_response(int fd, char *header, char *content_type, void *body, int content_length)
{
    // const int max_response_size = 262144; // 256k
    // char response[max_response_size];

    // get local time in string format
    time_t unix_time;
    struct tm *local_time;
    time(&unix_time);
    local_time = localtime(&unix_time);
    char *time_str = asctime(local_time);
    char *fmt_string = "%s\r\n"                      // header
                       "Date: %s\r"                  // formatted date string
                       "Connection: close\r\n"       // close the connection after response
                       "Content-Type: %s\r\n"        // type
                       "Content-Length: %d\r\n\r\n"; // length

    // calculate the size we need to malloc
    size_t nbytes = snprintf(NULL, 0, fmt_string, header, time_str, content_type, content_length);
    size_t resp_size = nbytes + content_length;

    char *response = malloc(resp_size);
    // populate the format string.
    snprintf(response, nbytes + 1, fmt_string, header, time_str, content_type, content_length);

    // only load in the body if content_length permits.
    if (content_length > 0)
    { // load the body into the http request using memcpy.
        memcpy(response + nbytes, body, content_length);
    } // cannot use string functions because binary data may contain null bytes.

    // send response.
    int rv = send(fd, response, resp_size, 0);
    // bad response.
    if (rv < 0)
    { // output the error.
        perror("send");
    }
    return rv;
}

// send a 404 response
void resp_404(int fd)
{
    char *path_404 = "/404.html";
    // calculate size to allocate
    size_t nbytes = snprintf(NULL, 0, "%s%s", FRONTEND_FILES, path_404) + 1;
    // allocate the length of the file path.
    char *file_path = malloc(nbytes);
    // concat frontend_files and request_path and store result in file_path.
    snprintf(file_path, nbytes, "%s%s", FRONTEND_FILES, path_404);
    // load the 404.html file
    struct file_data *file_data = file_load(file_path);

    if (file_data == NULL)
    {
        // did not find the 404 file, create makeshift 404 html.
        char *backup_404 = "<html><h1>404 Not Found</h1></html>";
        // serve the makeshift 404 html.
        send_response(fd, "HTTP/1.1 404 Not Found", "text/html", backup_404, strlen(backup_404));
        return; // exit the function.
    }
    // get the content type for our response using a utils function.
    char *content_type = get_content_type(file_path);
    // server the file with the correct headers.
    send_response(fd, "HTTP/1.1 404 Not Found", content_type, file_data->data, file_data->size);
    // deallocate the memory allocated by file_load.
    file_free(file_data);
}

// read and return a file from disk or cache
void get_file(int fd, struct cache *cache, char *request_path)
{
    // redirect requests to /favicon.ico to the actual file path
    if (strcmp(request_path, "/favicon.ico") == 0)
    {
        return get_file(fd, cache, "/assets/icons/favicon.ico");
    }

    struct cache_entry *entry = cache_get(cache, request_path);
    if (entry)
    { // we have the file in the cache, serve it.
        send_response(fd, "HTTP/1.1 200 OK", entry->content_type, entry->content, entry->content_length);
        return; // exit function.
    }

    // calculate size to allocate
    size_t nbytes = snprintf(NULL, 0, "%s%s", FRONTEND_FILES, request_path) + 1;
    // allocate the length of the file path.
    char *file_path = malloc(nbytes);
    // concat frontend_files and request_path and store result in file_path.
    snprintf(file_path, nbytes, "%s%s", FRONTEND_FILES, request_path);

    // load file data from path into a struct using file_load.
    struct file_data *file_data = file_load(file_path);
    // if there is no file data.
    if (file_data == NULL)
    {                 // file not found!
        resp_404(fd); // return 404 code.
        return;       // exit function.
    }

    // load content-type information from file path
    char *content_type = get_content_type(file_path);
    // load the file data into the cache; use request_path as the key.
    cache_put(cache, request_path, content_type, file_data->data, file_data->size);
    // we now have all the file data needed, send the http response.
    send_response(fd, "HTTP/1.1 200 OK", content_type, file_data->data, file_data->size);
    // deallocate the file path buffer.
    free(file_path);
    // deallocate the file data allocated in file_load.
    file_free(file_data);
}

// handle the http request and send the response
void handle_http_request(int fd, struct cache *cache)
{
    const int request_buffer_size = 65536; // 64K
    char request[request_buffer_size];

    char *path, *verb;
    const char GET[] = "GET";
    const char ROOT[] = "/";

    // Read request
    int bytes_recvd = recv(fd, request, request_buffer_size - 1, 0);

    if (bytes_recvd < 0)
    {
        perror("recv");
        return;
    }

    // Read the first two components of the first line of the request
    verb = strtok(request, " ");
    path = strtok(NULL, " ");

    // If GET, handle the get endpoints
    if (strcmp(verb, GET) == 0)
    {
        if (strcmp(path, ROOT) == 0)
        {
            get_file(fd, cache, ROOT_HTML_FILE);
        }
        else
        {
            get_file(fd, cache, path);
        }
    }
}

// run the webserver
int main(void)
{
    time(&START_UNIX_TIME);             // update uptime variable.
    int newfd;                          // listen on sock_fd, new connection on newfd.
    struct sockaddr_storage their_addr; // connector's address information.

    // create the cache. cache a max of MAX_CACHE_SIZE unique request paths.
    struct cache *cache = cache_create(MAX_CACHE_SIZE, 0);

    // get a listening socket.
    int listenfd = get_listener_socket(WEBSERVER_PORT);
    // bad response from socket.
    if (listenfd < 0)
    {
        listenfd = get_listener_socket(LOCALHOST_PORT);
        if (listenfd < 0)
        {
            // log the error and exit.
            fprintf(stderr, "[server] fatal error getting listening socket\n");
            exit(1);
        }
        else
        {
            printf("[server] running on port: %s\n", LOCALHOST_PORT);
        }
    }
    else
    {
        printf("[server] running on port: %s\n", WEBSERVER_PORT);
    }

    // this is the main loop that accepts incoming connections and
    // responds to the request. the main parent process
    // then goes back to waiting for new connections.

    for (;;)
    {
        socklen_t sin_size = sizeof their_addr;

        // parent process will block on the accept() call until someone
        // makes a new connection:
        newfd = accept(listenfd, (struct sockaddr *)&their_addr, &sin_size);
        // error!
        if (newfd == -1)
        { // log the error.
            perror("accept");
            // continue to the next connection.
            continue;
        }

        // newfd is a new socket descriptor for the new connection.
        // listenfd is still listening for new connections.
        // handle the http request.
        handle_http_request(newfd, cache);
        // close the connection.
        close(newfd);
    }
    // unreachable code.
    return 0;
}
