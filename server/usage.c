#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/sysinfo.h>
#include <sys/times.h>
// #include <sys/vtimes.h>

#define BYTES_TO_KILOBYTES 0.001

// helper function
int parse_line(char* line){
    // this assumes that a digit will be found and the line ends in " kb".
    int i = strlen(line);
    const char* p = line;
    while (*p <'0' || *p > '9') p++;
    line[i-3] = '\0';
    i = atoi(p);
    return i;
}


int get_total_virtual_memory() {
    struct sysinfo mem_info;
    sysinfo (&mem_info);
    long long total_virtual_mem = mem_info.totalram * BYTES_TO_KILOBYTES;
    total_virtual_mem += mem_info.totalswap * BYTES_TO_KILOBYTES;
    total_virtual_mem *= mem_info.mem_unit;
    return (int)total_virtual_mem;
}

int get_current_virtual_memory() {
    struct sysinfo mem_info;
    sysinfo (&mem_info);
    long long virtual_mem_used = (mem_info.totalram - mem_info.freeram) * BYTES_TO_KILOBYTES;
    virtual_mem_used += (mem_info.totalswap - mem_info.freeswap) * BYTES_TO_KILOBYTES;
    virtual_mem_used *= mem_info.mem_unit;
    return (int)virtual_mem_used;
}

int get_proc_virtual_memory(){
    FILE* file = fopen("/proc/self/status", "r");
    int result = -1;
    char line[128];

    while (fgets(line, 128, file) != NULL){
        if (strncmp(line, "VmSize:", 7) == 0){
            result = parse_line(line);
            break;
        }
    }
    fclose(file);
    return result;
}

int get_total_physical_memory() {
    struct sysinfo mem_info;
    sysinfo (&mem_info);
    long long total_phys_mem = mem_info.totalram * BYTES_TO_KILOBYTES;
    total_phys_mem *= mem_info.mem_unit;
    return (int)total_phys_mem;
}

int get_current_physical_memory() {
    struct sysinfo mem_info;
    sysinfo (&mem_info);
    long long phys_mem_used = (mem_info.totalram - mem_info.freeram) * BYTES_TO_KILOBYTES;
    phys_mem_used *= mem_info.mem_unit;
    return (int)phys_mem_used;
}

int get_proc_physical_memory(){ //note: this value is in kb!
    FILE* file = fopen("/proc/self/status", "r");
    int result = -1;
    char line[128];

    while (fgets(line, 128, file) != NULL){
        if (strncmp(line, "VmRSS:", 6) == 0){
            result = parse_line(line);
            break;
        }
    }
    fclose(file);
    return result;
}


static long long lastTotalUser, lastTotalUserLow, lastTotalSys, lastTotalIdle;

void init_cpu_usage(){
    FILE* file = fopen("/proc/stat", "r");
    fscanf(file, "cpu %lld %lld %lld %lld", &lastTotalUser, &lastTotalUserLow,
        &lastTotalSys, &lastTotalIdle);
    fclose(file);
}

double get_cpu_usage(){
    FILE* file;
    long long totalUser, totalUserLow, totalSys, totalIdle, total;

    file = fopen("/proc/stat", "r");
    fscanf(file, "cpu %lld %lld %lld %lld", &totalUser, &totalUserLow,
        &totalSys, &totalIdle);
    fclose(file);

    printf("lti: %lld\n", lastTotalIdle);
    printf("ti: %lld\n", totalIdle);

    int cores = sysconf(_SC_NPROCESSORS_ONLN);
    return (lastTotalIdle - totalIdle / cores); // num cores.
}


