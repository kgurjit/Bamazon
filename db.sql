create database Bamazon;

use Bamazon;

create table Products(ItemID int auto_increment primary key,
			ProductName varchar(200) not null, 
			DepartmentName varchar(200) not null, 
            Price decimal(10,2) not null,
            StockQuantity int not null) ;

INSERT INTO products(ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Apples","Fruits",1.5, 200),
    ("Oranges","Fruits",1.25,200),
    ("Canned Soup","Food",2.5,200),
    ("Wrench Set","Tools",27.50,100),
    ("Drill","Tools",59.0,125),
    ("Citizen Eco Watch","Jewellery",250.50,40),
    ("Rado Watch","Jewellery",2500,25),
    ("Hunts Tomato Sauce","Food",5.40,125),
    ("AE Polo","Apparel",29.90,50),
    ("Washed Denim","Apparel",39.9,50);