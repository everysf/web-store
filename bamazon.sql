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

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (01, "Amazon Echo", "Technology", 100, 256);