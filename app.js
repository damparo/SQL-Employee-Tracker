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
      console.log(decisions);
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
    department_id: role.department
  },
  function(err, res) {
    if (err) throw err;
    console.log(res.affectedRows);
    addDRE();
  }
  );
  console.log(query.sql);
}

function addEMP() {
  var query = connection.query(
    "INSERT INTO _employee SET ?",
    {
      first_name: "james",
      last_name: "bond",
      role_id: "998",
      manager_id: "111",
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

function updateEINFO() {
  console.log("Updating employee roles...\n");
  var query = connection.query(
    "UPDATE _employee SET ? WHERE ?",

    [
      {
        first_name: "ridley",
        last_name: "scott",
        role_id: 3,
        manager_id: 5,
      },
      {
        id: 1,
      },
    ],
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " _employee updated!\n");
    }
  );

  console.log(query.sql);
  addDRE();
}
