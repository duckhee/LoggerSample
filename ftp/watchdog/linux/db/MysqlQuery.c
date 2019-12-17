#include "mysqlDB.h"

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
void GetType(){

}