const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { viewDepts, addDept } = require("./Queries/departmentQueries.js");
const { viewRoles, addRole, updateEmpRole } = require("./Queries/roleQueries");
const { viewEmployees, addEmployee } = require("./Queries/employeeQueries");
const {
  updateEmpMan,
  viewEmployeeMan,
  viewEmployeeDept,
  deleteDept,
  deleteRole,
  deleteEmployee,
  viewUtilizedBud,
} = require("./Queries/bonusQueries");

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
  console.log("connected as id " + connection.threadId);
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
        viewDepts();
      }

      if (menu === "View all Roles") {
        viewRoles();
      }

      if (menu === "View all Employees") {
        viewEmployees();
      }

      if (menu === "Add a Department") {
        addDept();
      }

      if (menu === "Add a Role") {
        addRole();
      }

      if (menu === "Add an Employee") {
        addEmployee();
      }

      if (menu === "Update an Employee Role") {
        updateEmpRole();
      }
      if (menu === "Update Employee Managers") {
        updateEmpMan();
      }

      if (menu === "View Employees by Manager") {
        viewEmployeeMan();
      }

      if (menu === "View Employees by Department") {
        viewEmployeeDept();
      }

      if (menu === "Delete a Department") {
        deleteDept();
      }

      if (menu === "Delete a Role") {
        deleteRole();
      }

      if (menu === "Delete an Employee") {
        deleteEmployee();
      }

      if (menu === "View Total Utilized Budget by Department") {
        viewUtilizedBud();
      }
      if (menu === "Exit") {
        console.log("BYE");
        connection.end;
      }
    });
}
