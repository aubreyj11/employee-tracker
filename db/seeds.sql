INSERT INTO department (department_name)
VALUES ("Finance"),
        ("Marketing"),
        ("Sales"),
        ("Legal"),
        ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 5)
        ("Lead Engineer", 150000, 5),
        ("Lawyer", 180000, 4),
        ("Salesperson", 80000, 3),
        ("Accountant", 120000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Harry", "Hopper", 5, 2),
        ("Laura", "Link", 5, null),
        ("John", "Doe", 4, null),
        ("Austin", "Acre", 3, 5),
        ("Nellie", "Nose", 1, null);

    
