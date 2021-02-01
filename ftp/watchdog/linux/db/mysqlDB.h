#ifndef __MYSQLDB_H__
#define __MYSQLDB_H__

#include <mysql/mysql.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define DB_HOST "127.0.0.1"
#define DB_USER "root"
#define DB_PASS "won1228A!"
#define DB_NAME "cloud_database_development"

#define MAX_BUF 1024

typedef struct _ConnectionInfo{
    char Host[MAX_BUF];
    char User[MAX_BUF];
    char Pass[MAX_BUF];
    char Name[MAX_BUF];
} ConnectionInfo;

/** Get mysql client version */
void Version();

/** Create Connection */


/** Get Device Type */
void GetType();


#endif