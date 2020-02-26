#ifndef __WATCHDOG_H__
#define __WATCHDOG_H__

#include <stdio.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <dirent.h>


#ifdef WATCH_LOCAL
#define WATCH_DEF extern 
#else
#define WATCH_DEF
#endif

WATCH_DEF void Init();


#endif
