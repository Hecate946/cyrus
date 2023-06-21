#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "hashtable.h"
#include "cache.h"

// dynamically allocate the memory for a cache_entry and update its fields with data.
struct cache_entry *alloc_entry(char *path, char *content_type, void *content, int content_length)
{
    // allocate the memory for the whole struct
    struct cache_entry *entry = malloc(sizeof(struct cache_entry));
    // calculate the size we need to copy in.
    size_t size = sizeof(*path) * strlen(path) + 1;
    // allocate the memory and pad with zeros.
    entry->path = calloc(1, size);
    // copy the path into the entry
    entry->path = strncpy(entry->path, path, size);
    // calculate the size we need to copy in.
    size = sizeof(*content_type) * strlen(content_type) + 1;
    // allocate the memory and pad with zeros.
    entry->content_type = calloc(1, size);
    // copy the content_type into the entry
    entry->content_type = strncpy(entry->content_type, content_type, size);
    // update the content_length field.
    entry->content_length = content_length;
    // content length already tells us the size.
    size = content_length;
    // allocate the memory and pad with zeros.
    entry->content = calloc(1, size);
    // copy the content into the entry.
    entry->content = memcpy(entry->content, content, size);
    // return the entry.
    return entry;
}
// dealocate the dynamically-allocated cache_entry.
void free_entry(struct cache_entry *entry)
{ // free the path.
    free(entry->path);
    // free the content_type.
    free(entry->content_type);
    // free the content.
    free(entry->content);
    // free the whole entry.
    free(entry);
}


// Insert a cache entry at the head of the linked list
void dllist_insert_head(struct cache *cache, struct cache_entry *entry)
{
    // if the cache is empty
    if (cache->head == NULL)
    { // point the head and tail to the new node
        cache->head = cache->tail = entry;
        // only one node, next and prev are null.
        entry->prev = entry->next = NULL;
    }
    else // we have preexisting cache entries.
    { // rearrange pointers to make the entry the new head.
        cache->head->prev = entry;
        entry->next = cache->head;
        entry->prev = NULL;
        cache->head = entry;
    }
}

// move a cache entry to the head of the list
void dllist_move_to_head(struct cache *cache, struct cache_entry *entry)
{
    // no work if the entry is already at the head.
    if (entry == cache->head)
    {
        return;
    }
    // we're at the tail.
    if (entry == cache->tail)
    {
        // make the second oldest node the new tail.
        cache->tail = entry->prev;
        cache->tail->next = NULL;
    }
    else
    {
        // we're in the middle of the linked list.
        // rearrange pointers around the node we're going to remove.
        entry->prev->next = entry->next;
        entry->next->prev = entry->prev;
    }
    // make the current head the second newest node.
    entry->next = cache->head;
    cache->head->prev = entry;
    entry->prev = NULL;
    // move the entry to the head of the list.
    cache->head = entry;
}


// removes the tail from the doubly-linked-list and returns it
struct cache_entry *dllist_remove_tail(struct cache *cache)
{
    // store the tail of the list into a cache_entry.
    struct cache_entry *oldtail = cache->tail;
    // update the cache tail to point to the next oldest node.
    cache->tail = oldtail->prev;
    // update the next oldest node to be the oldest node.
    cache->tail->next = NULL;
    // decrement the size of the linked list.
    cache->cur_size--;
    // return the removed tail entry.
    return oldtail;
}

// creates a new cache with a custom max_size and hashsize.
struct cache *cache_create(int max_size, int hashsize)
{
    // dynamically allocated memory for the cache.
    struct cache *c = malloc(sizeof(struct cache));
    c->cur_size = 0; // we just made the cache, so no items.
    c->max_size = max_size; // update the cache with max_size.
    c->index = hashtable_create(hashsize, NULL); // create the hashtable.
    c->head = NULL; // set the head to NULL because we have no entries.
    c->tail = NULL; // set the tail to NULL because we have no entries.
    return c; // return the new cache.
}
// free the cache and purge the doubly-linked-list and hashtable.
void cache_free(struct cache *cache)
{
    // fetch the head of the doubly-linked-list.
    struct cache_entry *cur_entry = cache->head;
    // remove the entry from the hashtable.
    hashtable_destroy(cache->index);
    // until the linked-list is empty
    while (cur_entry) {
        // get the next node.
        struct cache_entry *next_entry = cur_entry->next;
        // dynamically free the memory allocated for the entry.
        free_entry(cur_entry);
        // set the next entry to the current entry.
        cur_entry = next_entry;
    }
    // dynamically free the cache.
    free(cache);
}

// stores an entry in the cache and deletes the least-reentryntly-used element if the cache is full.
void cache_put(struct cache *cache, char *path, char *content_type, void *content, int content_length)
{
    // dynamically allocate a new cache entry based off of file data passed in.
    struct cache_entry *new_entry = alloc_entry(path, content_type, content, content_length);
    // insert the entry into the head of the doubly-linked-list.
    dllist_insert_head(cache, new_entry);
    // insert the entry into the hashtable using the file path as the key.
    hashtable_put(cache->index, path, new_entry);
    // if the cache is full, remove the oldest used entry.
    if (cache->cur_size >= cache->max_size)
    {
        // delete the least-reentryntly-used entry from the hashtable.
        hashtable_delete(cache->index, cache->tail->path);
        // remove from the doubly-linked-list and deallocate the entry
        free_entry(dllist_remove_tail(cache));
    }
    // increment the current cache size.
    cache->cur_size++;
}

// gets an entry from the cache given a file path.
struct cache_entry *cache_get(struct cache *cache, char *path)
{
    struct cache_entry *entry = hashtable_get(cache->index, path);
    // if we found a cached entry
    if (entry)
    { // move the entry to the head of the list
        dllist_move_to_head(cache, entry);
    }
    // return the entry or NULL if no entry was found.
    return entry;
}
