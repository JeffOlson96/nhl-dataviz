// simple server to handle two get requests for the players and team data
// post to insert new users into sql table
// 


const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200
};

/*
var config = {
	user: 'sa',
	password: 'windows#42',
	server: 's-wdbaintern01',
	database: 'dbHockeyInfo'
};

*/



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


console.log("Starting get request");

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
			//console.log(req.headers);					
			
			request.input('username', sql.NVarChar(sql.MAX), req.body.team);
			request.input('password', sql.NVarChar(sql.MAX), req.body.password);
			request.input('email', sql.NVarChar(sql.MAX), req.body.email);
			request.input('time', sql.DateTime, new Date());

			request.query("INSERT INTO Accounts (username, password, email, timeStamp) VALUES (@username, @password, @email, @time)", function(err, result) {
				if ( err ) {
					throw err;
				}
				transaction.commit(err => {
					console.log("Transaction complete");
					res.send({status: 'Success'});
				});
			});
		});
	});
});