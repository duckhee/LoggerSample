#include "mysqlDB.h"


/** Error Handler */
int ErrorCatch(MYSQL *conn){
    fprintf(stderr, "%s\r\n", mysql_error(conn));
    mysql_close(conn);
    return -1;
}

/** Get mysql client version */
void Version();

/** Get Device Type */
void GetType();

/** Get mysql client version */
void Version()
{
    printf("mysql client version : %s\r\n", mysql_get_client_info());
    
}



/** Select Device Mysql Data */
void GetType(ConnectionInfo ConnInfo){
    /** Make Mysql Connection */
    MYSQL *connection = mysql_init(NULL);
    /** Mysql Result Value Struct */
    MYSQL_RES *result;
    /** Get Result Filed Num */
    int FiledNum = 0;
    /** Get Filed Value */
    MYSQl_ROW row;
    /** Query */
    char Query[] = "";
    if(connection == NULL){
        ErrorCatch(connection);
    }
    if(mysql_real_connection(connection, ConnInfo.Host, ConnInfo.User, ConnInfo.Pass, 3306, NULL, 0) == NULL){
        ErrorCatch(connection);
    }
    if(mysql_query(connection, Query)){
        ErrorCatch(connection);
    }
    res = mysql_store_result(connection);
    if(res == NULL){
        ErrorCatch(connection);
    }
    FiledNum = mysql_num_fields(res);
    
    /** get Data */
    while(row = mysql_fetch_row(res)){
        for(int i = 0; i < FiledNum; i++){
            /** GET Filed Value */
        }
    }

    mysql_free_result(res);
    mysql_close(con);
}

