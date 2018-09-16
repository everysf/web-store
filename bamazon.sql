DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
   item_id INT NOT NULL PRIMARY KEY,
   product_name VARCHAR(50) NOT NULL,
   department_name VARCHAR(50) NOT NULL,
   price INT NOT NULL,
   stock_quantity INT NOT NULL
);

