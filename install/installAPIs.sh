#! /bin/bash

if [ $# -lt 1 ]
	then
		echo " "
		echo " "
		echo "==== Import Script for CSVmanager  ===="
		echo " "
		echo " "
		echo "Normal use: sh installAPIs.sh derby"
		echo " "
		echo "    arg1 is derby, mysql, or dev"
		echo "       derby creates API projects for Jetty, using pre-installed Derby DBs"
		echo "       mysql creates APIs for mysql databases..."
		echo "          b2b-northwind, b2b-pavlov, b2b-promos -- presumes localhost, root, no password"
		echo "          ddl in ./mysql (e.g., use MySQLWorkbench to run)"
		echo " "
		echo "    arg2 server url"
		echo " "
		echo " "
		exit
fi

APIServerURL=$2

echo
echo ===
echo installing sharedlibs, pavlov, and b2b...

dbType=$1
echo ... database is $dbType
echo ===
echo


# import shared libs
pushd ./scs/projects/sharedlibs/build
sh ./importlibs.sh $APIServerURL
popd


# create CSVManager API
pushd ./scs/projects/csvmanager/build
sh ./import.sh $APIServerURL $dbType
popd

echo
echo
echo
echo ==================================================
echo ==== install complete - server status follows ====
echo ==================================================
echo
csvlac login -u admin -p Password1 $APIServerURL -a local
csvlac use local

csvlac status
csvlac csvmanage list


csvlac logout -a local
