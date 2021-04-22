/* Drop tables */
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;
/* Employee table creation */
CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER UNSIGNED NOT NULL,
    manager_id INTEGER UNSIGNED,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_manager_id FOREIGN KEY(manager_id) REFERENCES employees(manager_id) ON ON DELETE
    SET NULL
);
/* Role table creation */
CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER UNSIGNED NOT NULL,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);
/* Department table creation */
CREATE TABLE departments (
    id INTEGER PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);