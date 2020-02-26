CC = gcc

SRCS = main.c ./Src/watchdog.c

INC_DIR = Inc/

TARGET = watchDog

BUILDDIR = buildDir

COBJS = $(addprefix $(BUILDDIR)/, $(SRCS:.c=.o))

INC = -I$(INC_DIR)


all: clean createdirs build

createdirs:
	$(shell mkdir ${BUILDDIR})

build: $(COBJS)
	$(CC) -o $(BUILDDIR)/$(TARGET) $^

$(COBJS):$(BUILDDIR)/%.o : %.c
	$(CC) -c $(INC) $< -o $@


clean:
	rm -rf $(BUILDDIR)