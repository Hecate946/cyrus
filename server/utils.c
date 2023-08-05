#include <ctype.h>
#include <fcntl.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/stat.h>
#include "utils.h"

#define DEFAULT_CONTENT_TYPE "application/octet-stream"

// loads a file into memory and returns a pointer to the data.
struct file_data *file_load(char *filename)
{
    // define variables.
    char *buffer, *p;
    struct stat buf;
    int bytes_read, bytes_remaining, total_bytes = 0;

    // get the file size
    if (stat(filename, &buf) == -1)
    {
        return NULL;
    }

    // open the file for reading.
    FILE *fp = fopen(filename, "rb");
    // invalid file.
    if (fp == NULL)
    {
        // exit function.
        return NULL;
    }

    // calculate the size to allocate.
    bytes_remaining = buf.st_size;
    // dynamically allocate the bytes.
    p = buffer = malloc(bytes_remaining);
    // no more memory :(
    if (buffer == NULL)
    {
        // exit function.
        return NULL;
    }

    // read in the entire file
    while (bytes_read = fread(p, 1, bytes_remaining, fp), bytes_read != 0 && bytes_remaining > 0)
    {
        // error!
        if (bytes_read == -1)
        {
            // free the memory.
            free(buffer);
            // exit the function.
            return NULL;
        }
        // we successfully read n bytes.
        // update the variables and move on to the next chunk.
        bytes_remaining -= bytes_read;
        p += bytes_read;
        total_bytes += bytes_read;
    }

    // allocate the file data struct
    struct file_data *filedata = malloc(sizeof *filedata);
    // no more memory :(
    if (filedata == NULL)
    {
        free(buffer);
        return NULL;
    }
    // update the struct's fields.
    filedata->data = buffer;
    filedata->size = total_bytes;
    // return the struct.
    return filedata;
}

// frees memory allocated by file_load().
void file_free(struct file_data *filedata)
{
    // free the data.
    free(filedata->data);
    // free the whole struct.
    free(filedata);
}

// returns the content-type (mime type) given a filename.
char *get_content_type(char *filename)
{
    // get the file extension from the filename.
    char *ext = strrchr(filename, '.');

    // we don't know what the ext is
    if (ext == NULL)
    { // return the default type.
        return DEFAULT_CONTENT_TYPE;
    }

    // move the pointer ahead by one to remove the '.'
    ext++;

    // make the string lowercase.
    for (int i = 0; ext[i]; i++)
    {
        ext[i] = tolower(ext[i]);
    }
    // return the correct content type based on the file extension.
    if (strcmp(ext, "html") == 0 || strcmp(ext, "htm") == 0)
    {
        return "text/html";
    }
    if (strcmp(ext, "jpeg") == 0 || strcmp(ext, "jpg") == 0)
    {
        return "image/jpg";
    }
    if (strcmp(ext, "css") == 0)
    {
        return "text/css";
    }
    if (strcmp(ext, "js") == 0)
    {
        return "application/javascript";
    }
    if (strcmp(ext, "json") == 0)
    {
        return "application/json";
    }
    if (strcmp(ext, "txt") == 0)
    {
        return "text/plain";
    }
    if (strcmp(ext, "gif") == 0)
    {
        return "image/gif";
    }
    if (strcmp(ext, "png") == 0)
    {
        return "image/png";
    }
    // return the default type if the extension was not found.
    return DEFAULT_CONTENT_TYPE;
}

// returns the body of a post request given a valid post form.
char *find_body(char *request)
{
    // iterate through the whole request.
    // ensure header + 4 exists so we return invalid accesses.
    while (*request++)
    {
        // we know the body starts after '\r\n' repeats twice.
        if (strncmp(request, "\r\n\r\n", 4) == 0)
        {
            // return just past the end of the \r\n\r\n.
            return request + 4;
        }
    }
    return NULL;
    // TODO: handle invalid post request.
}

// converts second into days, hours, minutes and seconds
char *get_uptime_string(int n)
{
    // do some math with remainders for conversion.
    int days = n / (24 * 3600);
    n = n % (24 * 3600);
    int hours = n / 3600;

    n %= 3600;
    int minutes = n / 60;

    n %= 60;
    int seconds = n;

    // define unpluralized strings.
    char daystring[5] = "day";
    char hourstring[6] = "hour";
    char minutestring[8] = "minute";
    char secondstring[8] = "second";
    // pluralize the strings.
    if (days != 1)
    {
        strcat(daystring, "s");
    }
    if (hours != 1)
    {
        strcat(hourstring, "s");
    }
    if (minutes != 1)
    {
        strcat(minutestring, "s");
    }
    if (seconds != 1)
    {
        strcat(secondstring, "s");
    }
    // define format string.
    char *string = "%d %s, %d %s, %d %s, %d %s";
    // calculate size to malloc.
   
    size_t nbytes = 1 + snprintf(NULL, 0, string, days, daystring, hours, hourstring, minutes, minutestring, seconds, secondstring);
    char *result = malloc(nbytes);
    snprintf(result, nbytes, string, days, daystring, hours, hourstring, minutes, minutestring, seconds, secondstring);
    // return the result.
    return result;
}