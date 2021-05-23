const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Database = require("./database");
require("dotenv").config();

// create the connection to database
// Database is class
const { connection } = new Database({
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
mainPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Exit",
        ],
      },
    ])
    .then((choice) => {
      choiceHandler(choice);
    });
};

const choiceHandler = (choice) => {
  if (choice.menu === "View all Departments") {
    viewDepts();
  }
  if (choice.menu === "View all Roles") {
    viewRoles();
  }
  if (choice.menu === "View all Employees") {
    viewEmployees();
  }
  if (choice.menu === "Exit") {
    console.log("BYE");
    connection.end;
  }
};
// View all Departments ---------------------------------------------------------------
async function viewDepts() {
  const sql = `SELECT * FROM departments`;
  const rows = connection.query(sql);
  console.table(rows);
  mainPrompt();
}

// View all Roles ---------------------------------------------------------------
async function viewRoles() {
  const sql = `SELECT 
            id, title, dept_name, salary 
          FROM 
            roles
          INNER JOIN departments ON department_id = departments.id
          `;
  const rows = await connection.promise().query(sql);
  console.table(rows);
  mainPrompt();
}

// View all Employees ------------------------------------------------------------
async function viewEmployees() {
  const sql = `SELECT 
          id, first_name, last_name, title, dept_name, salary, CONCAT(first_name, " ", last_name) AS manager
         FROM 
          employees
         JOIN 
          roles ON role_id = roles.id
         JOIN 
          departments ON department_id = departments.id `;
  const rows = await connection.promise().query(sql);
  console.table(rows);
  mainPrompt();
}
