#include <mysql.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>


#define DB_HOST "127.0.0.1"
#define DB_USER "root"
#define DB_PASS "won1228A!"
#define DB_NAME "cloud_database_development"



int main(){
    MYSQL *con = mysql_init(NULL);
    MYSQL_RES *res;
    int num_fields = 0;
    printf("Mysql Version : %s\r\n", mysql_get_client_info());
    if(con == NULL){
      printf("Connection Failed \r\n");
      return -1;
    }
    if(mysql_real_connect(con, DB_HOST, DB_USER, DB_PASS, DB_NAME, 3306, NULL, 0) == NULL){
      printf("Real Connection Failed \r\n");
      return -1;
    }
    if(mysql_query(con, "SELECT * FROM users")){
      printf("Get Data Error\r\n");
      return -1;
    }
    res = mysql_store_result(con);
    if(res == NULL){
      printf("get store data Error\r\n");
      return -1;
    }
    num_fields = mysql_num_fields(res);
    MYSQL_ROW row;
    while(row = mysql_fetch_row(res)){
      for(int i = 0; i < num_fields; i++){
        printf("Number : %d\t %s \t", i, row[i]?row[i]:"NULL");
      }
      printf("\r\n");
    }
    printf("get Data : \r\n");
    mysql_free_result(res);
    mysql_close(con);
    return -1;
}