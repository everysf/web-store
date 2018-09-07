var inquirer = require("inquirer");
var mysql = require("mysql");

var space = "\n=====================================\n"

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start()
});

function viewTable() {
    console.log("") 
    console.log(space)
    console.log("")
    connection.query("Select * from products ORDER BY department_name, product_name", function (error, response) {
        if (error) throw error;
        displayTable(response, callback)
    });
}

function displayTable(response, callback){
    var inventory = new Table({
        head: ["ID", "Product", "Department", "Price", "Stock"],
        colWidths: [10, 40, 20, 15, 15]
    });
    response.forEach(element => {
        inventory.push([element.item_id, element.product_name, element.department_name, parseFloat(element.price).toFixed(2), element.stock_quantity]);
    });
    console.log(inventory.toString());
    pause(callback);
}

function start() {
    console.log("")
    console.log(space)
    console.log("")
    console.log("Welcome to Bamazon!")
    console.log("")

    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Items", "Make Purchase", "Exit"],
        name: "choice"
    }]).then(function(answer){
        switch(answer.choice) {
            case "View Items":
                viewTable();
                break;
        }
    })

}