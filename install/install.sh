#! /bin/bash
# create APIs, and test: post and verify

if [ $# -lt 1 ]
	then
		echo " "
		echo " "
		echo "==== Installs Live API Creator CSVManager ===="
		echo " "
		echo "Usage: sh install.sh derby"
		echo " "
		echo "    creates API projects for Jetty, using pre-installed Derby DBs"
		echo "    posts an order"
		echo "    tests for row created with expected data, using Node and Python"
		echo " "
		echo " "
		echo "    Optionally, add server: sh install.sh derby http://localhost:8080"
		echo " "
		echo " "
		exit
fi

if [[ ${1} != 'derby' ]] && [[ ${1} != 'mysql' ]]
then
  echo 'Database types must be derby or mysql - found: ' "${1}"
  exit
else
  echo ''
fi

ServerURL="http://localhost:8080"
if [ $# -gt 1 ]
	then
		ServerURL=$2
		echo "    using server $ServerURL"
		echo " "
		echo " "
fi
APIURL=$ServerURL"/rest/default/"

# following steps require...
# sudo npm install -g liveapicreator-admin-cli
# sudo npm install -g liveapicreator-cli
# npm install caliveapicreator

sh installAPIs.sh $1 $ServerURL


