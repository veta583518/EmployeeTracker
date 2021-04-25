const {
  getDepartmentNames,
  getRoleNames,
  getManagerNames,
  getEmployeeNames,
} = require("./questions");
const inquirer = require("inquirer");

// Employee Queries -------------------------------------------------------------
// View all Employees ------------------------------------------------------------
viewEmployees = async () => {
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
module.exports = { viewEmployees, addEmployee };
