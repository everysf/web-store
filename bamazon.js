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

function homeMenu(){
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Items", "Make Purchase", "Add Item", "Exit"],
        name: "choice"
    }]).then(function(answer){
        switch(answer.choice) {
            case "Add Item":
                createItems();
                break;
            case "View Items":
                readItems(homeMenu);
                break;
            case "Make Purchase":
                deleteItems();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

function deleteItems() {
    readItems(removeItem)
}

function removeItem() {
    console.log("Which item would you like to purchase?")
    inquirer.prompt([{
        message: "Select SKU",
        name: "item"
    }]).then(function(answer){
        
        connection.query("SELECT * FROM products WHERE ?", {item_ID: answer.item}, function(error, response){

            if (response[0].stock_quantity < 1 ) {
                console.log("There are no more of this item")
                homeMenu()
                return
            }

            var newQuantity = response[0].stock_quantity - 1
            var currentPrice = response[0].price
            var currentName = response[0].product_name

            connection.query("UPDATE products SET ? where ?", [
                {
                    stock_quantity: newQuantity
                }, {
                    item_ID: answer.item
                }
            ], function(error, response){
                if(error) throw (error)
                console.log("")
                console.log(space)
                console.log("")
                console.log("You purchased " + currentName + " for $" + currentPrice)
                console.log("Updated Quantity: " + newQuantity)
                console.log("")
                console.log(space)
                console.log("")
                homeMenu()
                return
            })

        })
    })
}

function createItems(){
    inquirer.prompt([{
        message: "Item Name:",
        name: "name"
    },
    {
        message: "Item Price:",
        name: "price"
    },
    {
        type: "list",
        message: "Department:",
        choices: ["Technology", "Household", "Books/Media", "Food"],
        name: "department"
    },
    {
        message: "Quantity:",
        name: "quantity"
    }]).then(function(answer){
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.name,
            department_name: answer.department,
            price: parseFloat(answer.price),
            stock_quantity: parseInt(answer.quantity)
        }, function (error, response){   
        console.log("Item added: " + answer.name + " || $" + answer.price + " || " + answer.department + " || " + "Units available: " + answer.quantity);
        })
        homeMenu()
    })
}

function renderInventory(res, callback) {
    console.log(res.length)
    for (var i = 0; i < res.length; i++) {
        console.log("SKU " + res[i].item_id + " || " + res[i].product_name + " || Units available: " + res[i].stock_quantity)
    }
    callback()
}

function readItems(callback){
    connection.query("Select * FROM products ORDER BY item_ID", function (error, res) {
        if (error) throw error;
        renderInventory(res, callback)
    });
}

function start() {
    console.log("")
    console.log(space)
    console.log("")
    console.log("Welcome to Bamazon!")
    console.log("")
    homeMenu()
}