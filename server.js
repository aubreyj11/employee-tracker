const myConnection = require('./config/connect');
const inquirer = require('Inquirer');
const cTable = require('console.table');


myConnection.connect(() => {
    userPrompt();
});

const userPrompt = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: "Please select an option from the menu:",
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add A Department',
                'Add A Role',
                'Add An Employee',
                'Update Employee Role',
                'Quit'
            ]
        }
    ])
    .then((userChoice) => {
        const {choices} = userChoice;

        if (choices === 'View All Departments') {
            viewDepartments();
        }

        if (choices === 'View All Roles') {
            viewRoles();
        }

        if (choices === 'View All Employees') {
            viewEmployees();
        }

        if (choices === 'Add A Department') {
            addDepartment();
        }

        if (choices === 'Add A Role') {
            addRole();
        }

        if (choices === 'Add An Employee') {
            addEmployee();
        }

        if (choices === 'Update Employee Role') {
            updateRole();
        }

        if (choices === 'Quit') {
            myConnection.end();
        }
    });
};

const viewDepartments = () => {
    const sql = `SELECT department.id AS ID, department.department_name AS department FROM department;`;
    myConnection.query(sql, (err, res) => {
        if (err) {
            throw err
        } else {
            console.table(res);
        }
        userPrompt();
    });
};

const viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.department_name AS department FROM role;`;
    myConnection.query(sql, (err, res) => {
        if (err) {
            throw err;
        } else {
            res.forEach((role) => {console.table(role.title);});
        };
        userPrompt();
    });
};

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department,
    role.salary FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee_role.id`;
    myConnection.query(sql, (err, res) => {
        if (err) {
            throw err;
        } else {console.table(res);};
        userPrompt();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of the new department?',
        }
    ]) 
    .then((answer) => {
        let sql = `INSERT INTO department(department_name) VALUES (?)`;
        myConnection.query(sql, answer.newDepartment, (err, res) => {
            if (err) {
                throw (err);
            } else {
                console.log('Department created!');
            };
            viewDepartments();
        });
    });
};

const addRole = () => {
    const sql = 'SELECT * FROM department';
    myConnection.query(sql, (err, res) => {
        if (err) {
            throw err;
        };
        let departArray = [];
        res.forEach((department) => {departArray.push(department.department_name);});
        departArray.push('Create Department');
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'list',
                message: 'What department does this new role fit into?',
                choices: departArray
            }
        ])
        .then((answer) => {
            if (answer.departmentName === 'Create Department') {
                this.addDepartment();
            } else {
                resumeAddRole(answer);
            }
        });

        const resumeAddRole = (departData) => {
            inquirer.prompt([
                {
                    name: 'newRole',
                    type: 'input',
                    message: 'What is the name of this new role?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of this role?'
                }
            ])
            .then((answer) => {
                let addedRole = answer.newRole;
                let departmentId;

                res.forEach((department) => {
                    if (departData.departmentName === department.department_name) {departmentId = department.id;}
                });
                let sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
                let roleInfo = [addedRole, answer.salary, departmentId];

                myConnection.query(sql, roleInfo, (err) => {
                    if (err) {
                        throw err;
                    };
                    console.log('Role created successfully!');
                    viewRoles();
                });
            });
        };
    });

const addEmployee = () => {
    inquirer.prompt([ 
        {
            type: 'input',
            name: 'firstName',
             message: "What is the employee's first name?"
         },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        }
    ])
    .then(answer => {
        const newInfo = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
         myConnection.query(roleSql, (err, res) => {
            if (err) {
                throw err;
               };
            const roles = data.map(({id, title}) => ({name: title, value: id}));
            inquirer.prompt([
                 {
                    type: 'list',
                    name: 'role',
                    message: 'What is this employees role?',
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                newInfo.push(role);
                const managerSql = `SELECT * FROM employee`;
                myConnection.query(managerSql, (err, res) => {
                    if (err) {
                         throw err;
                     };
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employees manager?',
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        newInfo.push(manager);
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?,?,?,?)`;
                        myConnection.query(sql, newInfo, (err) => {
                            if (err) {
                                 throw err;
                             };
                        console.log('New employee added!')
                        viewEmployees();
                        });
                    });
                });
            });
        });
    });
};
};

