// Employee Queries ---------------------------------------------------------------------------------------------------------------------------------
// View all Employees ------------------------------------------------------------
viewEmployees = () => {
  // let sql = `SELECT
  //         id, first_name, last_name, title, dept_name, salary, CONCAT(first_name, " ", last_name) AS manager
  //        FROM
  //         employees
  //        JOIN
  //         roles ON role_id = roles.id
  //        JOIN
  //         departments ON department_id = departments.id `;
  let sql = `SELECT * FROM employees`;
  const rows = connection.query(sql);
  console.table(rows);
};

// Delete an Employee ----------------------------------------------
deleteEmployee = () => {
  const id = getEmployeeId();
  const employees = getEmployees();
  const response = inquirer.prompt([
    {
      type: "list",
      name: "EmpDel",
      message: "Which employee would you like to delete?",
      choices: [...employees],
    },
  ]);
  let sql = `DELETE FROM employees WHERE ?`;
  const args = [id];
  const rows = connection.query(sql, args);
  console.log(`${response.EmpDel} has been removed!`);
};

// Update Employee Manager --------------------------------------------
updateEmpMan = () => {
  const employees = getEmployeeNames();
  const managers = getManagerNames();
  const response = inquirer.prompt([
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
  let sql = `UPDATE CONCAT(first_name, " ", last_name) AS manager 
        SET manager = ? 
        WHERE CONCAT(first_name,' ',last_name) AS employee`;
  const args = [manager, employee];
  const rows = connection.query(sql, args);
  console.log(`Updated ${employee}'s manager to ${manager}!`);
};
// View Employee by Manager ---------------------------------------------
viewEmployeeMan = () => {
  const managers = getManagers();
  const response = inquirer.prompt([
    {
      type: "list",
      name: "empMan",
      message: "Which manager's employees would you like to see?",
      choices: [...managers],
    },
  ]);
  const manager = response.empMan;
  let sql = `SELECT 
          first_name, last_name, CONCAT(first_name," ",last_name) AS manager
        FROM 
           employees 
          WHERE ?`;
  const args = [manager];
  const rows = connection.query(sql, args);
  console.table(rows);
};

// View Employee by Department -------------------------------------------
viewEmployeeDept = () => {
  const departments = getDepartmentNames();
  const response = inquirer.prompt([
    {
      type: "list",
      name: "empDept",
      message: "Which department's employees would you like to see?",
      choices: [...departments],
    },
  ]);
  const dept_name = response.empDept;
  let sql = `SELECT
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
  const rows = connection.query(sql, args);
  console.table(rows);
};
