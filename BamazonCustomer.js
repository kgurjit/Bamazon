var mysql      = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'Bamazon'
});
connection.connect();

var showProductsAndPromtUser = function(onlyPrompt, existingData){
	if(onlyPrompt) {
		promptUser(existingData);
		return;
	}
	connection.query('select * from Products', function(err, rows, fields) {
  		if (err) throw err;
  		console.log('ItemID\tPdt Name\tPrice\tStock');
  		var data = {};
  		rows.forEach(function(row){
  			data[row.ItemID] = row;
  			console.log(row.ItemID + "\t" + row.ProductName + "\t" + row.Price + "\t" + row.StockQuantity);
  		});
  		promptUser(data);
	});
};

var promptUser = function(data){
	inquirer.prompt([{
					type: 'input', 
					message: "Please enter ID of product you'd like to buy (Ctrl + c to quit)",
					name: 'ItemID'
				}, {
					type: 'input', 
					message: "Please enter quantity (Ctrl + c to quit)",
					name: 'qty'
				}]).then(function (choices) {
					if(!data[choices.ItemID]) {
						console.log('Invalid product selected');
					} else {
						var details = data[choices.ItemID];
						if(choices.qty >= details.StockQuantity) {
							console.log("Insufficient quantity.");
							showProductsAndPromtUser(true, data);
						} else {
							var totalCost = choices.qty * details.Price;
							var query = "update Products set StockQuantity = StockQuantity - " + choices.qty + " where ItemID=" + choices.ItemID;
							connection.query(query, function(err, rows, fields) {
						  		if (err) throw err;
						  		console.log('Purchase complete. Your total cost is: ' + totalCost);
						  		showProductsAndPromtUser();
							});
						}
					}
	});
};

var runApplication = function(){
	showProductsAndPromtUser();
};


runApplication();
