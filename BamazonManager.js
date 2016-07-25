var mysql      = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'Bamazon'
});
connection.connect();

var showProducts = function(lowInventory){
	var query = 'select * from Products';
	if(lowInventory) {
		query = query + ' where StockQuantity<5';
	}
	connection.query(query, function(err, rows, fields) {
  		if (err) throw err;
  		if(rows.length === 0 && lowInventory) {
			console.log('No Products with low inventory');
		} else {
	  		console.log('ItemID\tPdt Name\tPrice\tStock');
	  		var data = {};
	  		rows.forEach(function(row){
	  			data[row.ItemID] = row;
	  			console.log(row.ItemID + "\t" + row.ProductName + "\t" + row.Price + "\t" + row.StockQuantity);
	  		});
  		}
  		showMenu();
	});
};

var addInventory = function(){
	inquirer.prompt([{
					type: 'input', 
					message: "Please enter ID of product you'd like to increase the stock for (Ctrl + c to quit)",
					name: 'ItemID'
				}, {
					type: 'input', 
					message: "Please enter quantity being added (Ctrl + c to quit)",
					name: 'qty'
				}]).then(function (choices) {
					var query = "update Products set StockQuantity = StockQuantity + " + choices.qty + " where ItemID=" + choices.ItemID;
					connection.query(query, function(err, rows, fields) {
				  		if (err) throw err;
				  		console.log('Stock updated successfully!');
					});
					showMenu();
						
	});
};

var addNewPdt = function(){
	var questions = [{
		type: 'input',
		name: 'ProductName',
		message: 'Product Name'
	},{
		type: 'input',
		name: 'DepartmentName',
		message: 'Department Name'
	},{
		type: 'input',
		name: 'Price',
		message: 'Price'
	},{
		type: 'input',
		name: 'StockQuantity',
		message: 'Stock Quantity'
	}];

	inquirer.prompt(questions).then(function (choices) {
		var query = "insert into Products(ProductName,DepartmentName,Price,StockQuantity) values('" + choices.ProductName + "', '" + choices.DepartmentName + "', '" + choices.Price + "', '" + choices.StockQuantity + "')";
		connection.query(query, function(err, rows, fields) {
	  		if (err) throw err;
	  		console.log('Product added successfully!');
		});
		showMenu();
	});	
};

var showMenu = function(){
	var choices = ['1) View Products for Sale', '2) View Low Inventory', '3) Add to Inventory', '4) Add New Product'];
	var menu = {
					type: 'list', 
					message: "Please select an option (Ctrl + c to quit)",
					name: 'selectedAction',
					choices: choices,
					default: 0
				};
	inquirer.prompt([menu]).then(function (selected) {
		switch(choices.indexOf(selected.selectedAction)) {
			case 0: showProducts();
			break;
			case 1: showProducts(true);
			break;
			case 2: addInventory();
			break;
			case 3: addNewPdt();
			break;
		}
	});
};

showMenu();