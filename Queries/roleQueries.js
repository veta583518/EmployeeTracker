const {
  getDepartmentNames,
  getRoleNames,
  getManagerNames,
  getEmployeeNames,
} = require("./questions");
const inquirer = require("inquirer");

// Role Queries -----------------------------------------------------------------
// View all Roles ---------------------------------------------------------------
viewRoles = async () => {
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
addRole = async () => {
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
        role_id: "",
      },
    ]
  );
};

module.exports = { viewRoles, addRole, updateEmployeeRole };
