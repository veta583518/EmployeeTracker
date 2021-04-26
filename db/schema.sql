/* Drop Database*/
DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;
USE employeesDB;
/* Drop tables */
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;
/* Department table creation */
CREATE TABLE departments(
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(30),
    PRIMARY KEY (id)
);
/* Role table creation */
CREATE TABLE roles (
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER(11),
    CONSTRAINT fk_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE
    SET NULL,
        PRIMARY KEY (id)
);
/* Employee table creation */
CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER(11),
    manager_id INTEGER(11),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE
    SET NULL,
        PRIMARY KEY (id)
);