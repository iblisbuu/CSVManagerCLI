#! /bin/bash

## Test CSVManager Script
#Connect target server

# Usage: csvmanage [options] <list|create|delete|addfile|update>
#
#  Create new REST API Endpoints from CSV file(s) - assumes existing csvparser JSON project installed
#
#  Options:
#
#    -h, --help                       output usage information
#    -n, --name <name>                Name of this Defintiion row
#    -t, --tableName <name>           TableName of target api
#    -i, --ident <ident>              Ident of this Defintiion row
#    -d, --delim <char>               Optional: CSV File delimiter character comma is default use [, or | or 	]
#    -h, --HasHeaderRow <boolean>     Optional: First row contains header information (default true))
#    -e, --haltOnHError <boolean>     Optional: Halt processing file on first found error (default false)
#    -r, --replaceOnInsert <boolean>  Optional: remove existing linked records before insert (default false)
#    -u, --project_url <url>          Project url name (default csvparser)
#    -p, --prefix <prefix>            Datasource Prefix name (default main)
#    -c, --useColumnMap <boolean>     Optional: If true, assumes column map for table already exists or has been modified (default false)
#    -f, --file <fileName>            The directory path and name to the CSV file


node csvlac.js login -u admin -p Password1 http://localhost:8080/APIServer -a target
node csvlac.js use target
node csvlac.js project use --url_name csvparser

# create table from csv with column header MySQL
#node csvlac.js csvmanage create -n TestCSV -t TestCSV -d ',' -h true -e false -r false -u csvtables -p main -c false --file samples/testcsv.csv
# create table from csv with column header Jetty
#node csvlac.js csvmanage create -n TestCSVJetty -t TestCSV -d ',' -h true -e false -r false -u jetty -p main -c false --file samples/testcsv.csv

# create table from csv without column header MySQL
#node csvlac.js csvmanage create -n TestCSVNH -t TestCSVNH -d ',' -h false -e false -r false -u csvtables -p main -c false --file samples/testcsvnh.csv
# create table from csv without column header Jetty
#node csvlac.js csvmanage create -n TestCSVNHJetty -t TestCSVNH -d ',' -h false -e false -r false -u jetty -p main -c false --file samples/testcsvny.csv


#node csvlac.js csvmanage create -n Candidate -t Candidate -d '|' -h true -e true -r true -u csvtables -p main -c false --file /Users/banty01/Downloads/electionTracker_datafiles/cn.txt
#node csvlac.js csvmanage create -n Committee -t Committee -d '|' -h true -e true -r true -u csvtables -p main -c false --file /Users/banty01/Downloads/electionTracker_datafiles/cm.txt
#node csvlac.js csvmanage create -n CandCommLink -t CandCommLink -d '|' -h true -e true -r true -u csvtables -p main -c false --file /Users/banty01/Downloads/electionTracker_datafiles/ccl.txt
#node csvlac.js csvmanage create -n IndivContribs -t IndivContrib -d '|' -h true -e true -r true -u csvtables -p main -c false --file /Users/banty01/Downloads/electionTracker_datafiles/itoth.txt




# reload (replace) existing table with modified data
# create table from csv with column header MySQL - replace
#node csvlac.js csvmanage create -n TestCSV2 -t TestCSV2 -d ',' -h true -e false -r true -u csvtables -p main -c false --file samples/testcsv.csv
#node csvlac.js csvmanage addfile -n TestCSV2 -t TestCSV2 -d ',' -h true -e true -r true -u csvtables -p main -c false --file samples/testcsv.csv
# create table from csv with column header Jetty - replace
#node csvlac.js csvmanage create -n TestCSV2Jetty -t TestCSV2 -d ',' -h true -e false -r true -u jetty -p main -c false --file samples/testcsv.csv
#node csvlac.js csvmanage addfile -n TestCSV2Jetty -t TestCSV2 -d ',' -h true -e true -r true -u jetty -p main -c false --file samples/testcsv.csv

# load medium table to MySQL, Jetty 
# load large table to MySQL, Jetty
# 


#node csvlac.js csvmanage create -n LobbyistActionCSV -t LobbyCSV -d '|' -h true -e false -r false -u csvtables -p main -c false --file samples/LobbyistAction.csv
# List Projects, Datasources, and CSV Definitions
node csvlac.js csvmanage list


#Wrapup and close connections
#lacadmin logout -a target