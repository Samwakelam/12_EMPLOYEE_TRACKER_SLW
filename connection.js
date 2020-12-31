const mysql = require('mysql'); 
require('dotenv').config(); 

const con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: process.env.PASSWORD,
  // password: process.argv[2],
	database: "employeetracker",
});

const databaseConnection = () => {
	con.connect(function (err) {
		if (err) throw err;
		// console.log("database connected");
	});
	return console.log("database connected");
}

exports.databaseConnection = databaseConnection; 
exports.con = con; 