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

                
                case "UPDATE employee roles":
                    updateRoles();
                    break;
                
                case "DELETE employee":
                    deleteEmployee();
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

    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.id, role.title, concat(employee.first_name, ' ' ,  employee.last_name) AS full_name FROM employee INNER JOIN role ON employee.role_id=role.id", (err, results) => {
        if (err) throw err;
        connection.query("SELECT role.id, role.title from role", (err, role) => {
            if (err) throw err;
            // console.log(role);
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
                        message: "What is employee's roleID?",
                        choices: function () {
                            // console.log(results);
                            let choiceArray = role.map(role => role.id);
                            return choiceArray;
                        },
                    },

                    {
                        name: "manager",
                        type: 'list',
                        message: "Who is employee's managerID?",
                        choices: function () {
                            let managerArray = results.map(employee => employee.id);
                            return managerArray;
                        },

                    }

                ])
                .then(function (answer) {
                    // when finished prompting, insert a new item into the db with that info
                    console.log(answer);
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ("${answer.first_name}", "${answer.last_name}", "${answer.role}", "${answer.manager}")`, (err) => {
                        if (err) console.log(err);

                        // Confirm employee has been added
                        console.log(`\n EMPLOYEE ${answer.first_name}, ${answer.last_name} ADDED...\n `);
                        createTracker();
                    });

                });

        })

    });

}

function updateRoles() {

    connection.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS full_name FROM employee", (err, results) => {
        if (err) throw err;
        connection.query("SELECT role.id, role.title from role", (err, role) => {
            if (err) throw err;
            // console.log(role);
            inquirer
                .prompt([

                    {
                        name: "employee",
                        type: 'list',
                        message: "Who is employee?",
                        choices: function () {
                            let employeeArray = results.map(employee => employee.full_name);
                            return employeeArray;
                        },

                    },

                    {
                        name: "role",
                        type: "list",
                        message: "What is employee's role to be updated?",
                        choices: function () {
                            // console.log(results);
                            let choiceArray = role.map(role => role.title);
                            return choiceArray;
                        },
                    },

                ])
                .then(function (answer) {
                    // when finished prompting, insert a new item into the db with that info
                    console.log(answer);
                  
                    connection.query(
                        `UPDATE employee 
                        SET role_id = (SELECT id FROM role WHERE title = ? ) 
                        WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`
                        , [answer.role, answer.employee], (err) => {
                        if (err) throw err;
                      

                        // confirm update employee
                        console.log(`\n "${answer.employee}" ROLE UPDATED TO "${answer.role}"...\n `);

                        // back to main menu
                        createTracker();
                    });
                });


        });

    });

}


function deleteEmployee() {
    
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.id, role.title, concat(employee.first_name, ' ' ,  employee.last_name) AS full_name FROM employee INNER JOIN role ON employee.role_id=role.id", (err, results) => {
        if (err) throw err;
        connection.query("SELECT role.id, role.title from role", (err, role) => {
            if (err) throw err;
            // console.log(role);
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
                        message: "What is employee's roleID?",
                        choices: function () {
                            // console.log(results);
                            let choiceArray = role.map(role => role.id);
                            return choiceArray;
                        },
                    },

                    {
                        name: "manager",
                        type: 'list',
                        message: "Who is employee's managerID?",
                        choices: function () {
                            let managerArray = results.map(employee => employee.id);
                            return managerArray;
                        },

                    }

                ])
                .then(function (answer) {
                    // when finished prompting, insert a new item into the db with that info
                    console.log(answer);
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ("${answer.first_name}", "${answer.last_name}", "${answer.role}", "${answer.manager}")`, (err) => {
                        if (err) console.log(err);

                        // Confirm employee has been added
                        console.log(`\n EMPLOYEE ${answer.first_name}, ${answer.last_name} ADDED...\n `);
                        createTracker();
                    });

                });

        })

    });



}





// }

// Add department, roles, employees





// update employee roles