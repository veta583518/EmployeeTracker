//const listmenu = db.departments.dept_name;
mainPrompt = () => {
  const choice = inquirer.prompt([
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
      viewDepts();
      break;
    }
    case "View all Roles": {
      viewRoles();
      break;
    }
    case "View all Employees": {
      viewEmployees();
      break;
    }
    case "Add a Department": {
      addDepartment();
      break;
    }
    case "Add a Role": {
      addRole();
      break;
    }
    case "Add an Employee": {
      addEmployee();
      break;
    }
    case "Update an Employee Role": {
      updateEmpRole();
      break;
    }
    case "Update Employee Managers": {
      updateEmpMan();
      break;
    }
    case "View Employees by Manager": {
      viewEmployeeMan();
      break;
    }
    case "View Employees by Department": {
      viewEmployeeDept();
      break;
    }
    case "Delete a Department": {
      deleteDept();
      break;
    }
    case "Delete a Role": {
      deleteRole();
      break;
    }
    case "Delete an Employee": {
      deleteEmployee();
      break;
    }
    case "View Total Utilized Budget by Department": {
      viewUtilizedBud();
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
getDepartmentNames = () => {
  let sql = `SELECT dept_name FROM departments `;
  const rows = connection.query(sql, args);
  let departments = [];
  for (let i of sql) {
    departments.push(i.dept_name);
  }
  return departments;
};
getRoleNames = () => {
  let sql = `SELECT title FROM roles`;
  let roles = [];
  for (let i of sql) {
    roles.push(i.title);
  }
  return roles;
};
getManagerNames = () => {
  let sql = `SELECT CONCAT(first_name, " ", last_name) AS manager FROM employees WHERE NOT EXISTS (SELECT null FROM manager_id)`;
  let managers = [];
  for (let i of sql) {
    managers.push(i.manager);
  }
  return managers;
};
getEmployeeNames = () => {
  let sql = `SELECT CONCAT(first_name, " ", last_name) AS employee FROM employees`;
  let employees = [];
  for (let i of sql) {
    employees.push(i.employee);
  }
  return employees;
};

// Helper Functions Get ids when you only have name ---------------------------------------------------------------------------
// Get Role Id ----------------------------------------------------------------------------------------------
getRoleId = (roles) => {
  let sql = `SELECT id FROM roles WHERE ?`;
  const args = [roles];
  const rows = connection.query(sql, args);
  return rows[0].id;
};
// Get Department Id --------------------------------------------------------------------------------------------
getDepartmentId = (departmentName) => {
  let sql = `SELECT id FROM departments WHERE ?`;
  const args = [departmentName];
  const rows = connection.query(sql, args);
  return rows[0].id;
};
// Get Manager Id -----------------------------------------------------------------------------------------------
getManagerId = (managerName) => {
  let sql = `SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employees WHERE ?`;
  const args = [managerName];
  const rows = connection.query(sql, args);
  return rows[0].id;
};
// Get Employee Id ------------------------------------------------------------------------------------------------
getEmployeeId = (first_name, last_name) => {
  let sql = `SELECT id FROM employee WHERE first_name ? AND last_name ?`;
  const args = [first_name, last_name];
  const rows = connection.query(sql, args);
  return rows[0].id;
};

// Bonus Queries --------------------------------------------------------------------------------------------------------------------------------
