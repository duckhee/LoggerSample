#ifndef __MYSQLDB_H__
#define __MYSQLDB_H__


#define DB_HOST ""
#define DB_USER ""
#define DB_PASS ""
#define DB_NAME ""

#define MAX_BUF 1024

typedef struct _ConnectionInfo{
    char Host[MAX_BUF];
    char User[MAX_BUF];
    char Pass[MAX_BUF];
    char Name[MAX_BUF];
} ConnectionInfo;

#endif