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
  database: "company_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  addDRE()
  // queryEmpinfo();
});

function addDRE () {
  inquirer
    .prompt ([
      {
        type: "list",
        name: "updateDRE",
        message: "Would you like to add [department], [role], or [employee]?",
        choices: ["department", "role", "employee", "exit"]
      }
    ]).then(function(response) {
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
    
      }
    });
}

function addDEPT () {
  var query = connection.query(
    "INSERT INTO department SET ?",
  {
    department_name: "human resources",

  },
  function(err, res) {
    if (err) throw err;
    console.log(res.affectedRows);
    addDRE();
  }
  );
  console.log(query.sql);
  // console.log(table);
}

function addROLE () {
  var query = connection.query(
    "INSERT INTO _role SET ?",
  {
    title: "chemical engineer",
    salary: "35",
    department_id:"007"

  },
  function(err, res) {
    if (err) throw err;
    console.log(res.affectedRows);
    addDRE();
  }
  );
  console.log(query.sql);
  // console.log(table);
}

function addEMP () {
  var query = connection.query(
    "INSERT INTO _employee SET ?",
  {
    first_name: "james",
    last_name: "James",
    role_id:"998",
    manager_id: "111"
  },
  function(err, res) {
    if (err) throw err;
    console.log(res.affectedRows);
    addDRE();
  }
  );
  // console.log(query.sql);
  console.table(res);
}

// function queryEmpinfo() {
//   // figure out query inside workbench then copy to js
//   connection.query("SELECT * FROM _employee", function(err, res) {
//     if (err) throw err;
//     // console.log(res);
//     console.table(res);
//     // connnection.end kills connection after response
//     connection.end();
//   });
// }
