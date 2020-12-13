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

const { viewEmployees, viewDepartments, viewJobRoles } = require('./views');


const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Br@ntwood34",
  // password: process.argv[2],
  database: "employeetracker",
});

// ------------- remove Department ---------------------------------------
// 2 Query - must remove with department id for unique selection
// 1. get all from departments
//    compare results to get/set matching id for chosen depatment
// 2. delete from departments 
// -----------------------------------------------------------------------
const removeDepartment = () => {

  updateLists();
  inquirer
    .prompt([
      {
        type: "list",
        name: "continue",
        message: "Please confirm you wish to perminantly delete a department?",
        choices: ["Return", "Yes continue to remove a department"],
      },
      {
        type: "list",
        name: "deplist",
        message: "Which department would you like to delete?",
        choices: departmentList,
        when: (answer) => answer.continue === "Yes continue to remove a department",
      },

    ])
    .then(answers => {
      // console.log("answers =", answers);
      switch(answers.continue){
        case "Return":
          mainMenu.mainMenu();
          break;
        
        case "Yes continue to remove a department":

          const getdepIdSql =
            `SELECT * FROM departments`;
          let chosenDepId = "";
          con.query(getdepIdSql, function (err, result) {
            console.log({ result });
            for (i in result) {
              if (answers.deplist == result[i].depName) {
                chosenDepId = result[i].id;
              }
            }

            const rdSql =
              `DELETE FROM departments WHERE id = ${chosenDepId}`;
            con.query(rdSql, function(err, result){
              console.log({ result });
              console.log("The Department has been deleted");
              viewDepartments();
              mainMenu.mainMenu();
            })
          })
          break;
      }
    })
    .catch((error) => {
      console.log("error =", error);
      console.log("woops, something went wrong");
    });
};

// ------------- remove Employee ---------------------------------------
// 2 Query + nested inquirer prompt dependent on answers - does NOT use when
// 1. GET - employee id , first name, last name, job title
//    JOIN - employee and job role, Filters by full name
//    IF statment to capture employee entered more than once/ more than one job role, 
// NESTED prompt gets job role to be removed to further filter by for loop and 
//    SET employee ID to be deleted.
// 2. Delete employee - required employee id for unique selection
// -----------------------------------------------------------------------
const removeEmployee = () => {

  updateLists();
  inquirer
    .prompt([
      {
        type: "list",
        name: "continue",
        message: "Please confirm you wish to perminantly delete an employee?",
        choices: ["Return", "Yes continue to remove an employee"],
      },
      {
        type: "list",
        name: "emplist",
        message: "Which employee would you like to delete?",
        choices: employeeList,
        when: (answer) => answer.continue === "Yes continue to remove an employee",
      },
      {
        type: "list", 
        name: "reason",
        message: "What is the reason for their leaving?",
        choices: ["FIRED", "Leaving", "Redundent", "Incorrect entry"]
      }
    ])
    .then(answers => {
      console.log("answers =", answers);
      if(answers.continue == "Return"){
        mainMenu.mainMenu();

      } else {
        const [eFname, eLname] = answers.emplist.split(' ');
        const geSql = 
          `SELECT emp.id, firstName, lastName, jobTitle
          FROM employee AS emp
          INNER JOIN 
          jobrole AS jr
          ON jr.id = emp.jobRole_id
          WHERE (firstName, lastName) = ("${eFname}", "${eLname}")`;

        con.query(geSql, async function(err, result){
          console.log({result});
          console.log("result.length =", result.length);
          let getIdToDelete = "";

          if(result.length > 1){
            
            let employeeJobList = [];
            
            for(i in result){
              employeeJobList.push(result[i].jobTitle);
            }
            console.log("employeeJobList =", employeeJobList);

            await inquirer
              .prompt([
                // for some reason a pre question is needed 
                // inorder to make the variable for choices in 
                //the second question show up. 
                {
                  type: "list",
                  name: "ok",
                  message: "This employee has more than one job role.",
                  choices: ["Okay"]
                },
                {
                  type: "list",
                  name: "depName",
                  message: "Which one are they leaving?",
                  choices: employeeJobList
                }
              ]).then(ans => {
                console.log({ans});
                for(j in result){
                  if(result[j].jobTitle == ans.depName){
                    getIdToDelete = result[j].id
                    console.log("result.id 2 or more =",result[j].id);
                  }
                }
                console.log({getIdToDelete});
              })

          } else {
            getIdToDelete = result[0].id;
            console.log("result.id 1 =",result[0].id);
            console.log({getIdToDelete});
          }

          const reSql =
          `DELETE FROM employee WHERE id = ${getIdToDelete}`;
          con.query(reSql, function(err, result){
            console.log({result});

            switch(answers.reason){
              case "FIRED":
                console.log(`YOUR FIRED ${eFname +" "+ eLname}`);
                break;
              case "Leaving":
                console.log(`We are sorry to see you go ${eFname +" "+ eLname}. Thanks for your hard work.`);
                break;
              case "Redundent":
                console.log(`We are so sorry, you're possition is no longer available ${eFname +" "+ eLname}. Thanks for your hard work.`);
                break;
              case "Incorrect entry":
                console.log(`Sometimes even management make mistakes. Entry ${eFname +" "+ eLname +" "+ ans.depName} removed.`);
                break;
            }
            viewEmployees();
          })
        })
      }
    })
    .catch((error) => {
      console.log("error =", error);
      console.log("woops, something went wrong");
    });
};


exports.removeDepartment = removeDepartment;
exports.removeEmployee = removeEmployee; 