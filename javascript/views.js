const inquirer = require('inquirer');
const mysql = require("mysql");
const cTable = require('console.table');
const mainMenu = require('../index'); 

//my Pages 
const {
  departmentList,
  managerList,
  roleList,
  employeeList,
  updateLists,
} = require('./lists');

const con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Br@ntwood34",
	// password: process.argv[2],
	database: "employeetracker",
});

// ------------- View employees ---------------------------------------
// Joins 3 tables in variation, departments, employee and job role
// displays differently depending on selection in questions...
// -----------------------------------------------------------------------
const viewEmployees = () => {

	updateLists();
	
	inquirer
		.prompt([
			{
				type: "list",
				name: "viewBy",
				message: "How would you like to view your employees?",
				choices: [
					'By Department', // department roles and employees
					'By Manager', // employee and their manager
					'By Job Role', // department roles and employees
					'By Employee', // employee and job title
					'View All' // employee and their job title 
				],
			},
			{
				type: "list",
				name: 'filterDep',
				message: 'Filter by department:',
				choices: departmentList,
				when: (answer) => answer.viewBy === "By Department"
			},
			{
				type: "list",
				name: 'filterMan',
				message: 'Filter by Manager:',
				choices: managerList,
				when: (answer) => answer.viewBy === "By Manager"
			},
			{
				type: "list",
				name: 'filterJob',
				message: 'Filter by Job Role:',
				choices: roleList,
				when: (answer) => answer.viewBy === "By Job Role"
			},
			{
				type: "list",
				name: 'filterEmp',
				message: 'Filter by employee:',
				choices: employeeList,
				when: (answer) => answer.viewBy === "By Employee"
			},
		])
		.then((choice) => {
			console.log("choice =", choice);

			switch (choice.viewBy) {
				// ------------- View all ---------------------------------------
				// joins 3 - displays all data for each employee  
				// -----------------------------------------------------------------------
				case 'View All':
					const vaSql =
						`SELECT firstName, lastName, depName, jobTitle, salary, emp.id
						FROM employee AS emp
						INNER JOIN 
						jobRole AS jr
						ON jr.id = emp.jobRole_id 
						INNER JOIN
						departments AS dep
						ON dep.id = jr.departments_id 
						ORDER BY lastName`;
					con.query(vaSql, function (err, result) {
						// console.log({result});
						let display = [];
						result.forEach((value) => {
							display.push(
								{
									'Name': value.firstName + " " + value.lastName,
									'Department': value.depName,
									'Job Title': value.jobTitle,
									'Employee id': value.id
								}
							)
						});
						console.table(display);
						mainMenu.mainMenu();
					});
					break;
					
				// ------------- view by department ---------------------------------------
				// As view all with additional filter of department name
				// WHERE must come before OREDER BY 
				// -----------------------------------------------------------------------
				case 'By Department':
					const vbDepSql =
						`SELECT firstName, lastName, depName, jobTitle, salary, emp.id
						FROM employee AS emp
						INNER JOIN 
						jobRole AS jr
						ON jr.id = emp.jobRole_id 
						INNER JOIN
						departments AS dep
						ON dep.id = jr.departments_id 
						WHERE depName = '${choice.filterDep}'
						ORDER BY lastName `;
					// console.log ("vbDepSql =", vbDepSql);
					con.query(vbDepSql, function (err, result) {
						// console.log({result});
						let display = [];
						result.forEach((value) => {
							// console.log({value});
							display.push(
								{
									'Name': value.firstName + " " + value.lastName,
									'Job Title': value.jobTitle,
									'Salary' : value.salary,
									'Employee id': value.id
								}
							)
						});
						console.table(display);
						mainMenu.mainMenu();
					});
					break;

				// ------------- View by manager ---------------------------------------
				// join 2 - employee twice and job role table. 
				// Must ddefine each use of employee table 
				// displays first and last names of both manager and employee
				// plus employee job title salary and id. 
				// filtered by manager name chosen. 
				// -----------------------------------------------------------------------
				case 'By Manager':
					const [mFname, mLname] = choice.filterMan.split(' ');
					// console.log({fname});
					// console.log({lname});
					const vbManSql =
						`SELECT empM.firstName, empM.lastName, empE.firstName , empE.lastName, jobTitle, salary, empE.id
						FROM employee AS empE
						INNER JOIN 
						employee AS empM
						ON empE.manager_id = empM.id 
						INNER JOIN
						jobRole AS jr 
						ON empE.jobRole_id = jr.id
						WHERE (empM.firstName, empM.lastName) = ('${mFname}', '${mLname}') `;
					// console.log ("vbEmpSql =", vbEmpSql);
					con.query(vbManSql, function (err, result) {
						// console.log({result});
						let display = [];
						result.forEach((value) => {
							// console.log({value});
							display.push(
								{
									'Name': value.firstName + " " + value.lastName,
									'Department': value.depName,
									'Job Title': value.jobTitle,
									'Salary' : value.salary,
									'Employee id': value.id
								}
							)
						});
						console.table(display);
						mainMenu.mainMenu();
					});
					break;

				// ------------- view by job role ---------------------------------------
				// As view all with additional filter of job title 
				// -----------------------------------------------------------------------
				case 'By Job Role': 
					const vbJrSql =
						`SELECT firstName, lastName, depName, jobTitle, salary, emp.id
						FROM employee AS emp
						INNER JOIN 
						jobRole AS jr
						ON jr.id = emp.jobRole_id 
						INNER JOIN
						departments AS dep
						ON dep.id = jr.departments_id 
						WHERE jobTitle = '${choice.filterJob}'
						ORDER BY lastName `;
					// console.log ("vbDepSql =", vbDepSql);
					con.query(vbJrSql, function (err, result) {
						// console.log({result});
						let display = [];
						result.forEach((value) => {
							// console.log({value});
							display.push(
								{
									'Name': value.firstName + " " + value.lastName,
									'Department': value.depName,
									'Salary' : value.salary,
									'Employee id': value.id
								}
							)
						});
						console.table(display);
						mainMenu.mainMenu();
					});
					break;

				// ------------- View by employee ---------------------------------------
				// AS view all with additional filter of full name
				// filter with double parameter for WHERE section.  
				// -----------------------------------------------------------------------
				case 'By Employee':
					const [eFname, eLname] = choice.filterEmp.split(' ');
					// console.log({fname});
					// console.log({lname});
					const vbEmpSql =
						`SELECT firstName, lastName, depName, jobTitle, salary, emp.id
						FROM employee AS emp
						INNER JOIN 
						jobRole AS jr
						ON jr.id = emp.jobRole_id 
						INNER JOIN
						departments AS dep
						ON dep.id = jr.departments_id 
						WHERE (firstName, lastName) = ('${eFname}', '${eLname}')
						ORDER BY lastName `;
					// console.log ("vbEmpSql =", vbEmpSql);
					con.query(vbEmpSql, function (err, result) {
						// console.log({result});
						let display = [];
						result.forEach((value) => {
							// console.log({value});
							display.push(
								{
									'Name': value.firstName + " " + value.lastName,
									'Department': value.depName,
									'Job Title': value.jobTitle,
									'Salary' : value.salary,
									'Employee id': value.id
								}
							)
						});
						console.table(display);
						mainMenu.mainMenu();
					});
					break;
			}
		})
		.catch((error) => {
			console.log("error =", error);
			console.log("woops, something went wrong");
			return;
		});
}

// ------------- View Departments ---------------------------------------
// Displays department id and name, then the employee count. 
// LEFT JOIN departments, jobrole , employee 
// GROUP by department name and COUNT by employee first name
// counting by first name allows for any departments with a 0 count. 
// -----------------------------------------------------------------------
const viewDepartments = () => {
	const depSql = 
		` SELECT dep.id, depName, count(firstName)
		FROM departments AS dep
		LEFT JOIN 
		jobRole AS jr
		ON jr.departments_id = dep.id
		LEFT JOIN
		employee AS emp
		ON emp.jobRole_id = jr.id
		GROUP BY depName `;
	con.query( depSql, function(err, result){
		// console.log({result}); 
		let display = [];
		result.forEach(value => {
			display.push(
				{
					'Department': value.depName,
					'id': value.id,
					'Employee Count': value['count(firstName)']
				}
			)
		});
		console.table(display);
		mainMenu.mainMenu();
	});
}

// ------------- view Job roles ---------------------------------------
// Display job title and employee count 
// LEFT JOIN departments, jobrole, employee
// GROUP BY job title, COUNT by first name 
// -----------------------------------------------------------------------
const viewJobRoles = () => {
	const jrSql = 
		` SELECT jobTitle, count(firstName) 
		FROM departments AS dep 
		LEFT JOIN 
		jobRole AS jr
		ON dep.id = jr.departments_id
    LEFT JOIN 
    employee AS emp
    ON jr.id = emp.jobRole_id
    GROUP BY jobTitle `;
	con.query( jrSql, function(err, result){
		// console.log({result}); 
		let display = [];
		result.forEach(value => {
			display.push(
				{
					'Job Title': value.jobTitle,
					'Employee Count': value['count(firstName)']
				}
			)
		});
		console.table(display);
		mainMenu.mainMenu();
	});
}


exports.viewEmployees = viewEmployees;
exports.viewDepartments = viewDepartments;
exports.viewJobRoles = viewJobRoles;