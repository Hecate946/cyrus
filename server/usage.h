#ifndef _USAGE_H
#define _USAGE_H


extern int get_total_virtual_memory();
extern int get_current_virtual_memory();
extern int get_proc_virtual_memory();
extern int get_total_physical_memory();
extern int get_current_physical_memory();
extern int get_proc_physical_memory();
extern void *cpu_tracker();
extern double get_cpu_usage();
#endif