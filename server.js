const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const departmentQueries = require("./Queries/departmentQueries");
const roleQueries = require("./Queries/roleQueries");
const employeeQueries = require("./Queries/employeeQueries");
require("dotenv").config();

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "Williams82717!",
  database: "employeesDB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id" + connection.threadId);
  mainPrompt();
});

//const listmenu = db.departments.dept_name;
async function mainPrompt() {
  return inquirer
    .prompt({
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View all Departments",
        "View all Roles",
        "View all Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Update Employee Managers",
        "View Employees by Manager",
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        "View Total Utilized Budget of a Department",
        "Exit",
      ],
    })
    .then((choice) => {
      const { menu } = choice;

      if (menu === "View all Departments") {
        departmentQueries.viewDepts();
      }

      if (menu === "View all Roles") {
        roleQueries.viewRoles();
      }

      if (menu === "View all Employees") {
        employeeQueries.viewEmployees();
      }

      if (menu === "Add a Department") {
        departmentQueries.addDept();
      }

      if (menu === "Add a Role") {
        roleQueries.addRole();
      }

      if (menu === "Add an Employee") {
        employeeQueries.addEmployee();
      }

      if (menu === "Update an Employee Role") {
        employeeQueries.updateEmpRole();
      }
      if (menu === "Exit") {
        console.log("BYE");
        connection.end;
      }
    });
}
