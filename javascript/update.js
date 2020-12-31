// connection
const {con, databaseConnection} = require('../connection');

//  modules
const inquirer = require('inquirer');
const cTable = require('console.table');

//my Pages 
const {
  // departmentList,
  // managerList,
  // roleList,
  // employeeList,
  updateDepartmentList,
  updateManagerList,
  updateRoleList,
  updateEmployeeList,
  // clearLists,
  // updateLists,
} = require('./lists');

const mainMenu = require('../index');
const { viewEmployees, viewDepartments, viewJobRoles } = require('./views');
const { addNewRole } = require('./add');


// ------------- Update Existing Employee  ---------------------------------------
// Asks what to update, manager job role and department? 
// Splits awnsers into distributable variable 
// 1 Querey + spliting functions to update manager, job role and department
// -----------------------------------------------------------------------
const updateExistingEmployee = async () => {

  await inquirer
    .prompt([
      {
        type: "list",
        name: "reason",
        message: "Why are you updating an employee?",
        choices: ["Woops, please return", "Promotion", "Reassignment", "Incorrect entry"]
      },
      {
        type: "list",
        name: "employee",
        message: "Which employee are you updating?",
        choices: await updateEmployeeList,
      },
      {
        type: "list",
        name: "section",
        message: "What part do you want to update?",
        choices: ["Department", "Job role", "Manager"]
      },
      {
        type: "confirm",
        name: "managerConfirm",
        message: "Will they have a manager?",
        default: "Yes",
        when: (answers) => answers.section === "Manager"
      },
      {
        type: "list",
        name: "newManager",
        message: "Who is there new manager",
        choices: await updateManagerList,
        when: (answers) => answers.managerConfirm === true
      },
      {
        type: "list",
        name: "department",
        message: "Pick a department:",
        choices: await updateDepartmentList,
        when: (answers) => answers.section === "Department"
      },
      {
        type: "list",
        name: "jobrole",
        message: "Pick a jobrole:",
        choices: await updateRoleList,
        when: (answers) => answers.section === "Job role"
      },
      {
        type: "confirm",
        name: "confirm",
        message: "Is this correct before continuing? ",
        default: "Yes"
      }
    ])
    .then(answers => {
      // console.log("update existing employee answers =", answers);

      if (answers.confirm == false) {
        newOrReturn();

        // If the user did not mean to update employee they can retrun from option
      } else if (answers.reason == "Woops, please return") {
        mainMenu.mainMenu();

      } else {
        // distributable variable  created from available answers. 
        const [eFname, eLname] = answers.employee.split(' ');
        let questionAnswers = {
          reason: answers.reason,
          firstName: eFname,
          lastName: eLname,
          newJobRole: answers.jobrole,
          newManager: answers.newManager,
          newDepartment: answers.department
        }

        // if the option not to have a manager is selected 
        if (answers.managerConfirm == false) {
          questionAnswers.newManager = "No Manager";
        }

        // missing data is retrieved from database based on answers obtianed from the user regarding chosen employee to update
        const setEmpSql =
          ` SELECT firstName, lastName, depName, dep.id AS depId, jobTitle, salary, emp.id AS empId, manager_id AS manId
          FROM employee AS emp
          INNER JOIN 
          jobRole AS jr
          ON jr.id = emp.jobRole_id 
          INNER JOIN
          departments AS dep
          ON dep.id = jr.departments_id 
          WHERE (firstName, lastName) = ('${eFname}','${eLname}')`

        con.query(setEmpSql, function (err, result) {
          // console.log("update existing employee result =", result);

          // distributable variable updated with database information. 
          questionAnswers.empId = result[0].empId;
          questionAnswers.currentManagerId = result[0].manId;
          questionAnswers.currentDepartment = result[0].depName;
          questionAnswers.currentDepId = result[0].depId;
          // console.log("questionAnswers updated 1st SQL call=", questionAnswers);

          // function is called deppending how the user wants to change the employee. 
          switch (answers.section) {
            case "Department":
              // console.log("Passed to update department function");
              updateDepartment(questionAnswers);
              break;

            case "Job role":
              // console.log("Passed to update job role function");
              updateJobRole(questionAnswers);
              break;

            case "Manager":
              // console.log("Passed to update manager function");
              updateManager(questionAnswers);
              break;
          }
        })
      }
    })
    .catch((error) => {
      console.log("error =", error);
      console.log("woops, something went wrong");
    });
};

// ------------- Update job role  ---------------------------------------
// 2 Query + nested questions 
// 1.  get the job role information
// 2. update the employee job role
//
//    checks if the manager needs to be changed where deparments have been reassigned automatically
// -----------------------------------------------------------------------
const updateJobRole = (questionResults) => {
  // console.log(" update job role questionResults =", questionResults);

  // deconstructing distributable variable to easily usable variables. 
  const { newJobRole, empId, currentDepId } = questionResults;

  // getting the data for the NEW JOB ROLE required => 
  // job role id, title and department_id. 
  const jrIdSql =
    ` SELECT * FROM jobrole WHERE jobTitle = '${newJobRole}' `;

  con.query(jrIdSql, function (err, result) {
    // console.log(" Update Job role result 1st SQL = ", result);

    // set the new department_id from SQL result
    const newDepId = result[0].departments_id;

    // UPDATE the employee with the new job role
    const jrUpSql =
      ` Update employee SET jobRole_id = ${result[0].id} WHERE id = ${empId} `;

    con.query(jrUpSql, async function (err, result) {
      // console.log(" Update Job role result 2nd SQL = ", result);
      // console.log(newDepId == currentDepId);

      // Check to see if the new job role is in a different department. 
      //If it is not the employee may need a new manager too. 
      if (newDepId == currentDepId) {
        viewEmployees();

      } else {
        console.log("Your employee's Department has changed!");

        await inquirer
          .prompt([
            {
              type: "confirm",
              name: "changeManager",
              message: "Do you want to change thier manager to?",
              default: "Yes"
            },
            {
              type: "confirm",
              name: "managerConfirm",
              message: "Will they have a manager?",
              default: "Yes",
              when: (answer) => answer.changeManager === true
            },
            // list question will not run unless there is a final question following it. 
            {
              type: "list",
              name: "newManager",
              message: "Who is there new manager",
              choices: await updateManagerList,
              when: (answer) => answer.managerConfirm === true
            },
            {
              type: "confirm",
              name: "detailsConfirm",
              message: "please confirm the details are correct?",
              default: "Yes",
            }
          ])
          .then(confirm => {
            if (confirm.detailsConfirm == false) {
              // console.log("Restarted jobrole function");
              updateJobRole(questionResults);

            } else if (confirm.changeManager == true && confirm.managerConfirm == true) {
              //if they do want to change manager and there will STILL be a manager
                // set manager to new chosen manager and start update manager
                questionResults.newManager = confirm.newManager;
                // console.log("question results manager update =", questionResults);
                // console.log("Passed to update manager function");
                updateManager(questionResults);

                //if they do want to change manager and there will NOT be a manager 
            } else if (confirm.changeManager == true && confirm.managerConfirm == false) {
                // set manager to new chosen manager and start update manager
                questionResults.newManager = "No Manager";
                // console.log("question results manager update =", questionResults);
                // console.log("Passed to update manager function");
                updateManager(questionResults);

                //if they do NOT want to change manager
            } else {
                console.log("You have chosen NOT to change the employee's manager.")
                viewEmployees();
            }
            
          })
          .catch((error) => {
            console.log("error =", error);
            console.log("woops, something went wrong");
          });
      }

    });
  });
}

// ------------- Update Manager   ---------------------------------------
// 1 Query repeated + 2nd Querey + nested questions 
// 1. checks to see if there will be a manager and updates NULL if there is not 
// 2. If there is a manager, GET - manager details 
//    checks if the chosen manager is the same as the current and asks if there should be a swap out. 
//    query 1 repeated if manager is swaped out for no manager
//
//    checks if the manager needs to be changed where deparments have been reassigned automatically
// -----------------------------------------------------------------------
const updateManager = (questionResults) => {
  // console.log(" update manager questionResults =", questionResults);

  // destructure
  let { newManager, currentManagerId, empId } = questionResults;

  if (newManager == "No Manager") {
    const upNoManSql1 =
      `UPDATE employee SET manager_id = NULL 
      WHERE id = ${questionResults.empId} `;

    con.query(upNoManSql1, function (err, result) {
      // console.log({ result });

      // check that update has been made 
      if (result.affectedRows == 1) {
        console.log(` ${questionResults.firstName} ${questionResults.lastName} has been assigned the manager ${newManager}`)
        viewEmployees();

      } else {
        console.log("Update not been made, please check and try again");
        viewEmployees();
      }
    });

  } else {
    // gets the manager's details first name, last name, department and id
    const managerSql =
      ` SELECT firstName, lastName, depName, emp.id AS empId, dep.id AS depId
    FROM employee AS emp
    INNER JOIN 
    jobrole AS jr
    ON jr.id = emp.jobRole_id
    INNER JOIN 
    departments AS dep 
    ON dep.id = jr.departments_id
    WHERE jobTitle = 'manager' `;

    con.query(managerSql, async function (err, result) {
      // console.log(" update manager results =", result);

      let newManagerId = "";
      // mathes the chosen manager with all manager details in system to return just the required manager. 
      for (i in result) {
        if ((result[i].firstName + " " + result[i].lastName) == newManager) {
          // console.log("result[i] =", result[i]);
          newManagerId = result[i].empId;
        }
      };

      // if the new manager and the old manager are the same ... 
      // if statments uses the ids to compare change if any. 
      if (newManagerId == currentManagerId) {
        console.log("That is their current Manager");

        await inquirer
          .prompt([
            {
              type: "confirm",
              name: "diffManager",
              message: "Do you want to choose a different manager?",
              default: "Yes"
            },
            {
              type: "confirm",
              name: "managerConfirm",
              message: "Will they have a manager?",
              default: "Yes",
              when: (answer) => answer.diffManager === true
            },
            {
              type: "list",
              name: "newManager",
              message: "Who is there new manager",
              choices: await updateManagerList,
              when: (answer) => answer.managerConfirm === true
            },
            {
              type: "confirm",
              name: "confirm",
              message: "Is this correct before continuing?",
              default: "Yes"
            }
          ])
          .then((answer) => {

            if (answer.confirm == false) {
              updateManager(questionResults);


              // if they do NOT want a new manager
            } else if (answer.diffManager == false) {
              console.log(`The employee is still managed by ${newManager}`);
              mainMenu.mainMenu();

              // if they do want a new manager and there will STILL be a manager 
            } else if (answer.diffManager == true && answer.managerConfirm == true) {
              questionResults.newManager = answer.newManager;
              // console.log("question results manager update =", questionResults);
              // restarts update manager with new manager choice. 
              // console.log("You have restarted manager update function");
              updateManager(questionResults);

              // if they do want to change the manager and there will NOT be a manager 
            } else {

              const upNoManSql =
                `UPDATE employee SET manager_id = NULL 
                  WHERE id = ${questionResults.empId} `;

              con.query(upNoManSql, function (err, result) {
                // console.log({ result });

                // check that update has been made 
                if (result.affectedRows == 1) {
                  console.log(` ${questionResults.firstName} ${questionResults.lastName} has been assigned the manager ${newManager}`)
                  viewEmployees();

                } else {
                  console.log("Update not been made, please check and try again");
                  viewEmployees();
                }
              });
            }
          })
          .catch((error) => {
            console.log("error =", error);
            console.log("woops, something went wrong");
          });

        // if the new manager and the current manager are different update the employee record with the new manager
      } else {
        const upEmpSql =
          `UPDATE employee SET manager_id = ${newManagerId}
          WHERE id = ${empId} `;

        con.query(upEmpSql, function (err, result) {
          // console.log({ result });
          // check that update has been made 
          if (result.affectedRows == 1) {
            console.log(` ${questionResults.firstName} ${questionResults.lastName} has been assigned the manager ${newManager}`);
            viewEmployees();
          } else {
            console.log("Update not been made, please check and try again");
            viewEmployees();
          }
        });
      }
    });
  }
}

// ------------- Update Department ---------------------------------------
// 1 Query + nested questions 
// 1. GET the job roles associated with the chosen department
//    JOIN job role and department tables to trace department id and name to job role. 
// 
// asks you to choose a job role under that department and sends you to update jobrole which will check managers etc. 
// -----------------------------------------------------------------------
const updateDepartment = (questionResults) => {
  //  console.log("questionResults", questionResults); 
  const { newDepartment } = questionResults;
  let newDepId = "";

  const newDepIdSql =
    `SELECT * FROM departments
    WHERE depName = '${newDepartment}' `;

  con.query(newDepIdSql, function (err, result) {
    // console.log("update department result =", result);
    newDepId = result[0].id;

    let availableJobroles = [];
    // gets the job roles associated with the chosen department. 
    const getAJrSql =
      ` SELECT jobTitle
      FROM jobrole AS jr
      INNER JOIN 
      departments AS dep 
      ON jr.departments_id = dep.id 
      WHERE depName = '${newDepartment}' 
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
          .then(answer => {
            // console.log("job roles answer =", answer);
            if (answer.jobRole == "Add new role") {
              console.log("You will be returned to the main menu after adding your role. ");
              addNewRole();
            } else {
              questionResults.newJobRole = answer.jobRole;
              // console.log("questionResults update =", questionResults); 
              // console.log("You have been passed to the update job role function");
              updateJobRole(questionResults);
            }
          })
          .catch((error) => {
            console.log("error =", error);
            console.log("woops, something went wrong");
          });

      }; // end of else 
    });
  });
}

// ------------- new or return  ---------------------------------------
// function requiered if new employee is selected incorrect
// where to go? redo or exit activity 
// -----------------------------------------------------------------------
const newOrReturn = async () => {

  await inquirer
    .prompt([
      {
        type: "list",
        name: "doOver",
        message: "Keep Updating employee?",
        choices: ["Yes", "Return to main menu"]
      }
    ])
    .then(answer => {
      switch (answer.doOver) {
        case "Yes":
          updateExistingEmployee();
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



exports.updateExistingEmployee = updateExistingEmployee;