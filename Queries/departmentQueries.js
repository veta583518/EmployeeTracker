const {
  getDepartmentNames,
  getRoleNames,
  getManagerNames,
  getEmployeeNames,
} = require("./questions");
const inquirer = require("inquirer");

// Department Queries -----------------------------------------------------------------
// View all Departments ---------------------------------------------------------------
viewDepts = async () => {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err;
    console.table(res);
    mainPrompt();
  });
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
