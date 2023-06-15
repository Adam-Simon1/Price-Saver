import mysql.connector

mydb = mysql.connector.connect(
    host= "***REMOVED***",
    user= "***REMOVED***",
    passwd= "***REMOVED***",
)

my_cursor = mydb.cursor()
my_cursor.execute("CREATE DATABASE price-savvy")
my_cursor.execute("SHOW DATABASES")

for db in my_cursor:
    print(db)
