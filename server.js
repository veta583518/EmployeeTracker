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
          "Add a Department",
          "Add a Role",
          "Add an Employee",
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
  if (choice.menu === "Add a Department") {
    addDepartment();
  }
  if (choice.menu === "Add a Role") {
    addRole();
  }
  if (choice.menu === "Add an Employee") {
    addEmployee();
  }
  if (choice.menu === "Exit") {
    console.log("BYE");
    connection.end();
  }
};
// View all Departments ---------------------------------------------------------------
async function viewDepts() {
  const sql = `SELECT * FROM departments`;
  return connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log("\n");
      console.table("Departments", rows);
      mainPrompt();
    });
}

// View all Roles ---------------------------------------------------------------
async function viewRoles() {
  const sql = `SELECT 
            roles.id, title, dept_name, salary 
          FROM 
            roles
          INNER JOIN departments ON department_id = departments.id
          `;
  return connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log("\n");
      console.table("Roles", rows);
      mainPrompt();
    });
}

// View all Employees ------------------------------------------------------------
async function viewEmployees() {
  const sql = `SELECT 
          employees.id, first_name, last_name, title, dept_name, salary, CONCAT(first_name, " ", last_name) AS manager
         FROM 
          employees
         JOIN 
          roles ON role_id = roles.id
         JOIN 
          departments ON department_id = departments.id `;
  return connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      console.log("\n");
      console.table("Employees", rows);
      mainPrompt();
    });
}

// Add Department ---------------------------------------------------------------------
addDepartment = () => {
  const response = inquirer.prompt([
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the new Department?",
      validate(departmentNameInput) {
        if (departmentNameInput) {
          return true;
        } else {
          console.log("Invalid Entry! Please enter the department name.");
          return false;
        }
      },
    },
  ]);
  const dept_name = response.departmentName;
  let sql = `INSERT INTO departments (dept_name) VALUES (?) `;
  const args = [dept_name];
  // const rows = connection.query(sql, args);
  return connection
    .promise()
    .query(sql, args)
    .then((dept_name) => {
      console.log("\n");
      console.log(`Added new ${dept_name} department!`);
      mainPrompt();
    });
};

// Add a Role ---------------------------------------------------------------------
addRole = async () => {
  const departments = await getDepartmentNames();
  const department_id = await getDepartmentId();
  const response = inquirer.prompt([
    {
      type: "input",
      name: "roleName",
      message: "What is the new job title?",
      validate(roleNameInput) {
        if (roleNameInput) {
          return true;
        } else {
          console.log("Invalid Entry! Please enter the job title.");
        }
      },
    },
    {
      type: "number",
      name: "salary",
      message: "What is the salary for this position?",
      // write validation to test if exists and if number
    },
    {
      type: "list",
      name: "deptartmentName",
      message: "Which department will this position work in?",
      choices: [...departments],
    },
  ]);
  const title = response.roleName;
  const salary = response.salary;
  let sql = `INSERT INTO roles (title, salary, department_id) INNER JOIN departments ON department_id = departments.id`;
  const args = [title, salary, department_id];
  // const rows = connection.query(sql, args);
  return connection
    .promise()
    .query(sql, args)
    .then(
      console.log("\n"),
      console.log(`Added new ${title} role!`),
      mainPrompt()
    );
};

// Add Employee -----------------------------------------------------------------------
addEmployee = async () => {
  const roles = await getRoleNames();
  const managers = await getManagerNames();
  const role_id = await getRoleId();
  const manager_id = await getManagerId();
  const response = inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?",
      validate(first_nameInput) {
        if (first_nameInput) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the new employee's last name?",
      validate(last_nameInput) {
        if (last_nameInput) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      type: "list",
      name: "roles",
      message: "What is the employee's job title?",
      choices: [...roles],
    },
    {
      type: "list",
      name: "managers",
      message: "Who does the employee report to?",
      choices: [...managers],
    },
  ]);
  const first_name = response.first_name;
  const last_name = response.last_name;
  let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES (?,?,?,?)`;
  const args = [first_name, last_name, role_id, manager_id];
  // const rows = connection.query(sql, args);
  return connection
    .promise()
    .query(sql, args)
    .then(
      console.log("\n"),
      console.log(`Added employee ${first_name + " " + last_name}`),
      mainPrompt()
    );
};

// Update Employee Role -------------------------------------------------------------
updateEmployeeRole = async () => {
  const employees = await getEmployees();
  const response = inquirer.prompt([
    {
      type: "list",
      name: "eRole",
      message: "Which employee's role would you like to update?",
      choices: [...employees],
    },
    {
      type: "input",
      name: "newRole",
      message: "What is the employee's new position?",
      validate(newRoleInput) {
        if (newRoleInput) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);
  const title = response.newRole;
  const employee = response.eRole;
  let sql = `UPDATE employees SET title = ? WHERE CONCAT(first_name, " ", last_name) AS employee =? INNER JOIN roles ON role_id = roles.id WHERE ?`;
  const args = [title, employee];
  return connection
    .promise()
    .query(sql, args)
    .then(
      console.log("\n"),
      console.log(`Updated ${eRole}'s role to ${newRole}!`)
    );
};

// get arrays for choices in prompts --------------------------------------------------------------------------------------------
getDepartmentNames = () => {
  let departments = [];
  let sql = `SELECT dept_name FROM departments `;
  return connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      for (let row of rows) {
        departments.push(row.dept_name);
      }
      return departments;
    });
};

getRoleNames = () => {
  let roles = [];
  let sql = `SELECT title FROM roles`;
  return connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      for (let row of rows) {
        roles.push(row.role);
      }
      return roles;
    });
};

getManagerNames = () => {
  let managers = [];
  let sql = `SELECT CONCAT(first_name, " ", last_name) AS manager FROM employees WHERE NOT EXISTS (SELECT null FROM manager_id)`;
  return connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      for (let row of rows) {
        managers.push(row.manager);
      }
      return managers;
    });
};
getEmployeeNames = () => {
  let sql = `SELECT CONCAT(first_name, " ", last_name) AS employee FROM employees`;
  let employees = [];
  return connection
    .promise()
    .query(sql)
    .then(([rows, fields]) => {
      for (let row of rows) {
        employees.push(row.employee);
      }
      return employees;
    });
};

// Helper Functions Get ids when you only have name ---------------------------------------------------------------------------
// Get Role Id ----------------------------------------------------------------------------------------------
getRoleId = (roles) => {
  let sql = `SELECT id FROM roles WHERE ?`;
  const args = [roles];
  const rows = connection.promise().query(sql, args);
  return rows[0].id;
};
// Get Department Id --------------------------------------------------------------------------------------------
getDepartmentId = (departmentName) => {
  let sql = `SELECT id FROM departments WHERE ?`;
  const args = [departmentName];
  const rows = connection.promise().query(sql, args);
  return rows[0].id;
};
// Get Manager Id -----------------------------------------------------------------------------------------------
getManagerId = (managerName) => {
  let sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees WHERE ?`;
  const args = [managerName];
  const rows = connection.promise().query(sql, args);
  return rows[0].id;
};
// Get Employee Id ------------------------------------------------------------------------------------------------
getEmployeeId = (first_name, last_name) => {
  let sql = `SELECT id FROM employee WHERE first_name ? AND last_name ?`;
  const args = [first_name, last_name];
  const rows = connection.promise().query(sql, args);
  return rows[0].id;
};
