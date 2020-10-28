const mysql = require("mysql");
const inquirer = require("inquirer");
// const consoleTable = require("console.table");
// const promisemysql = require("promise-mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Apple@1324",
    database: "employeedb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\n Welcome to OMG Employee Tracker \n");
    createTracker();
});

function createTracker() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "VIEW all employees", "VIEW departments", "VIEW roles",
                "ADD employee", "ADD department", "ADD role",
                "UPDATE employee roles",
                "EXIT"
            ]
        })
        .then(userChoice => {
            switch (userChoice.action) {
                case "VIEW all employees":
                    viewAllemployees();
                    break;

                case "VIEW departments":
                    viewDepts();
                    break;

                case "VIEW roles":
                    viewRoles();
                    break;

                case "ADD employee":
                    addEmployee();
                    break;

                case "ADD department":
                    addDept();
                    break;

                case "ADD roles":
                    addRoles();
                    break;

                case "UPDATE employee roles":
                    updateRoles();
                    break;

                default: "EXIT"
                    connection.end();

            }
        });

}

function viewAllemployees() {
    connection.query("SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, CONCAT (m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC"
        , function (err, res) {
            if (err) throw err;
            console.log("\n");
            // Display query results using res.table
            console.table(res);

            // back to create tracker
            createTracker();

        });
}

function viewDepts() {

    connection.query("SELECT * FROM department", function (err, res) {

        if (err) throw err;
        console.table(res);
        createTracker();
    });

}

function viewRoles() {

    connection.query("SELECT * FROM role ORDER BY salary DESC", function (err, res) {

        if (err) throw err;
        console.table(res);
        createTracker();
    });

}

function addEmployee() {

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, concat(employee.first_name, ' ' ,  employee.last_name) AS full_name FROM employee INNER JOIN role ON employee.role_id=role.id", (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is employee's first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is employee's role?",
                    choices: function () {
                        console.log(results);

                        let choiceArray = results.map(choice => choice.title);
                        return choiceArray;
                    },
                },


                {
                    name: "manager",
                    type: 'list',
                    message: "Who is employee's manager?",
                    choices: function () {
                        let managerArray = results.map(manager => manager.full_name);
                        return managerArray;
                    },

                }

            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                console.log(answer);
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err) => {
                    if (err) return err;

                    // Confirm employee has been added
                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    createTracker();
                });


            });
    });

}


// Add department, roles, employees





// update employee roles