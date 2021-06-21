// Role Queries -----------------------------------------------------------------

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
  const rows = connection.promise().query(sql, args);
  console.log(`${roleDel} has been removed!`);
};
