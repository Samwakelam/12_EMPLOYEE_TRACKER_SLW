const inquirer = require('inquirer');
const mysql = require("mysql");
const cTable = require('console.table');


//my Pages 
const {
  departmentList,
  managerList,
  roleList,
  employeeList,
  updateLists,
} = require('./lists');

const mainMenu = require('../index');
const { viewEmployees, viewDepartments, viewJobRoles } = require('./views');

const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Br@ntwood34",
    // password: process.argv[2],
    database: "employeetracker",
});

// ------------- Add Department ---------------------------------------
// Uses only departments
// requiers only a new string for department name 
// -----------------------------------------------------------------------
const addNewDepartment = () => {

    updateLists();
    inquirer
        .prompt([
            {
                type: "input",
                name: "newDep",
                message: "What Department would you like to create?"
            }
        ])
        .then((answer) => {
            console.log("answer =", answer);
            const ndSql =
                ` INSERT INTO departments (depName) VALUES ( '${answer.newDep}' ) `;
            console.log("ndSql =", ndSql);
            con.query(ndSql, function (err, result) {
                console.log("result.affectedRows =", result.affectedRows);
                console.log(`Your department, ${answer.newDep}, has been added`);
                viewDepartments();
                mainMenu.mainMenu();
            });
        })
        .catch((error) => {
            console.log("error =", error);
            console.log("woops, something went wrong");
        })

}

// ------------- add job role --------------------------------------------
// 2 Query
// 1. select all from departments to set department Id 
//    Uses for loop to match result to chosen department associated with new job role
// 2. insert job role - requiers job title string, salary integer and department id.
// -----------------------------------------------------------------------
const addNewRole = () => {

    updateLists();
    inquirer
        .prompt([
            {
                type: "input",
                name: "newRole",
                message: "What role would you like to create?"
            },
            {
                type: "list",
                name: "whichDep",
                message: "What Department would you like to add a new Role to?",
                choices: departmentList
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What Salary should this role have?",
                validate: function (value) {
                    if (parseInt(value)) {
                        return true;
                    }
                    return 'Please enter a valid number';
                },
            }
        ])
        .then((answer) => {
            // console.log("answer =", answer);
            const chosenDep = answer.whichDep;
            let depId = "";

            const idSql =
                ` SELECT * FROM departments `;
            con.query(idSql, function (err, result) {
                console.log("result =", result);
                for (i in result) {
                    if (result[i].depName == chosenDep) {
                        depId = result[i].id;
                    }
                    console.log("result[i].depName =", result[i].depName);
                    console.log({ depId });
                }

                const nrSql =
                    ` INSERT INTO jobrole (jobTitle, salary, departments_id) 
                    VALUES ( '${answer.newRole}', ${answer.roleSalary}, ${depId} );
                    `;
                // console.log("nrSql =", nrSql);
                con.query(nrSql, function (err, result) {
                    // console.log("result 2=", result);
                    // console.log("result.affectedRows =", result.affectedRows);
                    console.log(`Your Role, ${answer.newRole}, has been added to ${answer.whichDep}`);
                    viewJobRoles();
                    mainMenu.mainMenu();
                });
            });

        })
        .catch((error) => {
            console.log("error =", error);
            console.log("woops, something went wrong");
        })
}

// ------------- add employee --------------------------------------------
// 3 Query 
// 1. GETS - department name job title and job role id
//    JOINS - departments and jobrole fiters by job title 
//    SETS - role id 
// 2. GETS - employee first and last name, id and job title 
//    JOINS - employee and jobrole, filters jobtitle manager
//    SETS - if manager = yes, sets managers id for assigned manager and sql for 3rd call
//           if manager = no, sets sql for 3rd call
// 3. inserts new employee - requires first name, last name, job role, (specified by user if requiered manager id)
// -----------------------------------------------------------------------
const addNewEmployee = () => {

  updateLists();
  inquirer
    .prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "department",
            message: "Assign a department",
            choices: departmentList
        },
        {
            type: "list",
            name: "jobRole",
            message: "Assign a job role",
            choices: roleList
        },
        {
          type: "confirm",
          name: "haveManager",
          message: "Do you want to assign a manager?",
          default: "Yes"
        },
        {
            type: "list",
            name: "manager",
            message: "Assign a manager",
            choices: managerList,
            when: (answers) => answers.haveManager === true
        },
        // for some reason requiered a final question for the manager list to display choices variable.
        // creates an easy do over instead of starting full menu if a mistake is made. 
        {
          type: "confirm",
          name: "confirm",
          message: "correct? ",
          default: "Yes"
        }
    ])
    .then((answers) => {
      // console.log("answers =", answers);
      if (answers.confirm == false){
				newOrReturn();

      } else {
        let manId = "";
        let roleId = "";

        const depIdSql = 
          ` SELECT depName, jobTitle, jr.id
          FROM departments AS dep
          INNER JOIN
          jobrole AS jr
          ON jr.departments_id = dep.id
          WHERE jobTitle = '${answers.jobRole}' `;
        con.query(depIdSql, function(err, result){
          // console.log("result 1=", result); 
          for (const i in result) {
            if (result[i].depName == answers.department) {
              roleId = result[i].id;
            }
          };
          //   console.log({roleId});
          
          const manSql =
            ` SELECT emp.id, firstName, lastName, jobTitle 
            FROM employee AS emp
            INNER JOIN 
            jobrole AS jr
            ON jr.id = emp.jobRole_id
            WHERE jobTitle = 'manager' `;
          con.query(manSql, function(err, result){
            // console.log("result 2=", result); 

            let neSql = ``;
            if(answers.haveManager === "No"){
              neSql = `INSERT INTO employee (firstName, lastName, jobRole_id) VALUES ('${answers.firstName}',"${answers.lastName}",${roleId})`;

            } else if(answers.haveManager === true){
              for (const j in result) {
                if ((result[j].firstName + " " + result[j].lastName) == answers.manager) {
                  manId = result[j].id;
                }
              };
              neSql = `INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ('${answers.firstName}',"${answers.lastName}",${roleId},${manId})`;
            };
            // console.log({manId});
            //   console.log({neSql});

            con.query(neSql, function(err, result, fields){
              // console.log("result 3=", result);
              console.log(`You have added the employee ${answers.firstName} ${answers.lastName}. `)
              viewEmployees();
            })
          })
        })
      }
    })
    .catch((error) => {
        console.log("error =", error);
        console.log("woops, something went wrong");
    });
}

// ------------- new or return  ---------------------------------------
// function requiered if new employee is selected incorrect
// where to go? redo or exit activity 
// -----------------------------------------------------------------------
const newOrReturn = () => {

	inquirer
		.prompt([
			{
				type: "list",
				name: "doOver", 
				message: "Keep adding new employee?",
				choices: ["Yes", "Return to main menu"]
			}
		])
		.then(answer => {
			switch (answer.doOver){
				case "Yes":
					addNewEmployee();
					break;

				case "Return to main menu":
					mainMenu.mainMenu();
					break;
			}
		})
		.catch((error) => {
			console.log("error =", error);
			console.log("woops, something went wrong");
	});
}


exports.addNewDepartment = addNewDepartment;
exports.addNewEmployee = addNewEmployee;
exports.addNewRole = addNewRole; 