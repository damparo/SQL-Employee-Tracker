var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "company_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  addDRE();
  // queryEmpinfo();
});

function addDRE() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "updateDRE",
        message:
          "Would you like to add [department], [role], [employee], or view/update info?",
        choices: [
          "department",
          "role",
          "employee",
          "display info",
          "update Einfo",
          "exit",
        ],
      },
    ])
    .then(function (response) {
      switch (response.updateDRE) {
        case "department":
          addDEPT();
          break;
        case "role":
          addROLE();
          break;
        case "employee":
          addEMP();
          break;
        case "display info":
          disPLAYINF();
          break;
        case "update Einfo":
          updateEINFO();
          break;
        case "exit":
          Exit();
          break;
      }
    });
}

function Exit() {
  console.log("bye");
  process.exit();
}

async function addDEPT() {
  const dept = await inquirer.prompt([
    {
      name: "typeofdept",
      message: "Name of Department?",
    },
  ]);
  console.log(dept);

  var query = connection.query(
    "INSERT INTO department SET ?",
    {
      department_name: dept.typeofdept,
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows);
      addDRE();
    }
  );
  console.log(query.sql);
}

async function addROLE() {
  const depts = await connection.query(
    "SELECT * FROM  company_db.department",
    function (err, res) {
      if (err) throw err;
      const results = depts._results[0];
      decisions = results.map((department) => ({
        name: department.department_name,
        value: department.id,
      }));
      // console.log(decisions);
      promptRole(decisions);
    }
  );
}

async function promptRole(departments) {
  const role = await inquirer.prompt([
    {
      name: "rolename",
      message: "Name of role?",
    },
    {
      name: "salary",
      message: "Salary amount?",
    },
    {
      name: "department",
      type: "list",
      message: "Which department to add new role?",
      choices: departments,
    },
  ]);
  console.log(role);
  var query = connection.query(
    "INSERT INTO _role SET ?",
    {
      title: role.rolename,
      salary: role.salary,
      department_id: role.department,
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows);
      addDRE();
    }
  );
  console.log(query.sql);
}

async function addEMP() {
  const depts = await connection.query(
    "SELECT * FROM  company_db.department",
    function (err, res) {
      if (err) throw err;
      const results = depts._results[0];
      decisions = results.map((department) => ({
        name: department.department_name,
        value: department.id,
      }));
      // console.log(decisions);
      promptEmployee(decisions);
    }
  );
}

async function promptEmployee(departments) {
  const employee = await inquirer.prompt([
    {
      name: "firstname",
      message: "what is the first name?",
    },
    {
      name: "lastname",
      message: "what is the last name?",
    },
    {
      name: "roleID",
      message: "what is the role ID?",
    },
    {
      name: "managerID",
      message: "what is the manager ID?",
    },

    {
      name: "department",
      type: "list",
      message: "Which department to add new employee?",
      choices: departments,
    },
  ]);
  console.log(employee);
  var query = connection.query(
    "INSERT INTO _employee SET ?",
    {
      first_name: employee.firstname,
      last_name: employee.lastname,
      role_id: employee.roleID,
      manager_id: employee.managerID,
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows);
      addDRE();
    }
  );
  console.log(query.sql);
}

function disPLAYINF() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "displayDRE",
        message: "Would you like to view [department], [role], or [employee]?",
        choices: ["department", "role", "employee", "exit"],
      },
    ])
    .then(function (response) {
      switch (response.displayDRE) {
        case "department":
          dispDEPT();
          break;
        case "role":
          dispROLE();
          break;
        case "employee":
          dispEMP();
          break;
      }
    });
}

function dispDEPT() {
  connection.query("SELECT * FROM  company_db.department", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  addDRE();
}
function dispROLE() {
  connection.query("SELECT * FROM  company_db._role", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  addDRE();
}
function dispEMP() {
  connection.query("SELECT * FROM  company_db._employee", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  addDRE();
}



async function updateEINFO() {
  const emps = await connection.query(
    "SELECT * FROM  company_db._employee",
    function (err, res) {
      if (err) throw err;
       const results = emps._results[0];
      decisions = results.map((_employee) => ({
        name: _employee.first_name,
	      name: _employee.last_name,
	      value: _employee.role_id,
	      value: _employee.manager_id,
        value: _employee.id,
      }));
      // console.log(decisions);
      promptEmployee(decisions);
    }
  );
}


async function promptEmployee(departments) {
    const employee = await inquirer.prompt([
    {
      name: "firstname",
      message: "what is the first name?",
    },
    {
      name: "lastname",
      message: "what is the last name?",
    },
	{
      name: "roleID",
      message: "what is the role ID?",
    },
	{
      name: "managerID",
      message: "what is the manager ID?",
    },
    {
      name: "ID",
      message: "what is the ID?",
    },
    // {
    //   name: "department",
    //   type: "list",
    //   message: "Which department to add new employee?",
    //   choices: departments,
    // },
  ]);
  console.log(employee);
  var query = connection.query(
    "UPDATE _employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?",
  [
    
    employee.firstname, 
    employee.lastname,
    employee.roleID,
    employee.managerID,
    employee.ID,

  ],

  function(err, res) {
    if (err) throw err;
    console.log(res.affectedRows);
    addDRE();
  }
  );
  console.log(query.sql);
}























// function updateEINFO() {
//   console.log("Updating employee roles...\n");
//   var query = connection.query(
//     "UPDATE _employee SET ? WHERE ?",

//     [
//       {
//         first_name: "ridley",
//         last_name: "scott",
//         role_id: 3,
//         manager_id: 5,
//       },
//       {
//         id: 1,
//       },
//     ],
//     function (err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " _employee updated!\n");
//     }
//   );

//   console.log(query.sql);
//   addDRE();
// }
