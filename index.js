const TeamspeakQuery = require('teamspeak-query');
const readline = require('readline');
var perms = require('./perms.json');
var lang;
var sq_host = "localhost";
var sq_ts_port = 9987
var sq_port = 10011;
var sq_username = "serveradmin";
var sq_pw = "";
var groupname = "Support++";
var id = null;
var i = 0;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}); 

const ask = (question) => {
	return new Promise((resolve, reject) => {
		if(question == 0) {
			rl.question("Please select a language\n1: Deutsch (German)\n2: English\n» ", function(answer) {
				if(answer == 1) lang = 'de';
				else lang = 'en';
				resolve();
			});
		} else if(lang == 'de') {
			switch(question) {
				case 1:
					rl.question("Wie lautet dein Server Host? (Standard: localhost): ", function(answer) {
						if(answer != "") {
							sq_host = answer;
						}
						resolve();
					});
					break;
				case 2:
					rl.question("Wie lautet dein Serverquery Port? (Standard: 10011): ", function(answer) {
						if(answer != "") {
							sq_port = answer;
						}
						resolve();
					});
					break;
				case 3:
					rl.question("Wie lautet dein Serverquery Username? (Standard: serveradmin): ", function(answer) {
						if(answer != "") {
							sq_username = answer;
						}
						resolve();
					});
					break;
				case 4:
					rl.question("Wie lautet dein Serverquery Passwort?: ", function(answer) {
						if(answer != "") {
							sq_pw = answer;
						} else {
							sq_pw = "undefined";
						}
						resolve();
					});
					break;
				case 5:
					rl.question("Wie lautet dein Teamspeak Server Port? (Standard: 9987): ", function(answer) {
						if(answer != "") {
							sq_ts_port = answer;
						}
						resolve();
					});
					break;
				case 6:
					rl.question("Welchen Name soll die neue Gruppe haben? (Standard: Support++): ", function(answer) {
						if(answer != "") {
							groupname = answer;
						}
						resolve();
					});
					break;
			}
		} else if(lang == 'en') {
			switch(question) {
				case 1:
					rl.question("What is your server host? (Default: localhost): ", function(answer) {
						if(answer != "") {
							sq_host = answer;
						}
						resolve();
					});
					break;
				case 2:
					rl.question("What is your Serverquery Port? (Default: 10011): ", function(answer) {
						if(answer != "") {
							sq_port = answer;
						}
						resolve();
					});
					break;
				case 3:
					rl.question("What is your Serverquery Username? (Default: serveradmin): ", function(answer) {
						if(answer != "") {
							sq_username = answer;
						}
						resolve();
					});
					break;
				case 4:
					rl.question("What is your Serverquery Password?: ", function(answer) {
						if(answer != "") {
							sq_pw = answer;
						} else {
							sq_pw = "undefined";
						}
						resolve();
					});
					break;
				case 5:
					rl.question("What is your Teamspeak Server Port? (Default: 9987): ", function(answer) {
						if(answer != "") {
							sq_ts_port = answer;
						}
						resolve();
					});
					break;
				case 6:
					rl.question("What name should the new group have? (Default: Support++): ", function(answer) {
						if(answer != "") {
							groupname = answer;
						}
						resolve();
					});
					break;
			}
		}
	});
}

const createGroup = (query) => {
	return new Promise((resolve, reject) => {
		query.send('login', sq_username, sq_pw)
		  .then(() => query.send('serveridgetbyport', {'virtualserver_port':sq_ts_port}))
		  .then(getID)
		  .then((server_id) => query.send('use', server_id))
		  .then(() => query.send('clientupdate', {'client_nickname': 'Support++ | Group Generator'}))
		  .then(() => console.log('Serverquery erfolgreich verbunden.'))
		  .then(() => query.send('servergroupadd', {'name':groupname}))
		  .then(saveID)
		  .then(() => resolve())
		  .catch(err => console.error('An error occured:', err));
	});
}

function setPerms(query){
	Object.keys(perms).forEach(function (key) {
		query.send('servergroupaddperm',{'sgid':id,'permsid':key,'permvalue':perms[key],'permnegated':0,'permskip':0})
		  .then(() => i++)
		  .then(() => check())
		  .catch(err => console.error('An error occured:', err));
	});
}

function check() {
	if(i==Object.keys(perms).length) end();
}

function end() {
	console.log("######################################################");
	console.log("# Deine Servergruppe wurde erfolgreich eingerichtet. #");
	console.log("######################################################");
	process.exit();
}

const main = async () => {
	console.log("##########################################################");
	console.log("#        Welcome to the Support++ group generator        #");
	console.log("#                                                        #");
	console.log("# Version: 1.0.0                                         #");
	console.log("# Author: Elias Bennour                                  #");
	console.log("# Any bugs or errors? Please create an Issue on Github.  #");
	console.log("# Github: https://github.com/Support-pp/group-generator  #");
	console.log("##########################################################");
	await ask(0);
	await ask(1);
	await ask(2);
	await ask(3);
	await ask(4);
	await ask(5);
	await ask(6);
	const query = new TeamspeakQuery.Raw({host:sq_host,port:sq_port});
	await createGroup(query);
	if(lang == 'de') {
		console.log("########################################");
		console.log("# Deine Servergruppe wurde erstellt.   #");
		console.log("# Die Rechte werden nun vergeben...    #");
		console.log("# Das kann bis zu 2 Minuten dauern...  #");
		console.log("########################################");
	} else {
		console.log("########################################");
		console.log("# Your server group has been created.  #");
		console.log("# The rights are now awarded...        #");
		console.log("# This can take up to 2 minutes...     #");
		console.log("########################################");
	}
	setPerms(query);
}

main();

function saveID(data){ id = data.raw().substring(data.raw().indexOf("=")+1); }
function getID(data){ return data.raw().substring(data.raw().indexOf("=")+1); }

rl.on('line', (input) => {
	if(input == "status") console.log("Es wurden " + i + "/" + Object.keys(perms).length + " Rechte gesetzt.");
});

rl.on('close', () => {
	process.exit();
});
