var Client = require('node-rest-client').Client;
var colors = require('colors');
var _ = require('underscore');
var Table = require('easy-table');
var fs = require('fs');
var context = require('./context.js');
var login = require('../util/login.js');
var printObject = require('../util/printObject.js');
var dotfile = require('../util/dotfile.js');

module.exports = {
	csvManager: function(action, cmd) {
		if (action === 'list') {
			module.exports.list(cmd);
		}
		else if (action === 'create') {
			module.exports.create(cmd);
		}
		else if (action === 'update') {
			module.exports.update(cmd);
		}
		else if (action === 'delete') {
			module.exports.delete(cmd);
		}
		else if (action === 'addfile') {
			module.exports.append(cmd);
		}
		else {
			console.log('You must specify an action: list, create, addfile, or delete');
			//program.help();
		}
	},
	
list: function (cmd) {
		var client = new Client();
		
		var loginInfo = login.login(cmd);
		if ( ! loginInfo)
			return;
		var apiKey = loginInfo.apiKey;
		var url = loginInfo.url;
		var idx = url.indexOf("/abl");
		var csvmanagerURL = url.substring(0,idx) +"/default/csvparser/v1";		
		
		var projIdent = cmd.project_ident;
		if ( ! projIdent) {
			projIdent = dotfile.getCurrentProject();
			if ( ! projIdent) {
				console.log('There is no current project.'.yellow);
				return;
			}
		}
		console.log("");
		client.get(url + "/dbaseschemas?pagesize=100", {
			headers: {
				Authorization: "CALiveAPICreator " + apiKey + ":1"
			}
		}, function(data) {
			if (data.errorMessage) {
				console.log(data.errorMessage.red);
				return;
			}
			printObject.printHeader('Datasources');
			var table = new Table();
			_.each(data, function(p) {
				table.cell("Name", p.name);
				table.cell("Prefix", p.prefix);
				var type = "";
				switch(p.dbasetype_ident) {
					case 1: type = "MySQL"; break;
					case 2: type = "Oracle"; break;
					case 3: type = "SQL Server (jTDS)"; break;
					case 4: type = "SQL Server"; break;
					case 5: type = "SQL Server (Azure)"; break;
					case 6: type = "NuoDB"; break;
					case 7: type = "PostgreSQL"; break;
					case 8: type = "Derby"; break;
					case 9: type = "DB2 for z/OS"; break;
					case 10: type = "DB2 for LUW"; break;
					default: type = "unknown";
				}
				table.cell("Type", type);
				table.cell("Active", p.active);
				table.cell("Catalog", p.catalog_name);
				table.cell("Schema", p.schema_name);
				table.cell("User", p.user_name);
				table.cell("URL", p.url);
				var comments = p.comments;
				if ( ! comments) {
					comments = "";
				}
				else if (comments.length > 50){
					comments = comments.substring(0, 47) + "...";
				}
				//table.cell("Comments", comments);
				table.newRow();
			});
			table.sort(['Active', 'Name']);
			if (data.length === 0) {
				console.log('There is no database defined for this project'.yellow);
			}
			else {
				console.log(table.toString());
			}
			printObject.printHeader("# datasources: " + data.length);
		});

		console.log("");
		client.get(url + "/projects"+"?pagesize=100", {
			headers: {
				Authorization: "CALiveAPICreator " + apiKey + ":1"
			}
		}, function(data) {
			if (data.errorMessage) {
				console.log(data.errorMessage.red);
				return;
			}
			printObject.printHeader('All projects');
			var table = new Table();
			_.each(data, function(p) {
				table.cell("Ident", p.ident);
				table.cell("Name", p.name);
				table.cell("Enabled", p.is_active);
				table.cell("URL", p.url_name);
				var comments = p.comments;
				if ( ! comments) {
					comments = "";
				}
				else if (comments.length > 50){
					comments = comments.substring(0, 47) + "...";
				}
				comments = comments.replace("\n"," ");
				comments = comments.replace("\n"," ");
				table.cell("Comments", comments);
				table.newRow();
			});
			table.sort(['Name']);
			console.log(table.toString());
			printObject.printTrailer("# projects: " + data.length);
		});
		
		console.log("");
		
		client.get(csvmanagerURL + "/main:csvdefinition"+"?pagesize=100", {
			headers: {
				Authorization: "CALiveAPICreator nXvjDqgG8rEUpYif2K8m:1"
			}
		}, function(data) {
			if (data.errorMessage) {
				console.log(data.errorMessage.red);
				return;
			}
			printObject.printHeader('CSV Definitions');
			var table = new Table();
			_.each(data, function(p) {
				table.cell("Ident", p.ident);
				table.cell("Name", p.csvMapName);
				table.cell("TableName", p.tableName);
				table.cell("Prefix", p.prefix);
				table.cell("URL", p.project_url);
				table.cell("FirstRowHeader", p.firstRowHasHeader);
				table.cell("HaltOnError", p.haltOnFirstError);
				table.cell("UseColumnMap",p.useColumnMap);
				table.cell("Delim", p.columnDelim);
				
				var comments = p.Description;
				if ( ! comments) {
					comments = "";
				}
				else if (comments.length > 50){
					comments = comments.substring(0, 47) + "...";
				}
				comments = comments.replace("\n"," ");
				comments = comments.replace("\n"," ");
				table.cell("Comments", comments);
				table.newRow();
			});
			table.sort(['Name']);
			console.log(table.toString());
			printObject.printTrailer("# csvdefinition: " + data.length);
		});
		
		
},
update: function (cmd) {
	var apikey = "CALiveAPICreator nXvjDqgG8rEUpYif2K8m:1";

	},
delete: function (cmd) {
		var client = new Client();
		var loginInfo = login.login(cmd);
		if ( ! loginInfo) {
			console.log('You are not currently logged into any API Creator server.'.red);
			return;
		}

		var filt = null;
		if (cmd.ident) {
			filt = "equal(ident:" + cmd.ident + ")";
		}
		else {
			console.log('Missing parameter: please specify ident of csvdefinition (use list)'.red);
			return;
		}
		var idx = loginInfo.url.indexOf("/abl");
		var csvmanagerURL = loginInfo.url.substring(0,idx) +"/default/csvparser/v1";		
		//console.log(csvmanagerURL);
		
		client.get(csvmanagerURL + "/main:csvdefinition?sysfilter=" + filt, {
			headers: {
				Authorization: "CALiveAPICreator nXvjDqgG8rEUpYif2K8m:1"
			}
		}, function(data) {
			//console.log('get result: ' + JSON.stringify(data, null, 2));
			if (data.errorMessage) {
				console.log(("Error: " + data.errorMessage).red);
				return;
			}
			if (data.length === 0) {
				console.log(("CSV Definition does not exist").yellow);
				return;
			}
			if (data.length > 1) {
				console.log(("Error: more than one for the given condition: " + filter).red);
				return;
			}
			var project = data[0];
			var startTime = new Date();
			client['delete'](project['@metadata'].href + "?checksum=" + project['@metadata'].checksum, {
				headers: {
					Authorization: "CALiveAPICreator nXvjDqgG8rEUpYif2K8m:1"
				}
			}, function(data2) {
				var endTime = new Date();
				if (data2.errorMessage) {
					console.log(data2.errorMessage.red);
					return;
				}
				printObject.printHeader('CSVDefinition was deleted, including the following objects:');
				
				
				var delProj = _.find(data2.txsummary, function(p) {
					return p['@metadata'].resource === 'main:csvdefinition';
				});
				if ( ! delProj) {
					console.log('ERROR: unable to find deleted csvdefinition'.red);
					return;
				}
				if (cmd.verbose) {
					_.each(data2.txsummary, function(obj) {
						printObject.printObject(obj, obj['@metadata'].entity, 0, obj['@metadata'].verb);
					});
				}
				else {
					printObject.printObject(delProj, delProj['@metadata'].entity, 0, delProj['@metadata'].verb);
					console.log(('and ' + (data2.txsummary.length - 1) + ' other objects').grey);
				}
				
				var trailer = "Request took: " + (endTime - startTime) + "ms";
				trailer += " - # objects touched: ";
				if (data2.txsummary.length == 0) {
					console.log('No data returned'.yellow);
				}
				else {
					trailer += data2.txsummary.length;
				}
				printObject.printHeader(trailer);
			});
		});
	
},
create: function (cmd) {
		var client = new Client();
		var bytes = null;
		
		var loginInfo = login.login(cmd);
		if ( ! loginInfo)
			return;
		var url = loginInfo.url;
		if(!cmd.name){
			console.log("Parameter name is required".red);
			return;
		}
		if(!cmd.tableName){
			console.log("Parameter tableName is required".red);
			return;
		}		
		var apiKey = "nXvjDqgG8rEUpYif2K8m";
		var url = loginInfo.url;
		var idx = url.indexOf("/abl");
		var csvmanagerURL = url.substring(0,idx) +"/default/csvparser/v1";		
	
		if (cmd.file) {
			if (cmd.file === 'stdin') {
				cmd.file = '/dev/stdin';
			}
			else {
				if ( ! fs.existsSync(cmd.file)) {
					console.log('Unable to open CSV file: '.red + cmd.file.magenta);
					return;
				}
			}
			bytes = "" + fs.readFileSync(cmd.file);
		}
		
		try {
			//if(bytes === null)
			//	throw "File content not found";
		}
		catch(e) {
			console.log('Error: invalid csv file'.red + " : " + e);
			return;
		}
		var startTime = new Date();
		var comments = "";
		if(cmd.hasHeaderRow == null){
			cmd.hasHeaderRow = true;
		}
		if(cmd.haltOnError == null){
			cmd.haltOnError = true;
		}
		if(cmd.useColMap == null){
			cmd.useColMap = false;
		}
		if(!cmd.delim){
			cmd.delim = ",";
		}
		if(!cmd.project_url){
			cmd.project_url = "csvtables";
		}
		if(cmd.replaceOnInsert == null){
			cmd.replaceOnInsert = false;
		}
		var csvdef = {
				 "csvMapName": cmd.name,
				 "tableName": cmd.tableName,
				 "Description": comments,
				 "firstRowHasHeader": cmd.hasHeaderRow,
				 "haltOnFirstError":  cmd.haltOnError,
				 "useColumnMap":  cmd.useColMap,
				 "columnDelim":  cmd.delim ,
    		     "prefix": cmd.prefix ,		
    		     "project_url":  cmd.project_url
			};
			console.log(csvdef);
			var startTime = new Date();
	
		client.post(csvmanagerURL + "/main:csvdefinition" , {
			data: csvdef,
			headers: {
				Authorization: "CALiveAPICreator " + apiKey + ":1"
			}
		}, function(data) {
			console.log(data);
			
			var endTime = new Date();
			if (data.errorMessage) {
				console.log(("CSVDefinition POST Error: " + data.errorMessage).red);
				return;
			}
				var ident = data.txsummary[0].ident;
				var checksum = null;
				_.each(data.txsummary, function(obj) {
					printObject.printObject(obj, obj['@metadata'].entity, 0, obj['@metadata'].verb);
					
				});
			
				var trailer = "Request took: " + (endTime - startTime) + "ms";
				trailer += " - # objects touched: ";
				if (data.txsummary.length == 0) {
					console.log('No data returned'.yellow);
				}
				trailer += data.txsummary.length;
				
				console.log(trailer.bgWhite.blue);
				console.log(' '.reset);
				
				if(bytes !== null) {
					var base64 = "b64:"+new Buffer(bytes).toString('base64');
					var csvhead= {
						content: base64,
						csv_ident: ident,
						replaceOnInsert: cmd.replaceOnInsert
					};
					
					//(csvhead);
					client.post(csvmanagerURL + "/main:csvheader" , {
					  data: csvhead,
					  headers: {
						  Authorization: "CALiveAPICreator " + apiKey + ":1"
					  }
				  	}, function(data2) {
					  	//console.log(data2);
					  	if (data2.errorMessage) {
							console.log(("Error: " + data2.errorMessage).red);
							return;
						}
					  _.each(data2.txsummary, function(obj) {
							printObject.printObject(obj, obj['@metadata'].entity, 0, obj['@metadata'].verb);
							checksum = obj['@metadata'];
						});
						ident = data2.txsummary[0].ident;
						csvhead = {
							ident: ident,
							genTableFlag: true
						};
						csvhead['@metadata']=checksum;
						client.put(csvmanagerURL + "/main:csvheader" , {
							 data: csvhead,
							 headers: {
								 Authorization: "CALiveAPICreator " + apiKey + ":1"
							 }
						   }, function(data3) {
							   //console.log(data3);
							   if (data3.errorMessage) {
								   console.log(("Error: " + data3.errorMessage).red);
								   return;
							   }
							 _.each(data3.txsummary, function(obj) {
								   printObject.printObject(obj, obj['@metadata'].entity, 0, obj['@metadata'].verb);
							   });
						});
					});
				}
		});
},
append: function (cmd) {
		var client = new Client();
		var loginInfo = login.login(cmd);
		if ( ! loginInfo)
			return;
		var apiKey = "nXvjDqgG8rEUpYif2K8m";
		
		var url = loginInfo.url;
		var idx = url.indexOf("/abl");
		var csvmanagerURL = url.substring(0,idx) +"/default/csvparser/v1";		
		//get definition - add to header - require ident
		if(!cmd.ident){
			console.log("Missing required parameter ident (use list)".red);
			return;
		}
	
		if (cmd.file) {
			if (cmd.file === 'stdin') {
				cmd.file = '/dev/stdin';
			}
			else {
				if ( ! fs.existsSync(cmd.file)) {
					console.log('Unable to open CSV file: '.red + cmd.file.magenta);
					return;
				}
			}
			bytes = "" + fs.readFileSync(cmd.file);
		}
		
		try {
			if(bytes === null)
				throw "File content not found";
		}
		catch(e) {
			console.log('Error: invalid csv file'.red + " : " + e);
			return;
		}
		
		client.get(csvmanagerURL +"/main:csvdefinition?sysfilter=equal(ident:"+cmd.ident+")", {
			headers: {
				Authorization: "CALiveAPICreator " + apiKey + ":1"
			}
		}, function(data) {
			if (data.errorMessage) {
				console.log(("CSVManager append error: " + data.errorMessage).red);
				return;
			}
			
			if (data.length === 0) {
				console.log(("Error: cannot find ident for csvdefinition").red);
				return;
			}
			if (data.length > 1) {
				console.log(("Error: found more than one defintion for the given condition: " ).red);
				return;
			}
			if(!cmd.replaceOnInsert){
				cmd.replaceOnInsert = false;
			}
			console.log(data);
			var ident = data[0].ident;
		
			if(bytes !== null && ident !== null) {
					var base64 = "b64:"+new Buffer(bytes).toString('base64');
					var csvhead= {
						content: base64,
						csv_ident: ident
					};
					
					//(csvhead);
					client.post(csvmanagerURL + "/main:csvheader" , {
					  data: csvhead,
					  headers: {
						  Authorization: "CALiveAPICreator " + apiKey + ":1"
					  }
				  	}, function(data2) {
					  	//console.log(data2);
					  	if (data2.errorMessage) {
							console.log(("Error: " + data2.errorMessage).red);
							return;
						}
					  _.each(data2.txsummary, function(obj) {
							printObject.printObject(obj, obj['@metadata'].entity, 0, obj['@metadata'].verb);
							checksum = obj['@metadata'];
						});
						ident = data2.txsummary[0].ident;
						csvhead = {
							ident: ident,
							replaceOnInsert: cmd.replaceOnInsert,
							genTableFlag: true
						};
						csvhead['@metadata']=checksum;
						client.put(csvmanagerURL + "/main:csvheader" , {
							 data: csvhead,
							 headers: {
								 Authorization: "CALiveAPICreator " + apiKey + ":1"
							 }
						   }, function(data3) {
							   //console.log(data3);
							   if (data3.errorMessage) {
								   console.log(("Error: " + data3.errorMessage).red);
								   return;
							   }
							 _.each(data3.txsummary, function(obj) {
								   printObject.printObject(obj, obj['@metadata'].entity, 0, obj['@metadata'].verb);
							   });
						});
					});
				}
		});
		
	}
};
