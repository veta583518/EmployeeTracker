const inquirer = require("inquirer");
// Employee Queries --------------------------------------------------

// View all Employees
viewEmployees = () => {
  connection.query(
    `SELECT 
      id, first_name, last_name, title, dept_name, salary, CONCAT(first_name, " ", last_name) AS manager
     FROM 
      employees
     INNER JOIN 
      roles ON role_id = roles.id
     INNER JOIN 
      departments ON dept_id = departments.id `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Add an Employee
addEmployee = (answers) => {
  connection.query(
    `INSERT INTO employees SET ?`,
    {
      first_name: answers.first_name,
      last_name: answers.last_name,
      role_id: roleId,
      manager_id: managerId,
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Bonus Queries ------------------------------------------------------

// Delete an Employee
deleteEmployee = async () => {
  connection.query =
    (`DELETE FROM employees WHERE ?`,
    {
      id: deleteId,
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    });
};

// Update Employee Manager
updateEmpMan = () => {
  // getManagerId, getFirstName, getLastName
  connection.query(
    `UPDATE employees SET ? WHERE ?`,
    [
      {
        manager_id: updatedManager,
      },
      {
        first_name: firstName,
        last_name: lastName,
      },
    ],
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// View Employee by Manager
viewEmployeeMan = () => {
  // take manager name to find manager id set to variable and call in query
  // get managerId
  const empMan = connection.query(
    `SELECT 
        first_name, 
        last_name
      FROM 
        employees 
      WHERE ?`,
    { manager_id: this.manager_id },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// View Employee by Department
// maybe join employees and roles on role_id then join departments on dept_id to get dept_name
viewEmployeeDept = () => {
  connection.query(
    `SELECT
        first_name,
        last_name,
        dept_name
      FROM 
        departments
      JOIN 
        roles ON departments.id = roles.dept_id
      JOIN 
        employees ON roles.id = employees.role_id
      WHERE dept_name = ${empByDept}`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Update Employee Role
updateEmployeeRole = () => {
  connection.query(`UPDATE employees SET ? WHERE ?`, [
    {
      role_id: "",
    },
  ]);
};
// Role Queries ----------------------------------------------------

// Add a Role
addRole = () => {
  connection.query(
    `INSERT INTO roles SET ?`,
    {
      title: "",
      salary: "",
      dept_id: "",
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// View all Roles
viewRoles = () => {
  connection.query(
    `SELECT 
        id, title, dept_name, salary 
      FROM 
        roles
      JOIN departments ON dept_id = departments.id
      `,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Delete a Role
deleteRole = () => {
  connection.query(
    `DELETE FROM roles WHERE ?`,
    {
      id: delRoleId,
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};
// Department Queries -----------------------------------------------

// View all Departments
viewDepts = () => {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
};

// Add a Department
addDept = (response) => {
  connection.query(
    `INSERT INTO departments SET ?`,
    { dept_name: response.departmentName },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Delete a Department
deleteDept = (response) => {
  connection.query(
    `DELETE FROM departments WHERE ?`,
    {
      id: response.delDept,
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// View Budget
viewUtilizedBud = async () => {
  connection.query(
    `SELECT SUM(salary) AS total, dept_name FROM departments JOIN roles ON GROUP BY dept_name`
  );
};

// get arrays for choices --------------------------------------------------------------------------------------------
getDepartmentNames = async () => {
  const query = `SELECT dept_name FROM departments `;
  let departments = [];
  for (let i of query) {
    departments.push(i.dept_name);
  }
  return departments;
};
getRoles = async () => {
  const query = `SELECT title FROM roles`;
  let roles = [];
  for (let i of query) {
    roles.push(i.title);
  }
  return roles;
};
getManagers = async () => {
  const query = `SELECT CONCAT(first_name, " ", last_name) AS manager FROM employees WHERE NOT EXISTS (SELECT null FROM manager_id)`;
  let managers = [];
  for (let i of query) {
    managers.push(i.manager);
  }
  return managers;
};
getEmployees = async () => {
  const query = `SELECT CONCAT(first_name, " ", last_name) AS employeeName FROM employees`;
  let employees = [];
  for (let i of query) {
    employees.push(i.employeeName);
  }
  return employees;
};

// additional prompts conditional to menu prompt selection ---------------------------------------------------------

// Add Employee, Department, & Role --------------------------------------------------------------------------------
// get addEmployee info
addEmployeeInfo = async () => {
  const roles = await getRoles;
  const managers = await getManagers;
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
};

// get addDepartment info
addDepartmentInfo = async () => {
  const response = await inquirer
    .prompt([
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
    ])
    .then();
};

// get addRole info
addRoleInfo = async () => {
  const departments = await getDepartmentNames();
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
      message: "What is the salay for this position?",
      // write validation to test if exists and if number
    },
    {
      type: "list",
      name: "deptartmentName",
      message: "Which department will this position work in?",
      choices: [...departments],
    },
  ]);
};

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
};
// Prompts to Bonus queries -----------------------------------------------------------------------------------------
updateEmployeeManager = async () => {
  const employees = await getEmployees();
  const managers = await getManagers();
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
};

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
};

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
};

deleteDept = async () => {
  const departments = await getDepartmentNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "deptDel",
      message: "Which department would you like to delete?",
      choices: [...departments],
    },
  ]);
};

deleteRole = async () => {
  const roles = await getRoles();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "roleDel",
      message: "Which role would you like to delete?",
      choices: [...roles],
    },
  ]);
};

deleteEmployee = async () => {
  const employees = await getEmployees();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "EmpDel",
      message: "Which employee would you like to delete?",
      choices: [...employees],
    },
  ]);
};

viewBudget = async () => {
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "empMan",
      message: "Which department's utilized budget would you like to see?",
      choices: [...departments],
    },
  ]);
};
