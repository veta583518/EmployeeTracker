// Department Queries -----------------------------------------------------------------
// View all Departments ---------------------------------------------------------------
viewDepts = () => {
  let sql = `SELECT * FROM departments`;
  const rows = connection.query(sql);
  console.table(rows);
};

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
  const departmentName = response.departmentName;
  let sql = `INSERT INTO departments (dept_name) VALUES (?) `;
  const args = [departmentName];
  const rows = connection.query(sql, args);
  console.log(`Added new department ${departmentName}!`);
};

// Delete a Department ----------------------------------------------
deleteDept = () => {
  const id = getDepartmentId();
  const departments = getDepartmentNames();
  const response = inquirer.prompt([
    {
      type: "list",
      name: "deptDel",
      message: "Which department would you like to delete?",
      choices: [...departments],
    },
  ]);

  let sql = `DELETE FROM departments WHERE id ?`;
  const args = [id];
  const rows = connection.query(sql, args);
  console.log();
};

// View Budget
viewUtilizedBud = () => {
  const response = inquirer.prompt([
    {
      type: "list",
      name: "empMan",
      message: "Which department's utilized budget would you like to see?",
      choices: [...departments],
    },
  ]);
  const dept_name = response.empMan;
  let sql = `SELECT SUM(salary) AS total, 
        FROM departments 
        JOIN roles ON GROUP BY dept_name
        WHERE dept_name ?`;
  const args = [dept_name];
  const rows = connection.query(sql, args);
  console.table(rows);
};
