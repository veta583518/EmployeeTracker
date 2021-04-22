const userPrompt = (data) => [
    inquirer.prompt([
  {
    type: "list",
    name: "choice",
    message: "Please make a selection from below:",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "View Employees By Manager",
      "View Employees By Department",
      "View Total Utilized Budget of a Department",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee Role",
      "Update Employee Manager",
      "Delete a Department",
      "Delete a Role",
      "Delete an Employee",
      
    ],
  },
])
];

// write switch statement for each option to link query

switch (choice) {
    case "View All Departments": 
    ()
}

 const addDept = () => [
     {
         type: 'input',
         name: 'name',
         message: 'Enter the department name. (Required)',
         // add validation
         validate (nameInput) {
             if (nameInput) {
                 return true;
             } else {
                 console.log('You did not enter a department name. Please enter a department name to proceed.');
                 return false;
             }
         }
     },
    
 ];

 const addRole = () => [
     {
         type: 'input',
         name: 'title',
         message: 'Enter the name of the role? (Required)',
         validate (titleInput) {
             if (titleInput) {
                 return true;
             } else {
                 console.log('You did not enter the name of the role. Please enter the name of the role to proceed.');
                 return false;
             }
         }
     }, 
     {
         type: 'input',
         name: 'department',
         message: 'Enter the name of the department for this role. (Required)'
         // write custom validation to make sure exist and a string
     },
     {
         type: 'input',
         name: 'salary',
         message: ' Enter the salary for this role. (Required)'
         // write custom validation to make sure exist and an integer
     }
 ]