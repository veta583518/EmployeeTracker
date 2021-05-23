// Role Queries -----------------------------------------------------------------
// View all Roles ---------------------------------------------------------------
viewRoles = () => {
  let sql = `SELECT 
            id, title, dept_name, salary 
          FROM 
            roles
          INNER JOIN departments ON department_id = departments.id
          `;
  const rows = connection.query(sql);
  console.table(rows);
};

// Add a Role ---------------------------------------------------------------------
addRole = () => {
  const departments = getDepartmentNames();
  const department_id = getDepartmentId();
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
  const rows = connection.query(sql, args);
  console.log(`Added new role ${title}!`);
};

// Delete a Role ---------------------------------------------------
deleteRole = () => {
  const id = getRoleId();
  const roles = getRoleNames();
  const response = inquirer.prompt([
    {
      type: "list",
      name: "roleDel",
      message: "Which role would you like to delete?",
      choices: [...roles],
    },
  ]);
  let sql = `DELETE FROM roles WHERE ?`;
  const args = [id];
  const rows = connection.query(sql, args);
  console.log(`${roleDel} has been removed!`);
};
