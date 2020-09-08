const mysql = require("mysql");
const figlet = require('figlet');
const inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "employee_trackerDB"
});


connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  figlet('EMPLOYEE TRACKER!!', function (err, data) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(data)
    mainOptions();
  });
});


function mainOptions() {
  inquirer.prompt([
    {
      type: "list",
      message: " What would you like to do?",
      name: "MainOption",
      choices: [
        "View all employees",
        "View all employees by department",
        "View all employees by manager",
        "Add Department",
        "Add Role",
        "Add employee",
        "Remove employee",
        "Update employee role",
        "Update employee manager",
        "EXIT"
      ]
    }
  ]).then(function (data) {
    if (data.MainOption === "View all employees") {
      showEmployees();
    } else if (data.MainOption === "View all employees by department") {
      empDep();
    } else if (data.MainOption === "View all employees by manager") {
      empMan();
    } else if (data.MainOption === "Add Department") {
      createDep();
    } else if (data.MainOption === "Add Role") {
      createRole();
    } else if (data.MainOption === "Add employee") {
      createEmp()
    } else if (data.MainOption === "Remove employee") {
      deleteEmp();
    } else if (data.MainOption === "Update employee role") {
      updateRole();
    } else if (data.MainOption === "Update employee manager") {
      updateManager();
    } else if (data.MainOption === "EXIT") {
      process.exit();
    }
  });
};

function showEmployees() {
  console.log("Selecting all employees...\n");
  connection.query("SELECT employee.id, first_name, last_name, title, salary, name FROM employee JOIN role on employee.role_id = role.id JOIN department ON role.department_id = department.id", function (err, res) {
    if (err) throw err;
    console.table(res);
    mainOptions();
  });
};

function showDepartments() {
  console.log("Selecting all departments...\n");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    mainOptions();
  });
};

function showRoles() {
  console.log("Selecting all roles...\n");
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    mainOptions();
  });
};

function empMan() {
  inquirer.prompt([
    {
      type: "list",
      message: " What Manager type would you like?",
      name: "manager",
      choices: [
        "Director",
        "Manager"
      ]
    }
  ]).then(function (data) {
    connection.query("SELECT employee.id, first_name, last_name, name FROM employee INNER JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE ?",
      {
        title: data.manager
      },
      function (err, res) {
        if (err) throw err;
        let managers = [];
        for (let i = 0; i < res.length; i++) {
          res[i].id;
          res[i].first_name;
          managers.push(res[i].first_name + ' ' + res[i].last_name + ' --- Department: ' + res[i].name + ',' + ' ID: ' + res[i].id);
        }
        empManList(managers)
      });
  });
};

function empManList(managers) {
  console.log("Selecting all employees by manager...\n");
  inquirer.prompt([
    {
      type: "list",
      message: " What Manager would you like to see the staff for?",
      name: "manager",
      choices: managers
    }
  ]).then(function (data) {
    let newData = data.manager.split(' ID: ');
    connection.query("SELECT first_name, last_name, title FROM employee INNER JOIN role ON employee.role_id = role.id WHERE ?",
      {
        manager_id: newData[1]
      },
      function (err, res) {
        if (err) throw err;
        console.log("The table below are all the employees that " + newData[0] + " manages.")
        console.table(res);
        mainOptions();
      });
  });
};


function empDep() {
  console.log("Selecting all employees by department...\n");
  inquirer.prompt([
    {
      type: "list",
      message: " What Department would you like?",
      name: "department",
      choices: [
        "Sales",
        "Finance",
        "Admin",
        "HR"
      ]
    }
  ]).then(function (data) {
    connection.query("SELECT first_name, last_name, title, name FROM employee JOIN role ON employee.role_id = role.id JOIN department on role.department_id = department.id WHERE ?",
      {
        name: data.department
      },
      function (err, res) {
        if (err) throw err;
        console.table(res);
        mainOptions();
      });
  });
};

function createDep() {
  console.log("Inserting new deapartment...\n");
  inquirer.prompt([
    {
      type: "input",
      message: " What is the name of the new department?",
      name: "newDep",
    }
  ]).then(function (data) {
    connection.query("INSERT INTO department SET ?",
      {
        name: data.newDep
      },
      function (err, res) {
        if (err) throw err;
        showDepartments()
      });
  });
};

function createRole() {
  console.log("Inserting new Roles...\n");
  inquirer.prompt([
    {
      type: "input",
      message: " What is the name of the new Role?",
      name: "newRole",
    },
    {
      type: "input",
      message: " What is the new salary for the new Role?",
      name: "salary",
    }
  ]).then(function (data) {
    connection.query("INSERT INTO role SET ?",
      {
        title: data.newRole,
        salary: data.salary
      },
      function (err, res) {
        if (err) throw err;
        showRoles()
      });
  });
};

function createEmp() {
  console.log("Inserting new Employee...\n");
  inquirer.prompt([
    {
      type: "input",
      message: " What is the first name of the new Employee?",
      name: "firstName",
    },
    {
      type: "input",
      message: " What is the last name of the new Employee?",
      name: "lastName",
    }
  ]).then(function (data) {
    connection.query("INSERT INTO employee SET ?",
      {
        first_name: data.firstName,
        last_name: data.lastName
      },
      function (err, res) {
        if (err) throw err;
        showEmployees()
      });
  });
};

function deleteEmp() {
  console.log("Deleteing an Employee...\n");
  let firstName = [];
  connection.query("SELECT * FROM employee", function (err, res) {
    for (let i = 0; i < res.length; i++) {
      res[i].first_name
      firstName.push(res[i].first_name + ' ' + res[i].last_name);
    }
    inquirer.prompt([
      {
        type: "list",
        message: " What is the name of the employee you wish to delete?",
        name: "deleteEmp",
        choices: firstName
      }
    ]).then(function (data) {
      let newDelName = data.deleteEmp.split(' ');
      connection.query("DELETE FROM employee WHERE ?",
        {
          first_name: newDelName[0]
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee, " + data.deleteEmp + " deleted!\n");
          mainOptions();
        });
    });
  })
};

function updateRole() {
  console.log("Update an Employee's role...\n");
  let firstName = [];
  connection.query("SELECT * FROM employee", function (err, res) {
    for (let i = 0; i < res.length; i++) {
      res[i].first_name
      firstName.push(res[i].first_name + ' ' + res[i].last_name);
    }
    inquirer.prompt([
      {
        type: "list",
        message: " What is the name of the employee you wish to update?",
        name: "updateEmp",
        choices: firstName
      },
      {
        type: "list",
        message: " What role would you like to update them to?",
        name: "updateRole",
        choices: [
          "Directore",
          "Manager",
          "Staff"
        ]
      }
    ]).then(function (data) {
      let newName = data.updateEmp.split(' ')
      connection.query("UPDATE role JOIN employee ON employee.role_id = role.id SET ? WHERE ?",
        [{
          title: data.updateRole
        },
        {
          first_name: newName[0]
        }],
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " employee, " + data.updateEmp + " updated to " + data.updateRole + "!\n");
          mainOptions();
        });
    });
  })
};

function updateManager() {
  console.log("Selecting all employees...\n");
  connection.query("SELECT employee.id, first_name, last_name FROM employee",
    function (err, res) {
      let newEmpMan = []
      for (let i = 0; i < res.length; i++) {
        res[i].first_name
        newEmpMan.push(res[i].first_name + ' ' + res[i].last_name);
      }
      inquirer.prompt([
        {
          type: "list",
          message: " What employee whould you like to assign a new manager?",
          name: "empNewMan",
          choices: newEmpMan
        }
      ]).then(function (data) {
        if (err) throw err;
        selectManager(data);
      });
    });
};

function selectManager(data) {
  let newManager = data.empNewMan.split(' ');
  connection.query("SELECT employee.id, first_name, last_name FROM employee WHERE NOT ?",
    {
      first_name: newManager[0]
    },
    function (err, res) {
      let newEmpMan = []
      for (let i = 0; i < res.length; i++) {
        res[i].first_name
        newEmpMan.push(res[i].first_name + ' ' + res[i].last_name + ' ID: ' + res[i].id);
      }
      inquirer.prompt([
        {
          type: "list",
          message: " Who would you like to assign to be this employee's new manager?",
          name: "empNewMan",
          choices: newEmpMan
        }
      ]).then(function (data) {
        if (err) throw err;
        updateSelectedMan(data, newManager)
      });
    });
};

function updateSelectedMan(data, newManager) {
  let choice = data.empNewMan.split(' ');
  //console.log(choice);
  //console.log(newManager);
  connection.query("UPDATE employee SET ? WHERE ?",
    {
      manager_id: choice[3]
    },
    {
      first_name: newManager[0]
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " Rows Updated, The Employee " + choice[0] + " " + choice[1] + " has been assigend as the manager for " + newManager[0] + " " + newManager[1])
    })
  mainOptions();
};


