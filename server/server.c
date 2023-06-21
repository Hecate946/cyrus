#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <time.h>
#include <sys/file.h>
#include <fcntl.h>
#include "net.h"
#include "utils.h"
#include "cache.h"

#define PORT "8080" // the port to host the webserver
#define FRONTEND_FILES "../frontend" // frontend files

int send_response(int fd, char *header, char *content_type, void *body, int content_length)
{
    const int max_response_size = 262144; // 256k
    char response[max_response_size];
    
    // get local time in string format
    time_t unix_time;
    struct tm *local_time;
    time(&unix_time);
    local_time = localtime(&unix_time);
    char *time_str = asctime(local_time);

    char *fmt_string = "%s\r\n" // header
                        "date: %s\r" // formatted date string
                        "connection: close\r\n" // close the connection after response
                        "content-type: %s\r\n" // type
                        "content-length: %d\r\n\r\n"; // length

    // load the formatted response string into the response variable.
    sprintf(response, fmt_string, header, time_str, content_type, content_length);
    // calculate the size of the entire response.
    size_t resp_size = strlen(response) + content_length; // calculate the overall response size
    // only load in the body if content_length permits.
    if (content_length > 0)
    { // load the body into the http request using memcpy.
        memcpy(response + strlen(response), body, content_length);
    } // cannot use string functions because binary data may contain null bytes.
    // send response
    int rv = send(fd, response, resp_size, 0);
    // bad response
    if (rv < 0)
    { // output the error
        perror("send");
    }
    return rv;
}


// send a 404 response
void resp_404(int fd)
{
    char *path_404 = "/404.html";
    // calculate size to allocate
    size_t to_malloc = strlen(FRONTEND_FILES) + strlen(path_404) + 1;
    // allocate the length of the file path.
    char *file_path = malloc(to_malloc);
    // concat frontend_files and request_path and store result in file_path.
    snprintf(file_path, to_malloc, "%s%s", FRONTEND_FILES, path_404);
    // load the 404.html file
    struct file_data *file_data = file_load(file_path);

    if (file_data == NULL)
    {
        // did not find the 404 file, create makeshift 404 html.
        char *backup_404 = "<html><h1>404 not found</h1></html>";
        // server the makeshift 404 html.
        send_response(fd, "http/1.1 404 not found", "text/html", backup_404, strlen(backup_404));
        return; // exit the function.
    }
    // get the content type for our response using a utils function.
    char *content_type = get_content_type(file_path);
    // server the file with the correct headers.
    send_response(fd, "http/1.1 404 not found", content_type, file_data->data, file_data->size);
    // deallocate the memory allocated by file_load.
    file_free(file_data);
}


// read and return a file from disk or cache
void get_file(int fd, struct cache *cache, char *request_path)
{
    // attempt to load the file from the cache using the request_path.
    struct cache_entry *entry = cache_get(cache, request_path);
    if (entry)
    { // we have the file in the cache, serve it.
        send_response(fd, "http/1.1 200 ok", entry->content_type, entry->content, entry->content_length);
        return; // exit function.
    }

    // calculate size to allocate
    size_t to_malloc = strlen(FRONTEND_FILES) + strlen(request_path) + 1;
    // allocate the length of the file path.
    char *file_path = malloc(to_malloc); // allocate the length of the file path.
    // concat frontend_files and request_path and store result in file_path.
    snprintf(file_path, to_malloc, "%s%s", FRONTEND_FILES, request_path);

    // load file data from path into a struct using file_load.
    struct file_data *file_data = file_load(file_path);
    // if there is no file data.
    if (file_data == NULL)
    { // invalid file provided, return error.
        resp_404(fd); // TODO. return error code 400 instead of 404.
        return; // exit function.
    }

    // load content-type information from file path
    char *content_type = get_content_type(file_path);
    // load the file data into the cache; use request_path as the key.
    cache_put(cache, request_path, content_type, file_data->data, file_data->size);
    // we now have all the file data needed, send the http response.
    send_response(fd, "http/1.1 200 ok", content_type, file_data->data, file_data->size);
    // deallocate the file path buffer.
    free(file_path);
    // deallocate the file data allocated in file_load.
    file_free(file_data);
}

// handle the http request and send the response
void handle_http_request(int fd, struct cache *cache)
{
    const int request_buffer_size = 65536; // 64k
    char request[request_buffer_size];

    // read in the request
    int bytes_recvd = recv(fd, request, request_buffer_size - 1, 0);
    // didn't get anything
    if (bytes_recvd < 0)
    {   // log the error.
        perror("recv");
        // exit the function.
        return;
    }

    // 10 to allow room for request types like connect or options
    char request_type[10];
    // dynamically allocate the maximum possible pathname to ensure no overflow.
    char *request_path = malloc(strlen(request) + 1);
    // update the request type and request path with data from the request.
    sscanf(request, "%s %s", request_type, request_path);
    // handle the 'get' request type.
    if (strcmp(request_type, "GET") == 0)
    {
        // handle all custom paths.
        if (strcmp(request_path, "/get_email") == 0)
        {
            // TODO: send emails?
        }
        else
        {   // server a file to the client.
            get_file(fd, cache, request_path);
        }
    }
    // handle the 'post' request type.
    else if (strcmp(request_type, "POST") == 0)
    {
        // TODO: post requests!
    }
    else
    {
        // TODO: maybe handle put requests?
    }
    // free the dynamically allocated request path.
    free(request_path);
}

// run the webserver
int main(void)
{
    int newfd; // listen on sock_fd, new connection on newfd
    struct sockaddr_storage their_addr; // connector's address information
    char s[INET6_ADDRSTRLEN]; // max address length

    // create the cache. cache a max of 20 unique request paths.
    struct cache *cache = cache_create(20, 0);

    // get a listening socket
    int listenfd = get_listener_socket(PORT);
    // bad response from socket.
    if (listenfd < 0)
    {   // log the error and exit.
        fprintf(stderr, "[server] fatal error getting listening socket\n");
        exit(1);
    }

    printf("[server] running on port: %s\n", PORT);

    // this is the main loop that accepts incoming connections and
    // responds to the request. the main parent process
    // then goes back to waiting for new connections.


    for(;;)
    {
        socklen_t sin_size = sizeof their_addr;

        // parent process will block on the accept() call until someone
        // makes a new connection:
        newfd = accept(listenfd, (struct sockaddr *)&their_addr, &sin_size);
        // error!
        if (newfd == -1)
        {   // log the error.
            perror("accept");
            // continue to the next connection.
            continue;
        }

        // print out a message that we got the connection
        inet_ntop(their_addr.ss_family,
                    get_in_addr((struct sockaddr *)&their_addr),
                    s, sizeof(s));
        printf("[server] connection from: %s\n", s);


        // newfd is a new socket descriptor for the new connection.
        // listenfd is still listening for new connections.
        // handle the http request.
        handle_http_request(newfd, cache);
        // close the connection.
        close(newfd);
    }
    // unreachable code
    return 0;
}
