CC = gcc

SRC = main.c

TARGET = test

BUILDDIR = buildDir

COBJS = $(addprefix ${BUILDDIR}/, $(SRC:.c=.o))

CFLAGS = `pkg-config --cflags --libs mysql` -std=c99

all: clean createdirs build

createdirs:
	$(shell mkdir ${BUILDDIR})

build:$(COBJS)
	$(CC) -o $(BUILDDIR)/$(TARGET) $^ $(CFLAGS)

$(COBJS):$(BUILDDIR)/%.o : %.c
	$(CC) $(CFLAGS) -o $@ -c $<


clean:
	rm -rf $(BUILDDIR)