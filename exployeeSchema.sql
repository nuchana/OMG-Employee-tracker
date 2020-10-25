DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR (30),
  PRIMARY KEY (id)
);


CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  PRIMARY KEY (id)
);



INSERT INTO department (name) VALUES ("Engineer");
INSERT INTO department (name) VALUES ("Marketing");


INSERT INTO role (title, salary, department_id)
VALUES ("Senior Engineer", 5000, 101);
INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 4000, 102);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Grace", "Johnson", 1, 2001);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kai", "Awesome", 2, 2002);




