#ifndef _webcache_h_
#define _webcache_h_

// individual hash table entry
struct cache_entry {
    struct cache_entry *prev, *next; // doubly-linked list
    char *path;   // endpoint path--key to the cache
    char *content_type;
    void *content;
    int content_length;
};
// a cache
struct cache {
    struct hashtable *index;
    struct cache_entry *head, *tail; // doubly-linked list
    int max_size; // maxiumum number of entries
    int cur_size; // current number of entries
};

extern struct cache_entry *alloc_entry(char *path, char *content_type, void *content, int content_length);
extern void free_entry(struct cache_entry *entry);
extern struct cache *cache_create(int max_size, int hashsize);
extern void cache_free(struct cache *cache);
extern void cache_put(struct cache *cache, char *path, char *content_type, void *content, int content_length);
extern struct cache_entry *cache_get(struct cache *cache, char *path);

#endif