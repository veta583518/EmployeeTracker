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
getManagerNames = async () => {
  const query = `SELECT CONCAT(first_name, " ", last_name) AS manager FROM employees WHERE NOT EXISTS (SELECT null FROM manager_id)`;
  let managers = [];
  for (let i of query) {
    managers.push(i.manager);
  }
  return managers;
};
getEmployeeNames = async () => {
  const query = `SELECT CONCAT(first_name, " ", last_name) AS employeeName FROM employees`;
  let employees = [];
  for (let i of query) {
    employees.push(i.employeeName);
  }
  return employees;
};

module.exports = {
  getDepartmentNames,
  getRoleNames,
  getManagerNames,
  getEmployeeNames,
};
