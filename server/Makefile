CC=gcc
CFLAGS=-Wall -pthread -lpthread

OBJS=server.o net.o utils.o cache.o hashtable.o llist.o usage.o

all: webserver

webserver: $(OBJS)
	gcc -o $@ $^

net.o: net.c net.h

server.o: server.c net.h

utils.o: utils.c utils.h

cache.o: cache.c cache.h

hashtable.o: hashtable.c hashtable.h

llist.o: llist.c llist.h

usage.o: usage.c usage.h

clean:
	rm -f $(OBJS)
	rm -f webserver

.PHONY: all, clean, tests