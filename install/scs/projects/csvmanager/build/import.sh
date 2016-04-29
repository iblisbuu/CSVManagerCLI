#! /bin/bash

SERVER=$1
echo
echo
echo
echo === importing CSVManager.json to APIServer $SERVER
echo

lacadmin logout -a parser
lacadmin login -u admin -p Password1 $SERVER -a parser
lacadmin use parser


lacadmin library import --file libraries.json
	
lacadmin project import --file ../src/CSVManager.json
lacadmin project use --url_name csvparser

echo
echo "...imported, link libraries using url_name=csvparser"
lacadmin library --linkProject --name CSVManager 
lacadmin library --linkProject --name Annotations
lacadmin library --linkProject --name JacksonCore
lacadmin library --linkProject --name JacksonDatabind
lacadmin library --linkProject --name JacksonDataFormat

# Data Sources [optional] for other databases - set the password
lacadmin datasource list
lacadmin datasource update --prefix main --password kahuna_local!

# close connections
lacadmin logout -a parser

echo
echo ==== CSVManager imported ====
echo
echo
echo
