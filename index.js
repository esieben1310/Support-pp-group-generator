const TeamspeakQuery = require('teamspeak-query');
const readline = require('readline');
var perms = require('./perms.json');
var sq_host = "localhost";
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

const question1 = () => {
  return new Promise((resolve, reject) => {
	  rl.question("Wie lautet dein Server Host? (Standard: localhost): ", function(answer) {
		if(answer != "") {
			sq_host = answer;
		}
		resolve();
	  });
  });
}

const question2 = () => {
	return new Promise((resolve, reject) => {
		rl.question("Wie lautet dein Serverquery Port? (Standard: 10011): ", function(answer) {
			if(answer != "") {
				sq_port = answer;
			}
			resolve();
		});
	});
}

const question3 = () => {
	return new Promise((resolve, reject) => {
		rl.question("Wie lautet dein Serverquery Username? (Standard: serveradmin): ", function(answer) {
			if(answer != "") {
				sq_username = answer;
			}
			resolve();
		});
	});
}

const question4 = () => {
	return new Promise((resolve, reject) => {
		rl.question("Wie lautet dein Serverquery Passwort?: ", function(answer) {
			if(answer != "") {
				sq_pw = answer;
				resolve();
			} else {
				console.log("Dieses Feld darf nicht leer sein!");
				question4();
			}
		});
	});
}

const question5 = () => {
	return new Promise((resolve, reject) => {
		rl.question("Welchen Name soll die neue Gruppe haben? (Standard: Support++): ", function(answer) {
			if(answer != "") {
				groupname = answer;
			}
			resolve();
		});
	});
}

const createGroup = (query) => {
	return new Promise((resolve, reject) => {
		query.send('login', sq_username, sq_pw)
		  .then(() => query.send('use', 1))
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
	console.log("#####################################################################");
	console.log("#       Willkommen beim Support++ Gruppen Generator                 #");
	console.log("#                                                                   #");
	console.log("# Version: 1.0                                                      #");
	console.log("# Author: Elias Bennour                                             #");
	console.log("# Bei Bugs/Fehlern bitte ein Issue auf Github erstellen.            #");
	console.log("# Github: https://github.com/esieben1310/Support-pp-group-generator #");
	console.log("#####################################################################");
	await question1()
	await question2()
	await question3()
	await question4()
	await question5()
	const query = new TeamspeakQuery.Raw({host:sq_host,port:sq_port});
	await createGroup(query);
	console.log("########################################");
	console.log("# Deine Servergruppe wurde erstellt.   #");
	console.log("# Die Rechte werden nun vergeben...    #");
	console.log("# Das kann bis zu 2 Minuten dauern...  #");
	console.log("########################################");
	setPerms(query);
}

main();

function saveID(data){ id = data.raw().substring(data.raw().indexOf("=")+1); }

rl.on('line', (input) => {
	if(input == "status") console.log("Es wurden " + i + "/" + Object.keys(perms).length + " Rechte gesetzt.");
});

rl.on('close', () => {
	process.exit();
});