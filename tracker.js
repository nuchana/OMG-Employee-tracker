var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Apple@1324",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    createTracker();
});

function createTracker() {
    inquirer
        .prompt({
            name: "addOrViewOrUpdate",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "ADD departments", "ADD roles", "ADD employees",
                "VIEW departments", "VIEW roles", "VIEW employees",
                "UPDATE employee roles",
                "EXIT"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.addOrViewOrUpdate === "VIEW all") {
                viewAll(); 
            }
            else if (answer.addOrViewOrUpdate === "ADD employees") {
                addEmployee();

            }
            else if (answer.addOrViewOrUpdate === "UPDATE emplyee roles") {
                updateEmployeeRoles();
            }

            else {
                connection.end();
            }
        });

function viewAll() {
    connection.query("SELECT * FROM department", "SELECT * FROM role", "SELECT * employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        
    });
}

//     SELECT * FROM authors;
// SELECT * FROM books;

// -- show ALL books with authors
// -- INNER JOIN will only return all matching values from both tables
// SELECT title, firstName, lastName
// FROM books
// INNER JOIN authors ON books.authorId = authors.id;

//     function addEmployee() {
//         // prompt for info about the item being put up for auction
//         inquirer
//             .prompt([
//                 {
//                     first_name: "first name",
//                     type: "input",
//                     message: "What is employee's first name?"
//                 },

//                 {
//                     last_name: "last name",
//                     type: "input",
//                     message: "What is employee's last name?"
//                 },
//                 {
//                     name: "role",
//                     type: "input",
//                     message: "What is employee's role?"
//                 },

//                 {
//                     name: "manager",
//                     type: "input",
//                     message: "Who is employee's manager?"
//                 },

//             ])
//             .then(function (answer) {
//                 // when finished prompting, insert a new item into the db with that info
//                 connection.query(
//                     "INSERT INTO employee SET ?",
//                     {
//                         first_name: answer.first_name,
//                         last_name: answer.last_name,
//                         role_id: answer.category,
//                         starting_bid: answer.startingBid || 0,
//                         highest_bid: answer.startingBid || 0
//                     },
//                     function (err) {
//                         if (err) throw err;
//                         console.log("Your auction was created successfully!");
//                         // re-prompt the user for if they want to bid or post
//                         start();
//                     }
//                 );
//             });
//     }
// }



// Add department, roles, employees


// view departments, roles, employees



// update employee roles