/* Fill deppartment table */
INSERT INTO departments (department_name)
VALUES ('Finance'),
    ('Business Solutions'),
    ('Customer Service'),
    ('Construction'),
    ('Book');
/* Fill role table */
INSERT INTO roles (title, salary, department_id)
VALUES ('Manager', 70000.00, ?),
    ('Brick Mason', 55000.00, 4),
    ('Material Handler', 50000.00, 2),
    ('Quality Auditor', 55000.00, 2),
    ('Administrative Assistant', 50000.00, 3),
    ('Accountant', 55000.00, 1),
    ('Land Surveyor', 50000.00, 4),
    ('Author', 65000.00, 5),
    ('Editor', 60000.00, 5),
    ('Analyst', 50000.00, 1);
/* Fill employees table */
INSERT INTO employees (
        first_name,
        last_name,
        title,
        department_id,
        salary,
        manager_id
    )
VALUES ('Veronica', 'Williams', 'Manager', 1, 70000.00,),
    ('Eddie', 'Taylor', 'Manager', 4, 70000.00,),
    ('Edwin', 'Summers', 'Brick Mason', 4, 55000.00,),
    (
        'LaKeya',
        'Summers',
        'Material Handler',
        2,
        50000.00,
    ),
    (
        'Ida',
        'Martin',
        'Quality Auditor',
        2,
        55000.00,
    ),
    ('Lee', 'Williams', 'Manager', 3, 70000.00,),
    (
        'Brittany',
        'Cameron',
        'Administrative Assistant',
        3,
        50000.00
    ),
    ('Kerrick', 'Duckett', 'Accountant', 1, 55000.00),
    ('Diane', 'Thomas', 'Land Surveyer', 4, 50000.00),
    ('SamQuia', 'Parker', 'Author', 5, 65000.00),
    ('Lynisha', 'Booker', 'Manager', 2, 70000.00),
    ('Elisa', 'Denton', 'Editor', 5, 60000.00),
    (
        'LarCharika',
        'Saulsberry',
        'Analyst',
        1,
        50000.00,
    );