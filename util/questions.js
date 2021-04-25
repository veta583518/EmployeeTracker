const inquirer = require("inquirer");

// get arrays for choices --------------------------------------------------------------------------------------------
getDepartmentNames = async () => {
  const query = `SELECT dept_name FROM departments `;
  let departments = [];
  for (let i of query) {
    departments.push(i.dept_name);
  }
  return departments;
};
getRoleNames = async () => {
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
// Department Queries -----------------------------------------------------------------
// View all Departments ---------------------------------------------------------------
viewDepts = () => {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
};
// Add Department ---------------------------------------------------------------------
addDepartment = async () => {
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

// Role Queries -----------------------------------------------------------------
// View all Roles ---------------------------------------------------------------
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

// Add a Role ---------------------------------------------------------------------
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
  connection.query(
    `INSERT INTO roles SET ?`,
    {
      title: response.roleName,
      salary: response.salary,
      dept_id: "",
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Update Employee Role -------------------------------------------------------------
updateEmployeeRole = () => {
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
  connection.query(
    `UPDATE employees 
    SET ? 
    JOIN roles ON role_id = roles.id
    WHERE ?`, 
    [
    {
      title: response.newRole,
    },
    {
      role_id: ""
    }
  ]);
};
// Employee Queries -------------------------------------------------------------
// View all Employees ------------------------------------------------------------
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
// Add Employee -----------------------------------------------------------------------
addEmployee = async () => {
  const roles = await getRoleNames();
  const managers = await getManagerNames();
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
  connection.query(
    `INSERT INTO employees SET ?`,
    {
      first_name: response.first_name,
      last_name: response.last_name,
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
// Update Employee Manager --------------------------------------------
updateEmpMan = () => {
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
  connection.query(
    `UPDATE CONCAT(first_name, " ", last_name) AS manager 
    SET ? 
    WHERE ?`,
    [
      {
        manager: response.updateMan,
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

// View Employee by Manager ---------------------------------------------
viewEmployeeMan = () => {
    const managers = await getManagers();
    const response = await inquirer.prompt([
      {
        type: "list",
        name: "empMan",
        message: "Which manager's employees would you like to see?",
        choices: [...managers],
      },
    ]);
  connection.query(
    `SELECT 
      first_name, last_name, CONCAT(first_name," ",last_name) AS manager
    FROM 
       employees 
      WHERE ?`,
    { manager: response.empMan },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// View Employee by Department -------------------------------------------
viewEmployeeDept = () => {
  const departments = await getDepartmentNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "empDept",
      message: "Which department's employees would you like to see?",
      choices: [...departments],
    },
  ]);
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
      WHERE dept_name ?`,
      { dept_name: response.empDept},
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Delete a Department ----------------------------------------------
deleteDept = () => {
  const departments = await getDepartmentNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "deptDel",
      message: "Which department would you like to delete?",
      choices: [...departments],
    },
  ]);
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

// Delete a Role ---------------------------------------------------
deleteRole = () => {
  const roles = await getRoleNames();
  const response = await inquirer.prompt([
    {
      type: "list",
      name: "roleDel",
      message: "Which role would you like to delete?",
      choices: [...roles],
    },
  ]);
  connection.query(
    `DELETE FROM roles WHERE ?`,
    {
      id: response.roleDel,
    },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};
// Delete an Employee ----------------------------------------------
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
  connection.query =
  (`DELETE FROM employees WHERE ?`,
  {
    id: response.EmpDel
  },
  function (err, res) {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
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
  connection.query(
    `SELECT SUM(salary) AS total, 
    FROM departments 
    JOIN roles ON GROUP BY dept_name
    WHERE dept_name ?`,
    {dept_name: response.empMan},
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

