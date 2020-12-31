// connection
const {con, databaseConnection} = require('../connection');


// ------------- Update Departments ---------------------------------------
// Uses only department name from the departments table and uploads it to a local variable.
// Uses Promise to await the updated list in the inquirer prompt calling the function.  
// -----------------------------------------------------------------------
const updateDepartmentList = () => {
	// console.log("department list updated");
	let departmentList = []; 

	return new Promise((resolve, reject) => {
		const depSql = 
		` SELECT depName FROM departments`;
		con.query( depSql, function(err, result){
			// console.log({result}); 
			if (err){
				reject(console.log('Error while updating department list.'))
			} else {
				result.forEach(value => {
					if(value.depName !== 'HR'){
						departmentList.push(value.depName);
					}
				});
				resolve(departmentList);
			}
		});
	})
};

// ------------- Update Managers ---------------------------------------
// Joins departments, employee and job role tables 
// to output employee's first, last name and the department that they lead
// then filters job title (not displayed) to managers only. 
// only the first and last names are added to the global variable. 
// Uses Promise to await the updated list in the inquirer prompt calling the function.  
// -----------------------------------------------------------------------
const updateManagerList = () => {
	// console.log("manager list updated");
	let managerList = [];

	return new Promise((resolve, reject) => {
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
			if (err){
				reject(Console.log("Error updating the Manager List. ")); 
		
			} else {
				result.forEach(value => {
					managerList.push(value.firstName + " " + value.lastName);
				});
				const noManager = "No Manager";
				managerList.push(noManager); 
				resolve(managerList); 
		
			}
		});
	});
	
};

// ------------- Update Job Role List -------------------------------------
// Uses job role table to display job title. 
// It then groups the titles so only one instance is shown in the list 
// Uses Promise to await the updated list in the inquirer prompt calling the function.  
// -----------------------------------------------------------------------
const updateRoleList = () => {
	// console.log("role list updated");

	let roleList = []; 

	return new Promise((resolve, reject) => {
		const roleSql = 
		` SELECT jobTitle FROM jobRole
		GROUP BY jobTitle
		ORDER BY jobTitle `;
		con.query( roleSql, function(err, result){
			// console.log({result}); 
			if (err){
				resolve(console.log("Error updating Role List."));
		
			} else {
				result.forEach(value => {
					roleList.push(value.jobTitle);
				});
				resolve(roleList);
		
			}
		});
	})
	
};

// ------------- Update Employee List ---------------------------------------
// uses only employee table
// to display the employees, Groups them by full name 
// to show only a single instance should an employee have two job roles. 
// Uses Promise to await the updated list in the inquirer prompt calling the function.  
// -----------------------------------------------------------------------
const updateEmployeeList = () => {

	let employeeList = []; 

	return new Promise((resolve, reject) => {
		const empSql = 
		` SELECT firstName, lastName
		FROM employee
		GROUP BY firstName, lastName
		ORDER BY lastName `;
		con.query( empSql, function(err, result){
			// console.log({result}); 
			if(err){
				reject(console.log("Error updating Employee list. "));
		
			} else {
				result.forEach(value => {
					employeeList.push(value.firstName + " " + value.lastName)
				});
				resolve(employeeList); 
		
			}
		});
	});

};

// const clearLists = () => {
// 	departmentList = [];
// 	managerList = [];
// 	roleList = [];
// 	employeeList = [];

// 	return [departmentList, managerList, roleList, employeeList]; 
// }

// ------------- Update Lists ---------------------------------------
// Updates all lists when called by other functions 
// so there are no stray entries to choose from.
// -----------------------------------------------------------------------
// const updateLists = async () => {

// 	await clearLists(); 
	
// 	await updateDepartmentList();
// 	await	updateManagerList();
// 	await	updateRoleList();
// 	await	updateEmployeeList();

// }




// exports.departmentList = departmentList;
// exports.managerList = managerList;
// exports.roleList = roleList;
// exports.employeeList = employeeList;

exports.updateDepartmentList = updateDepartmentList;
exports.updateManagerList = updateManagerList;
exports.updateRoleList = updateRoleList; 
exports.updateEmployeeList = updateEmployeeList;

// exports.clearLists = clearLists; 
// exports.updateLists = updateLists;

