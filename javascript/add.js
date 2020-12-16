const inquirer = require('inquirer');
const mysql = require("mysql");
const cTable = require('console.table');
const dotenv = require('../config/dotenv');


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
  // password: dotenv.PASSWORD,
  password: process.argv[2],
  database: "employeetracker",
});

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
      switch (answer.doOver) {
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
      // console.log("answer =", answer);
      const ndSql =
        ` INSERT INTO departments (depName) VALUES ( '${answer.newDep}' ) `;
      console.log("ndSql =", ndSql);
      con.query(ndSql, function (err, result) {
        // console.log("result.affectedRows =", result.affectedRows);
        console.log(`Your department, ${answer.newDep}, has been added`);
        viewDepartments();

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
        choices: departmentList,
        loop: false,
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
        // console.log("result =", result);
        for (i in result) {
          if (result[i].depName == chosenDep) {
            depId = result[i].id;
          }
          // console.log("result[i].depName =", result[i].depName);
          // console.log({ depId });
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
        });
      });
    })
    .catch((error) => {
      console.log("error =", error);
      console.log("woops, something went wrong");
    })
}

// ------------- add employee --------------------------------------------
// 0 Query 
// 1. GETS details for the new employee and the department, 
//    uses further fucntions to assign jobrole and manager
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
        choices: departmentList,
        loop: false,
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
      // console.log("add an employee answers =", answers);
      if (answers.confirm == false) {
        newOrReturn();

      } else {
        const newEmployee = {
          firstName: answers.firstName,
          lastName: answers.lastName,
          department: answers.department
        }
        availableJobroles(newEmployee);

      }
    })
    .catch((error) => {
      console.log("error =", error);
      console.log("woops, something went wrong");
    });
}

// ------------- available job roles --------------------------------------------
// 2 Query 
// 1. GETS job roles within the chosen department
//    nested questions ask which role or directs to create a role. 
// -----------------------------------------------------------------------
const availableJobroles = (questionResults) => {

  const { department } = questionResults;
  console.log("question results", questionResults); 

  let availableJobroles = [];

  // gets the job roles associated with the chosen department. 
  const getAJrSql =
    ` SELECT jobTitle
      FROM jobrole AS jr
      INNER JOIN 
      departments AS dep 
      ON jr.departments_id = dep.id 
      WHERE depName = '${department}' 
      GROUP BY jobtitle`

  con.query(getAJrSql, async function (err, result) {
    // console.log("available job roles result =", result);
    result.forEach((value) => {
      availableJobroles.push(value.jobTitle);
    });

    availableJobroles.push("Add new role");
    // console.log("availableJobroles =", availableJobroles);

    if (availableJobroles.length < 1) {
      console.log("You have no job roles available in this department. Please create one before continuing.");
      addNewRole();

    } else {

      await inquirer
        .prompt([
          {
            type: "list",
            name: "jobRole",
            message: "Which Job role would you like to assign in this department?",
            choices: availableJobroles,
            loop: false
          }
        ])
        .then(ans => {
          // console.log("job roles ans =", ans);
          if (ans.jobRole == "Add new role") {
            console.log("You will be returned to the main menu after adding your role. ");
            addNewRole();

          } else {
            const jobroleIdSql =
              ` SELECT depName, dep.id AS depid, jobTitle, jr.id
                FROM departments AS dep
                INNER JOIN
                jobrole AS jr
                ON jr.departments_id = dep.id
                WHERE (jobTitle, depName) = ('${ans.jobRole}', '${department}') `;
            con.query(jobroleIdSql, function (err, result) {
              // console.log("job role id sql result=", result);
              roleId = result[0].id;

              questionResults.depId = result[0].depid;
              questionResults.jobTitle = result[0].jobTitle;
              questionResults.jobId = result[0].id;

              availableManagers(questionResults);
            })
          }
        })
        .catch((error) => {
          console.log("error =", error);
          console.log("woops, something went wrong");
        });
    }
  });
}

const availableManagers = (questionResults) => {
  // console.log("available managers question results =", questionResults);

  const { department } = questionResults;

  let availableManagers = [];

  const getManagersSql =
    `SELECT depName, jobTitle, jr.id AS jrid, firstName, lastname, emp.id AS manid
    FROM departments AS dep
    INNER JOIN
    jobrole AS jr
    ON jr.departments_id = dep.id
    INNER JOIN
    employee AS emp
    ON emp.jobRole_id = jr.id
    WHERE (depName, jobTitle)= ('${department}', 'manager')`;
  con.query(getManagersSql, function (err, result) {
    // console.log("get manager sql result =", result);
    if (result.length < 1) {
      console.log("There are no managers in this departent");
      availableMangers.push("None Available");
    } else {
      for (i in result) {
        availableManagers.push(result[i].firstName + " " + result[i].lastname);
      }
      // console.log("available managers =", availableManagers);
    }

    inquirer
      .prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "Do you want to assign a manager?",
          default: "Yes",
        },
        {
          type: "list",
          name: "manager",
          message: "Managers in this department:",
          choices: availableManagers,
          loop: false,
          when: (answer) => answer.confirm === true,
        },
        {
          type: "list",
          name: "okay",
          message: "You have assigned a manager",
          choices: ["Okay"],
          loop: false,
          when: (answer) => answer.confirm === true,
        },
      ])
      .then((answer) => {
        console.log("available managers answer =", answer);

        if (answer.confirm == false) {
          questionResults.newManager = "No Manager"
          // console.log("questionResults without manager =", questionResults);
          insertIntoDB(questionResults);

        } else {
          questionResults.newManager = answer.manager
          const [eFname, eLname] = answer.manager.split(' ');

          const getManagerIdsQL =
            `SELECT * FROM employee WHERE (firstName, lastName) = ('${eFname}','${eLname}')`;

          con.query(getManagerIdsQL, function (err, result) {
            // console.log({ result });
            questionResults.newManagerId = result[0].id;
            // console.log("questionResults with manager =", questionResults);
            insertIntoDB(questionResults);
          });
        }

      })
      .catch((error) => {
        console.log("error =", error);
        console.log("woops, something went wrong");
      });
  });
}



const insertIntoDB = (questionResults) => {

  const { firstName, lastName, jobId, newManager, newManagerId } = questionResults;

  if (questionResults.newManager == "No Manager") {

    const inNoManSql =
      `INSERT INTO employee 
      (firstName, lastName, jobRole_id) 
      VALUES ( "${firstName}", "${lastName}", ${jobId} ) `;

    con.query(inNoManSql, function (err, result) {
      // console.log({ result });

      // check that update has been made 
      if (result.affectedRows == 1) {
        console.log(` ${firstName} ${lastName} has been assigned the manager ${newManager}`)
        viewEmployees();

      } else {
        console.log("Update not been made, please check and try again");
        viewEmployees();
      }
    })

  } else {
    const inYesManSql =
      `INSERT INTO employee 
      (firstName, lastName, jobRole_id, manager_id) 
      VALUES ( "${firstName}", "${lastName}", ${jobId}, ${newManagerId}); `;

    con.query(inYesManSql, function (err, result) {
      // console.log({ result });
      // check that update has been made 
      if (result.affectedRows == 1) {
        console.log(` ${firstName} ${lastName} has been assigned the manager ${newManager}`)
        viewEmployees();

      } else {
        console.log("Update not been made, please check and try again");
        viewEmployees();
      }
    });

  }
}


exports.addNewDepartment = addNewDepartment;
exports.addNewEmployee = addNewEmployee;
exports.addNewRole = addNewRole;