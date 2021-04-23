/* Fill deppartment table */
INSERT INTO departments (dept_name)
VALUES ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');
/* Fill role table */
INSERT INTO roles (title, salary, dept_id)
VALUES ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4),
    ('Accounting Lead', 180000, 3),
    ('Paralegal', 100000, 4),
    ('Financial Analyst', 1500000, 3),
    ('Junior Developer', 100000, 3);
/* Fill employees table */
INSERT INTO employees (
        first_name,
        last_name,
        role_id,
        manager_id
    )
VALUES ('Ida', 'Martin', 1, NULL),
    ('Eddie', 'Taylor', 3, NULL),
    ('Edwin', 'Summers', 4, 3),
    ('LaKeya', 'Summers', 8, NULL),
    ('Veronica', 'Williams', 6, NULL),
    ('Brittany', 'Cameron', 7, 6),
    ('Kerrick', 'Duckett', 9, 6),
    ('SamQuia', 'Parker', 10, 8),
    ('Lynisha', 'Booker', 5, 8),
    ('Elisa', 'Denton', 11, 3),
    ('Eddrick', 'Taylor', 2, 1);