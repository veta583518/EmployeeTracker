const {
  getDepartmentNames,
  getRoleNames,
  getManagerNames,
  getEmployeeNames,
} = require("./questions");
const inquirer = require("inquirer");

// Bonus Queries ------------------------------------------------------
// Update Employee Manager --------------------------------------------
updateEmpMan = async () => {
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
    { dept_name: response.empDept },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

// Delete a Department ----------------------------------------------
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
deleteRole = async () => {
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
      id: response.EmpDel,
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
    { dept_name: response.empMan },
    function (err, res) {
      if (err) throw err;
      console.table(res);
      mainPrompt();
    }
  );
};

module.exports = {
  updateEmpMan,
  viewEmployeeMan,
  viewEmployeeDept,
  deleteDept,
  deleteRole,
  deleteEmployee,
  viewUtilizedBud,
};
