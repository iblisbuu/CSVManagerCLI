

# Live API Creator CSV Manager command line uitility
A Node.js command-line tool to access CA Live API Creator REST API and Logic services. 
Refer to online documentation of creating and using Live API Creator [REST API](http://ca-doc.espressologic.com/docs/live-api) 


## Installation

1. Make sure [node.js](http://nodejs.org) is installed
2. Install using `npm` by running the following:
```sh
$ npm install -g laccsvmanager-cli
```
3. Install mysql (csvparser.sql) to your database
4. Install the project CSVManager.json

Note: on Unix and Mac, you may need to run this with sudo because of file permissions:

```sh
$ sudo npm install -g laccsvmanager-cli
```

*Windows*: Please note that, on Windows, `npm install` will create an executable 
called `laccsv` in your
`<node_modules>/.bin` directory. If this directory is not in your `PATH`, you will probably
want to fix that, otherwise you'll have to specify the full path to the executable.


## Features

* Log in once per server, stay "logged in" for the lifetime of the API key

## Command Line Service
```sh
$ node csvlac.js --help

  Usage: csvlac [options] [command]


  Commands:

    login [options] [url]                                            Login to an API server
    logout [options] [url]                                           Logout from the current server, or a specific server
    use <alias>                                                      Use the specified server by default
    status                                                           Show the current server, and any defined server aliases
    project [options] <list|create|update|delete|use|import|export>  Administer projects. Actions are: list, create, update, delete, use, export
    csvmanage [options] <list|create|delete|addfile|update>          Create new REST API Endpoints from CSV file(s) - assumes existing csvparser JSON project installed

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -V, --version  output the version number

```

## Logon to an API Server
```sh
$ node csvlac.js login -u username -p mypassword  http://localhost:8080/rest/default/csvparser/v1 -a parser
Logging in...
This server licensed to: Live API Creator
Login successful, API key will expire on: 2015-11-18T15:03:37.342Z
```


## See which API server (if any) you are logged into
```sh
$ node csvlac.js status

Defined aliases:
┌────────┬───────────────────────────────────────────────────┬───────┐
│ Alias  │ Server                                            │ User  │
├────────┼───────────────────────────────────────────────────┼───────┤
│ target │ http://localhost:8080/APIServer/rest/abl/admin/v2 │ admin │
└────────┴───────────────────────────────────────────────────┴───────┘
You are currently logged in to admin server: http://localhost:8080/APIServer/rest/abl/admin/v2 as user admin
Current project is: CSVManager [2006] - url_name: csvparser
```


## DESCRIBE csvmanage task

```
Usage: csvmanage [options] <list|create|delete|addfile|update>

  Create new REST API Endpoints from CSV file(s) - assumes existing csvparser JSON project installed

  Options:

    -h, --help                       output usage information
    -n, --name <name>                Name of this Defintiion row
    -t, --tableName <name>           TableName of target api
    -i, --ident <ident>              Ident of this Defintiion row
    -d, --delim <char>               Optional: CSV File delimiter character comma is default use [, or | or 	]
    -h, --HasHeaderRow <boolean>     Optional: First row contains header information (default true))
    -e, --haltOnHError <boolean>     Optional: Halt processing file on first found error (default false)
    -r, --replaceOnInsert <boolean>  Optional: remove existing linked records before insert (default false)
    -u, --project_url <url>          Project url name (default csvparser)
    -p, --prefix <prefix>            Datasource Prefix name (default main)
    -c, --useColumnMap <boolean>     Optional: If true, assumes column map for table already exists or has been modified (default false)
    -f, --file <fileName>            The directory path and name to the CSV file
```
##List

The List function will list all of the admin API Projects, Datasources and Existing CSVManager definitions.  You will need the API Project URL and the datasource prefix to create an imported table.
```
$node csvlac.js csvmanage list


All projects                                                                                                                                               
Ident  Name                    Enabled  URL             Comments                                          
-----  ----------------------  -------  --------------  --------------------------------------------------
2012   B2B Derby NW            true     b2bderbynw      B2B Demo for Northwind, Derby.                    
2011   B2B Derby Pavlov        true     b2bderbypavlov  B2B Demo for Pavlov, Derby                        
2006   CSVManager              true     csvparser       General utility to parse a CSV Table into a tar...

Datasources                                                                                                                                                
Name                           Prefix   Type     Active  Catalog         Schema      User            URL                                                            
-----------------------------  -------  -------  ------  --------------  ----------  --------------  ---------------------------------------------------------------
Database: Derby - Pavlov       main     unknown  true    null            null        Pavlov          jdbc:derby:Pavlov                                              
Database: csvtables - abl      main     MySQL    true    csvtables       null        abl             jdbc:mysql://localhost:3306/csvtables                          
Finance                        finance  unknown  true    Finance         null        FINANCE         jdbc:derby:directory:/Users/BANTY01/derbytest/Finance          
MySQLCSVParser                 main     MySQL    true    csvparser       null        abl             jdbc:mysql://localhost:3306/csvparser                          

CSV Definitions                                                                                                                                            
Ident  Name                TableName      Prefix  URL         FirstRowHeader  HaltOnError  UseColumnMap  Delim  Comments                           
-----  ------------------  -------------  ------  ----------  --------------  -----------  ------------  -----  -----------------------------------
95     B2B                 TylerTestFile  test    b2bderbynw  true            true         true          ,      Jetty Test                         
34     CSV Test            testcsvfile5   main    csvtables   true            true         true          ,      Small test table -uploaded using DE
```
## Delete
This will delete the CSV Definition table, header, errors, and column map.  It will not remove the imported table.
```
node csvlac.js csvmanage delete --ident 95
```

## Create
This will take a file and create a new table in the target system - the flags allow for different types of delimiters, column headers on the first row, and if you want to use your own column map

```
node csvlac.js csvmanage create -n TestCSV -t TestCSV -d ',' -h true -e false -r false -u csvtables -p main -c false --file samples/testcsv.csv
I main:csvdefinition/96 ident:96 csvMapName:TestCSV tableName:TestCSV Description: firstRowHasHeader:true haltOnFirstError:true useColumnMap:false
Request took: 574ms - # objects touched: 1
 
I main:csvheader/71 ident:71 csv_ident:96 importDate:[null] filename:[null] content:0x4b6579436f6c2c4... processCSVHeaderFlag:false processCSVFlag:false
U main:csvheader/71 ident:71 csv_ident:96 importDate:2016-04-27 filename:[null] content:0x4b6579436f6c2c4... processCSVHeaderFlag:true processCSVFlag:false
I main:csvdefinition/97 ident:97 csvMapName:TestCSV tableName:TestCSV Description: firstRowHasHeader:true haltOnFirstError:true useColumnMap:false
Request took: 20ms - # objects touched: 1
```

## Add File
This will add another CSV file to the existing CSV Definition (a new header row) - there are flags to determine if you want to replace or append
```
node csvlac.js csvmanage addfile --ident 95 --replaceOnInsert true --file samples/testcsv.csv
```

## Logout

```
$ node csvlac.js logout
Logout successful
```
