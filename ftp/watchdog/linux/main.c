#include <mysql/mysql.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>


int main(){
    printf("Mysql Version : %s\r\n", mysql_get_client_info());
    return -1;
}