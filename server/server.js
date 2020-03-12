// simple server to handle two get requests for the players and team data
// post to insert new users into sql table
// 


const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const algo = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


function encrypt(text) {
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

function decrypt(text) {
	let iv = Buffer.from(text.iv, 'hex');
	let encryptedText = Buffer.from(text.encryptedData, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
};

var config = {
	user: 'sa',
	password: 'windows#42',
	server: 'localhost',
	database: 'dbHockeyInfo'
};


var config2 = {
	user: 'sa',
	password: 'windows#42',
	server: 'localhost',
	database: 'nodelogin'
};


//console.log("Starting get request");

var sql = require("mssql");

app.get('/players', function(req, res) {

	//var sql = require("mssql");

	sql.connect(config, function(err) {
		if (err) console.log(err);

		var request = new sql.Request();
		request.query("select * from NHLPlayerData", function(err, recordset) {
			if (err) console.log(err);
			res.header("Access-Control-Allow-Origin", "*");
			//res.header("Access-Control-Allow-Origin", "X-Requested-With");
			res.send(recordset);
		});
	});
});

app.get('/teams', function(req, res) {
	//var sql = require("mssql");

	sql.connect(config, function(err) {
		var request = new sql.Request();

		request.query('select * from NHLTeamData', function(err, recordset) {
			if (err) console.log(err);
			res.header("Access-Control-Allow-Origin", "*");
			res.send(recordset);
		});
	});
});

/*
app.get('/sql/login', function(req, res) {
	sql.connect(config2, function(err) {
		var request = new sql.Request();


	});
});
*/


var server = app.listen(5000, function() {
	console.log('Server is running...');
});

app.use(cors(corsOptions));


// post to /sql/user
app.post('/sql/user', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	//console.log(req.body.team);
	let dateNow = Date.now();
	const pool = new sql.ConnectionPool({
		user: 'sa',
		password: 'windows#42',
		server: 'localhost',
		database: 'nodelogin'
	});

	//pool connect, needs to init a transaction and commit the trans to execute the query
	pool.connect()
	.then(function() {
		const transaction = new sql.Transaction(pool);
		transaction.begin(err => {
			const request = new sql.Request(transaction);
			//console.log(req.body);					
			
			request.input('username', sql.NVarChar(sql.MAX), req.body.username);
			request.input('password', sql.NVarChar(sql.MAX), req.body.password);
			request.input('email', sql.NVarChar(sql.MAX), req.body.email);
			request.input('time', sql.DateTime, new Date());
			request.input('UserTeam', sql.VarChar(sql.MAX), req.body.UserTeam);

			request.query("INSERT INTO Accounts (username, password, email, timeStamp, UserTeam) VALUES (@username, @password, @email, @time, @UserTeam)", function(err, result) {
				if ( err ) {
					throw err;
				}
				transaction.commit(err => {
					console.log("Transaction complete: ", req.body);
					res.send({status: true, userData: req.body, login: true});
				});
			});
		});
	});
});


app.post('/sql/login', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	const pool = new sql.ConnectionPool({
		user: 'sa',
		password: 'windows#42',
		server: 'localhost',
		database: 'nodelogin'
	});

	pool.connect()
		.then(function() {
			const transaction = new sql.Transaction(pool);
			transaction.begin(err => {
				const request = new sql.Request(transaction);
				//console.log(req.body.username, req.body.password);
				request.input('username', sql.NVarChar(sql.MAX), req.body.username);
				//request.input('email', sql.NVarChar(sql.MAX), req.body.email);
				request.input('password', sql.NVarChar(sql.MAX), req.body.password);

				request.query("select * from Accounts where username = @username and password = @password", function(err, result) {
					console.log("res: ", result);
					if (err) {
						throw err;
						res.send({login: false});
					}
					else if (result.recordset.length) {
						transaction.commit(err => {
							console.log('logged in', result.recordset[0]);
							res.send({login: true, userData: result.recordset[0]});
						});
					}
					else {
						res.send({login: false});
					}
				});
			});
		});
});

