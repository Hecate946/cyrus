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
#include "usage.h"

#define WEBSERVER_PORT "8080" // the port to host the webserver.
#define ROOT_HTML_FILE "/index.html" // file to server on '/'.
#define FRONTEND_FILES "../frontend" // path to frontend files.
#define MAX_CACHE_SIZE 1 // the max number of pages to cache.

// global variable for uptime
time_t START_UNIX_TIME;

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
                        "Date: %s\r" // formatted date string
                        "Connection: close\r\n" // close the connection after response
                        "Content-Type: %s\r\n" // type
                        "Content-Length: %d\r\n\r\n"; // length

    // load the formatted response string into the response variable.
    sprintf(response, fmt_string, header, time_str, content_type, content_length);
    // calculate the size of the entire response.
    size_t resp_size = strlen(response) + content_length; // calculate the overall response size
    // only load in the body if content_length permits.
    if (content_length > 0)
    { // load the body into the http request using memcpy.
        memcpy(response + strlen(response), body, content_length);
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


// return stats page json.
/*
total website views
user website views w page breakdown
host OS info
user OS info/IP address.
*/
void api_get_stats(int fd)
{

    double cpu_usage_percent = get_cpu_usage();
    int pid = getpid();
    // get os system info from utsname.h
    struct utsname uts;
    uname(&uts);

    // get the number of cpu cores we have.
    int cores = sysconf(_SC_NPROCESSORS_ONLN);
    // get physical and virtual memory usage stats (usage.c).
    int total_mem = get_total_physical_memory();
    int used_mem = get_current_physical_memory();
    int proc_mem = get_proc_physical_memory();
    int total_vm = get_total_virtual_memory();
    int used_vm = get_current_virtual_memory();
    int proc_vm = get_proc_virtual_memory();
    
    // get current unix time
    time_t unix_time;
    time(&unix_time);
    // get the difference between current time and start time.
    double diff = difftime(unix_time, START_UNIX_TIME);
    // get our uptime string from utils helper function.
    char *uptime = get_uptime_string((int)diff);
    // create json format string.
    char* jsonstr = // "{\"status\": \"ok\", "
                    "{\"Host Computer\": \"%s\", "
                    "\"Host OS\": \"%s\", "
                    "\"Host Hardware\": \"%s\", "
                    "\"Host CPU Cores\": \"%d\", "
                    // "\"os_release\": \"%s\", "
                    // "\"os_version\": \"%s\", "
                    "\"Website PID\": \"%d\", "
                    "\"Website Uptime\": \"%s\", "
                    "\"Total physical memory\": \"%d\", "
                    "\"Physical memory used\": \"%d\", "
                    "\"Physical memory used by website\": \"%d\", "
                    "\"Total virtual memory\": \"%d\", "
                    "\"Virtual memory used\": \"%d\", "
                    "\"Virtual memory used by website\": \"%d\", "
                    "\"CPU usage percent\": \"%f\"}";
    // calculate size to malloc from json string and uptime string.
    // note the formatting in the json string gives a few extra bytes.
    size_t to_malloc = strlen(uts.nodename) + strlen(uts.sysname) + strlen(uts.machine) +
    strlen(uts.release) + strlen(uts.version) + strlen(uptime) + strlen_int(total_mem) +
    strlen_int(used_mem) + strlen_int(proc_mem) + strlen_int(total_vm) + strlen_int(used_vm) +
    strlen_int(proc_vm) + strlen_int(cores) + strlen_int(pid) + strlen(jsonstr) + 16; // for double.
    // dynamically allocate the buffer.
    char *buffer = malloc(to_malloc);
    // store all json data in the buffer.
    snprintf(
        buffer, to_malloc, jsonstr, uts.nodename, uts.sysname, uts.machine, // uts.release, uts.version,
        cores, pid, uptime, total_mem, used_mem, proc_mem, total_vm, used_vm, proc_vm, cpu_usage_percent);
    // send out json response.
    send_response(fd, "HTTP/1.1 200 OK", "application/json", buffer, strlen(buffer));
    // free uptime string allocated in utils.c.
    free(uptime);
    // free the buffer.
    free(buffer);
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
        char *backup_404 = "<html><h1>404 Not Found</h1></html>";
        // server the makeshift 404 html.
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
    // get the file extension from the filename.
    char *ext = strrchr(request_path, '.');
    // if no extension, try adding '.html'
    // this maps /about to /about.html etc...
    if (ext == NULL) {
        // add .html to the end of the request path.
        strcat(request_path, ".html");
    }
    // attempt to load the file from the cache using the request_path.
    struct cache_entry *entry = cache_get(cache, request_path);
    if (entry)
    { // we have the file in the cache, serve it.
        send_response(fd, "HTTP/1.1 200 OK", entry->content_type, entry->content, entry->content_length);
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
    { // file not found!
        resp_404(fd); // return 404 code.
        return; // exit function.
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
    // handle the 'GET' request type.
    if (strcmp(request_type, "GET") == 0)
    {
        // point root path to our root html file.
        if (strcmp(request_path, "/") == 0)
        {   // serve the root file.
            get_file(fd, cache, ROOT_HTML_FILE);
        }
        else if (strcmp(request_path, "/api/get_stats") == 0) {
            api_get_stats(fd);
        } 
        else
        {   // serve a file to the client.
            get_file(fd, cache, request_path);
        }
    }
    // handle the 'POST' request type.
    else if (strcmp(request_type, "POST") == 0)
    {
        find_body(request);
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
    // spawn thread to track CPU usage.
    pthread_t tid;
    pthread_create(&tid, NULL, cpu_tracker, NULL);

    time(&START_UNIX_TIME); // update uptime variable.
    int newfd; // listen on sock_fd, new connection on newfd.
    struct sockaddr_storage their_addr; // connector's address information.

    // create the cache. cache a max of MAX_CACHE_SIZE unique request paths.
    struct cache *cache = cache_create(MAX_CACHE_SIZE, 0);

    // get a listening socket.
    int listenfd = get_listener_socket(WEBSERVER_PORT);
    // bad response from socket.
    if (listenfd < 0)
    {   // log the error and exit.
        fprintf(stderr, "[server] fatal error getting listening socket\n");
        exit(1);
    }

    printf("[server] running on port: %s\n", WEBSERVER_PORT);

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
