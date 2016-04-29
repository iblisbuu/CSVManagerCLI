#!/usr/bin/env node

/**
 * A command-line interface for CSVManager CA Live API Creator from CA Technologies
 */

var program = require('commander');
var path = require('path');
var pkg = require( path.join(__dirname, 'package.json') );

var login = require('./objects/login.js');
var project = require('./objects/project.js');
var dotfile = require('./util/dotfile.js');
var csv = require('./objects/csvmanager.js');

program
	.version(pkg.version);

program
	.command('login [url]')
	.description('Login to an API server')
	.option('-u, --username <username>', 'API Server admin user name')
	.option('-p, --password <password>', 'API Server admin password')
	.option('-a, --serverAlias <serverAlias>', 'Alias for this connection')
	.action(login.commandLogin);

program
	.command('logout [url]')
	.description('Logout from the current server, or a specific server')
	.option('-a, --serverAlias <serverAlias>', 'Alias from which to logout')
	.action(login.commandLogout);

program
	.command('use <alias>')
	.description('Use the specified server by default')
	.action(login.commandUseAlias);

program
	.command('status')
	.description('Show the current server, and any defined server aliases')
	.action(login.commandStatus);
program
	.command('project <list|create|update|delete|use|import|export>')
	.description('Administer projects. Actions are: list, create, update, delete, use, export')
	.option('--ident [ident]', 'The ident of the specific project (see project list)')
	.option('--project_name [name]', 'The name of the project')
	.option('--url_name [name]', 'The name of the project')
	.option('--status [status]', 'Optional: the status of the project, can be A (for Active) or I for (Inactive)')
	.option('--authprovider [ident]', 'Optional: the ident of the authentication provider for the project')
	.option('--comments [comments]', 'Optional: a description of the project')
	.option('--file [file]', 'Optional: for import/export, the name of a file to read from/save to, if unspecified, use stdin/stdout')
	.option('--verbose', 'Optional: whether to display detailed results, or just a summary')
	.action(project.doProject);
program
	.command('csvmanage <list|create|delete|addfile|update>')
	.description('Create new REST API Endpoints from CSV file(s) - assumes existing csvparser JSON project installed')
	.option('-n, --name <name>', 'Name of this Defintiion row')
	.option('-t, --tableName <name>', 'TableName of target api')
	.option('-i, --ident <ident>', 'Ident of this Defintiion row')
	.option('-d, --delim <char>', 'Optional: CSV File delimiter character comma is default use [, or | or \t]')
	.option('-h, --HasHeaderRow <boolean>', 'Optional: First row contains header information (default true))')	
	.option('-e, --haltOnHError <boolean>', 'Optional: Halt processing file on first found error (default false)')
	.option('-r, --replaceOnInsert <boolean>', 'Optional: remove existing linked records before insert (default false)')
	.option('-u, --project_url <url>', 'Project url name (default csvparser)')
	.option('-p, --prefix <prefix>', 'Datasource Prefix name (default main)')
	.option('-c, --useColumnMap <boolean>', 'Optional: If true, assumes column map for table already exists or has been modified (default false)')
	.option('-f, --file <fileName>', 'The directory path and name to the CSV file')
	.action(csv.csvManager);
		
program.parse(process.argv);

if (process.argv.length < 3) {
	console.log('You must specify a command'.red);
	program.help();
}
