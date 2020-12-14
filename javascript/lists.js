const mysql = require("mysql");

const con = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
  password: process.argv[2],
	database: "employeetracker",
});

let departmentList = [];
let managerList = [];
let roleList = [];
let employeeList = []; 

// ------------- Update Departments ---------------------------------------
// Uses only department name from the departments table and uploads it to a global variable. 
// -----------------------------------------------------------------------
const updateDepartmentList = () => {
	// console.log("department list updated");
	const depSql = 
		` SELECT depName FROM departments`;
	con.query( depSql, function(err, result){
		// console.log({result}); 
		result.forEach(value => {
			departmentList.push(value.depName)
		});
	});
};

// ------------- Update Managers ---------------------------------------
// Joins departments, employee and job role tables 
// to output employee's first, last name and the department that they lead
// then filters job title (not displayed) to managers only. 
// only the first and last names are added to the global variable. 
// -----------------------------------------------------------------------
const updateManagerList = () => {
	// console.log("manager list updated");
	const manSql = 
		`SELECT firstName, lastName, depName
		FROM employee AS emp
		INNER JOIN 
		jobRole AS jr
		ON jr.id = emp.jobRole_id 
		INNER JOIN
		departments AS dep
		ON dep.id = jr.departments_id
		WHERE jobTitle = 'manager'
		ORDER BY lastName `;
	con.query( manSql, function(err, result){
		// console.log({result}); 
		result.forEach(value => {
			managerList.push(value.firstName + " " + value.lastName);
		});
		// const noManager = "No Manager";
		// managerList.push(noManager); 
	});
};

// ------------- Update Job Role List -------------------------------------
// Uses job role table to display job title. 
// It then groups the titles so only one instance is shown in the list 
// -----------------------------------------------------------------------
const updateRoleList = () => {
	// console.log("role list updated");
	const roleSql = 
		` SELECT jobTitle FROM jobRole
		GROUP BY jobTitle
		ORDER BY jobTitle `;
	con.query( roleSql, function(err, result){
		// console.log({result}); 
		result.forEach(value => {
			roleList.push(value.jobTitle);
		});
	});
};

// ------------- Update Employee List ---------------------------------------
// uses only employee table
// to display the employees, Groups them by full name 
// to show only a single instance should an employee have two job roles. 
// -----------------------------------------------------------------------
const updateEmployeeList = () => {

	const empSql = 
		` SELECT firstName, lastName
		FROM employee
		GROUP BY firstName, lastName
		ORDER BY lastName `;
	con.query( empSql, function(err, result){
		// console.log({result}); 
		result.forEach(value => {
			employeeList.push(value.firstName + " " + value.lastName)
		});
	});
};

// const clearLists = () => {

// 	departmentList = [];
// 	managerList = [];
// 	roleList = [];
// 	employeeList = []; 
// }

// ------------- Update Lists ---------------------------------------
// Updates all lists when called by other functions 
// so there are no stray entries to choose from.
// -----------------------------------------------------------------------
const updateLists = () => {
	
		updateDepartmentList();
		updateManagerList();
		updateRoleList();
		updateEmployeeList();

}




exports.departmentList = departmentList;
exports.managerList = managerList;
exports.roleList = roleList;
exports.employeeList = employeeList;
// exports.clearLists = clearLists; 
exports.updateLists = updateLists;

