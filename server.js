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
mainPrompt = async () => {
  const choice = await inquirer.prompt([
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
        "Update an Employee Role",
        "Update Employee Managers",
        "View Employees by Manager",
        "Delete a Department",
        "Delete a Role",
        "Delete an Employee",
        "View Total Utilized Budget of a Department",
        "Exit",
      ],
    },
  ]);
  switch (choice.menu) {
    case "View all Departments": {
      await viewDepts();
      break;
    }
    case "View all Roles": {
      await viewRoles();
      break;
    }
    case "View all Employees": {
      await viewEmployees();
      break;
    }
    case "Add a Department": {
      await addDepartment();
      break;
    }
    case "Add a Role": {
      await addRole();
      break;
    }
    case "Add an Employee": {
      await addEmployee();
      break;
    }
    case "Update an Employee Role": {
      await updateEmpRole();
      break;
    }
    case "Update Employee Managers": {
      await updateEmpMan();
      break;
    }
    case "View Employees by Manager": {
      await viewEmployeeMan();
      break;
    }
    case "View Employees by Department": {
      await viewEmployeeDept();
      break;
    }
    case "Delete a Department": {
      await deleteDept();
      break;
    }
    case "Delete a Role": {
      await deleteRole();
      break;
    }
    case "Delete an Employee": {
      await deleteEmployee();
      break;
    }
    case "View Total Utilized Budget by Department": {
      await viewUtilizedBud();
      break;
    }
    case "Exit": {
      console.log("BYE");
      connection.end;
      break;
    }
  }
};
// get arrays for choices in prompts --------------------------------------------------------------------------------------------
getDepartmentNames = async () => {
  const sql = `SELECT dept_name FROM departments `;
  const rows = await connection.query(sql, args);
  let departments = [];
  for (let i of sql) {
    departments.push(i.dept_name);
  }
  return departments;
};
getRoleNames = async () => {
  const sql = `SELECT title FROM roles`;
  let roles = [];
  for (let i of sql) {
    roles.push(i.title);
  }
  return roles;
};
getManagerNames = async () => {
  const sql = `SELECT CONCAT(first_name, " ", last_name) AS manager FROM employees WHERE NOT EXISTS (SELECT null FROM manager_id)`;
  let managers = [];
  for (let i of sql) {
    managers.push(i.manager);
  }
  return managers;
};
getEmployeeNames = async () => {
  const sql = `SELECT CONCAT(first_name, " ", last_name) AS employee FROM employees`;
  let employees = [];
  for (let i of sql) {
    employees.push(i.employee);
  }
  return employees;
};
// Get ids when you only have name ---------------------------------------------------------------------------
// Get Role Id ----------------------------------------------------------------------------------------------
getRoleId = async (roles) => {
  const sql = `SELECT id FROM roles WHERE ?`;
  const args = [roles];
  const rows = await connection.query(sql, args);
  return rows[0].id;
};
// Get Department Id --------------------------------------------------------------------------------------------
getDepartmentId = async (departmentName) => {
  const sql = `SELECT id FROM departments WHERE ?`;
  const args = [departmentName];
  const rows = await connection.query(sql, args);
  return rows[0].id;
};
// Get Manager Id -----------------------------------------------------------------------------------------------
getManagerId = async (managerName) => {
  const sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees WHERE ?`;
  const args = [managerName];
  const rows = await connection.query(sql, args);
  return rows[0].id;
};
// Get Employee Id ------------------------------------------------------------------------------------------------
getEmployeeId = async (first_name, last_name) => {
  const sql = `SELECT id FROM employee WHERE first_name ? AND last_name ?`;
  const args = [first_name, last_name];
  const rows = await connection.query(sql, args);
  return rows[0].id;
};
// Department Queries -----------------------------------------------------------------
// View all Departments ---------------------------------------------------------------
viewDepts = async () => {
  const sql = `SELECT * FROM departments`;
  const rows = await connection.query(sql);
  console.table(rows);
};
// Add Department ---------------------------------------------------------------------
addDepartment = async () => {
  const response = await inquirer.prompt([
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
  const departmentName = response.departmentName;
  const sql = `INSERT INTO departments (dept_name) VALUES (?) `;
  const args = [departmentName];
  const rows = await connection.query(sql, args);
  console.log(`Added new department ${departmentName}!`);
};
// Role Queries -----------------------------------------------------------------
// View all Roles ---------------------------------------------------------------
viewRoles = async () => {
  const sql = `SELECT 
          id, title, dept_name, salary 
        FROM 
          roles
        INNER JOIN departments ON department_id = departments.id
        `;
  const rows = await connection.query(sql);
  console.table(rows);
};

// Add a Role ---------------------------------------------------------------------
addRole = async () => {
  const departments = await getDepartmentNames();
  const department_id = await getDepartmentId();
  const response = await inquirer.prompt([
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
  const sql = `INSERT INTO roles (title, salary, department_id) INNER JOIN departments ON department_id = departments.id`;
  const args = [title, salary, department_id];
  const rows = await connection.query(sql, args);
  console.log(`Added new role ${title}!`);
};
// Update Employee Role -------------------------------------------------------------
updateEmployeeRole = async () => {
  const employees = await getEmployees();
  const response = await inquirer.prompt([
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
  const sql = `UPDATE employees SET title = ? WHERE CONCAT(first_name, " ", last_name) AS employee =? INNER JOIN roles ON role_id = roles.id WHERE ?`;
  const args = [title, employee];
  const rows = await connection.query(sql, args);
  console.log(`Updated ${eRole}'s role to ${newRole}!`);
};
// Employee Queries -------------------------------------------------------------
// View all Employees ------------------------------------------------------------
viewEmployees = async () => {
  const sql = `SELECT 
        id, first_name, last_name, title, dept_name, salary, CONCAT(first_name, " ", last_name) AS manager
       FROM 
        employees
       JOIN 
        roles ON role_id = roles.id
       JOIN 
        departments ON department_id = departments.id `;
  const rows = await connection.query(sql);
  console.table(rows);
};
// Add Employee -----------------------------------------------------------------------
addEmployee = async () => {
  const roles = await getRoleNames();
  const managers = await getManagerNames();
  const role_id = await getRoleId();
  const manager_id = await getManagerId();
  const response = await inquirer.prompt([
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
  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;
  const args = [first_name, last_name, role_id, manager_id];
  const rows = await connection.query(sql, args);
  console.log(`Added employee ${first_name + " " + last_name}`);
};
// Bonus Queries ------------------------------------------------------
// Update Employee Manager --------------------------------------------
updateEmpMan = async () => {
  const employees = await getEmployeeNames();
  const managers = await getManagerNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "updateMan",
      message: "Which employee's manager would you like to update?",
      choices: [...employees],
    },
    {
      type: "list",
      name: "newMan",
      message: "Who is this employee's new manager?",
      choices: [...managers],
    },
  ]);
  const manager = response.newMan;
  const employee = response.updateMan;
  const sql = `UPDATE CONCAT(first_name, " ", last_name) AS manager 
      SET manager = ? 
      WHERE CONCAT(first_name,' ',last_name) AS employee`;
  const args = [manager, employee];
  const rows = await connection.query(sql, args);
  console.log(`Updated ${employee}'s manager to ${manager}!`);
};
// View Employee by Manager ---------------------------------------------
viewEmployeeMan = async () => {
  const managers = await getManagers();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "empMan",
      message: "Which manager's employees would you like to see?",
      choices: [...managers],
    },
  ]);
  const manager = response.empMan;
  const sql = `SELECT 
        first_name, last_name, CONCAT(first_name," ",last_name) AS manager
      FROM 
         employees 
        WHERE ?`;
  const args = [manager];
  const rows = await connection.query(sql, args);
  console.table(rows);
};

// View Employee by Department -------------------------------------------
viewEmployeeDept = async () => {
  const departments = await getDepartmentNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "empDept",
      message: "Which department's employees would you like to see?",
      choices: [...departments],
    },
  ]);
  const dept_name = response.empDept;
  const sql = `SELECT
          first_name,
          last_name,
          dept_name
        FROM 
          departments
        INNER JOIN 
          roles ON departments.id = roles.department_id
        INNER JOIN 
          employees ON roles.id = employees.role_id
        WHERE dept_name ?`;
  const args = [dept_name];
  const rows = await connection.query(sql, args);
  console.table(rows);
};

// Delete a Department ----------------------------------------------
deleteDept = async () => {
  const id = await getDepartmentId();
  const departments = await getDepartmentNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "deptDel",
      message: "Which department would you like to delete?",
      choices: [...departments],
    },
  ]);

  const sql = `DELETE FROM departments WHERE id ?`;
  const args = [id];
  const rows = await connection.query(sql, args);
  console.log();
};

// Delete a Role ---------------------------------------------------
deleteRole = async () => {
  const id = await getRoleId();
  const roles = await getRoleNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "roleDel",
      message: "Which role would you like to delete?",
      choices: [...roles],
    },
  ]);
  const sql = `DELETE FROM roles WHERE ?`;
  const args = [id];
  const rows = await connection.query(sql, args);
  console.log(`${roleDel} has been removed!`);
};
// Delete an Employee ----------------------------------------------
deleteEmployee = async () => {
  const id = await getEmployeeId();
  const employees = await getEmployees();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "EmpDel",
      message: "Which employee would you like to delete?",
      choices: [...employees],
    },
  ]);
  const sql = `DELETE FROM employees WHERE ?`;
  const args = [id];
  const rows = await connection.query(sql, args);
  console.log(`${response.EmpDel} has been removed!`);
};

// View Budget
viewUtilizedBud = async () => {
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "empMan",
      message: "Which department's utilized budget would you like to see?",
      choices: [...departments],
    },
  ]);
  const dept_name = response.empMan;
  const sql = `SELECT SUM(salary) AS total, 
      FROM departments 
      JOIN roles ON GROUP BY dept_name
      WHERE dept_name ?`;
  const args = [dept_name];
  const rows = connection.query(sql, args);
  console.table(rows);
};
