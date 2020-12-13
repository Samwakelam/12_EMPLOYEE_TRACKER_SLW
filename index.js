const inquirer = require('inquirer');
const mysql = require("mysql");

// My Pages 
const { viewEmployees, viewDepartments, viewJobRoles } = require('./javascript/views');
const { addNewDepartment, addNewRole, addNewEmployee } = require('./javascript/add');
const { removeDepartment, removeEmployee, removeExistingRole } = require('./javascript/remove');
const { updateExistingEmployee } = require('./javascript/update');

const con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: process.argv[2],
	database: "employeetracker",
});

const databaseConnection = () => {
	con.connect(function (err) {
		if (err) throw err;
		// console.log("database connected");
	});
	return console.log("database connected");
}


const mainMenu = () => {
	console.log("Welcome to McDuck Enterprises!");

	inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message: "What would you like to do today?",
				choices: [
					'Exit',
					'Open Departments',
					'Open Employees'
				],
			},
			{
				type: "list",
				name: "departments",
				message: "You have opened the departments functions: ",
				choices: [
					'Return',
					'Add new department',
					'Remove a department',
					'View departments',
					'Add a department job role',
					'Remove a job role', 
					'View job roles',
				],
				when: (answer) => answer.action === "Open Departments"
			},
			{
				type: "list",
				name: "employees",
				message: "You have opened employee functions: ",
				choices: [
					'Return',
					'Add new employee',
					'Updating existing employee',
					'Remove an Employee',
					'View employees'
				],
				when: (answer) => answer.action === "Open Employees"
			},
		])
		.then((choices) => { 
			// console.log("choices =", choices);

			if (choices.action === 'Exit') {
				console.log("Thank you for visiting McDuck Enterprises. We hope you enjouy your day.");
				return process.exit();

			} else if (choices.employees == 'Return' || choices.departments == 'Return') {
				return mainMenu(); // complete

			} else if (choices.action == 'Open Departments' && choices.departments == 'Add new department') {
				return addNewDepartment(); // complete

			} else if (choices.action == 'Open Departments' && choices.departments == 'Remove a department') {
				return removeDepartment(); // complete

			} else if (choices.action == 'Open Departments' && choices.departments == 'View departments') {
				return viewDepartments(); //complete

			} else if (choices.action == 'Open Departments' && choices.departments == 'Add a department job role') {
				return addNewRole(); //complete

			} else if (choices.action == 'Open Departments' && choices.departments == 'Remove a job role') {
				return removeExistingRole(); // complete 

			} else if (choices.action == 'Open Departments' && choices.departments == 'View job roles') {
				return viewJobRoles(); // complete



			} else if (choices.action == 'Open Employees' && choices.employees == 'Add new employee') {
				return addNewEmployee(); // complete

			} else if (choices.action == 'Open Employees' && choices.employees == 'Updating existing employee') {
				return updateExistingEmployee(); // needs update by department
				
			} else if (choices.action == 'Open Employees' && choices.employees == 'Remove an Employee') {
				return removeEmployee(); // complete - add feature if manager is fired. -

			} else if (choices.action == 'Open Employees' && choices.employees == 'View employees') {
				return viewEmployees(); // complete
			}

			// remove a job role
			// reassign employees 

		})
		.catch((error) => {
			console.log("error =", error);
			console.log("woops, something went wrong");
		})
}




async function init() {
	await databaseConnection();
	mainMenu();
	return;
}

init();

// module.exports = mainMenu; 
exports.mainMenu = mainMenu; 