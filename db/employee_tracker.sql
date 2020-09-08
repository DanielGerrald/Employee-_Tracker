-- Drops the employee_tracker_db if it exists currently --
DROP DATABASE IF EXISTS employee_trackerDB;
-- Creates the "employee_tracker_db" database --
CREATE DATABASE employee_trackerDB;

-- Make it so all of the following code will affect employee_tracker_db --
USE employee_trackerDB;

-- Creates the table "department" within employee_tracker_db --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (ID)
);

-- Creates the table "role" within employee_tracker_db --
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT,
    PRIMARY KEY (ID)
);

-- Creates the table "employee" within employee_tracker_db --
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    PRIMARY KEY (ID)
);

INSERT INTO department (name)
VALUES ("Sales"),("Finance"),("Admin"),("HR");

INSERT INTO role (title,salary,department_id)
VALUES  ("Director",20.50,1),("Manager", 15.50,1),("Staff", 9.50,1),("Staff", 9.50,1),
		("Director",20.50,2),("Manager", 15.50,2),("Staff", 9.50,2),("Staff", 9.50,2),
		("Director",20.50,3),("Manager", 15.50,3),("Staff", 9.50,3),("Staff", 9.50,3),
		("Director",20.50,4),("Manager", 15.50,4),("Staff", 9.50,4),("Staff", 9.50,4);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
Value   ("Naruto","Uzumaki",4,3),("Sasuke","Uchiha",3,3),("Sakura","Haruno",2,4),("Kakashi","Hatake",1,null),
        ("Hinata","Hyuga",8,7),("Kiba","Inuzuka",7,7),("Shino","Aburame",6,8),("Kurenai","Yuhi",5,null),
        ("Shikamaru","Nara",12,11),("Choji","Akimichi",11,11),("Ino","Yamanaka",10,12),("Asuma","Sarutobi",9,null),
        ("Rock","Lee",16,15),("Neji","Hyuga",15,15),("Tenten","Yuhi",14,16),("Might","Guy",13,null);
        
        
        