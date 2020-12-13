-- insert into departments
INSERT INTO departments (depName) VALUES ( 'moneyBin' );
INSERT INTO departments (depName) VALUES ( 'transport' );
INSERT INTO departments (depName) VALUES ( 'science' );
INSERT INTO departments (depName) VALUES ( 'adventure' );
INSERT INTO departments (depName) VALUES ( 'enemy' );


-- insert into jobRoles
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'manager', 50000, 1 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'manager', 15000, 2 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'manager', 25000, 3 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'manager', 27000, 4 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'accountant', 30000, 1 );

INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'librarian', 12000, 1 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'administrator', 11000, 1 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'scientist', 20000, 3 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'technologist', 22000, 3 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'gizmo-duck', 18000, 3 );

INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'pilot', 12000, 2 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'sailor', 9000, 2 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'chauffeur', 10000, 2 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'hero', 21000, 4 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'god', 24000, 4 );

INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'baddy', 0, 5 );

INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'trainee', 260, 1 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'trainee', 260, 2 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'trainee', 260, 3 );
INSERT INTO jobRole (jobTitle, salary, departments_id) VALUES ( 'trainee', 260, 4 );



-- insert into employee
INSERT INTO employee (firstName, lastName, jobRole_id ) VALUES ( 'Scroge', 'McDuck', 1);
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Della', 'Duck', 2, 1 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Gyro', 'Gearloose', 3, 1 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Bentina', 'Beakley', 4, 1);

INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Bradford', 'Buzzard', 5, 1 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Emily', 'Quackfaster', 6, 1 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Duckworth', 'Butler', 7, 1 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Zan', 'Owlson', 5, 1 );

INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Donald', 'Duck', 12, 2 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Launchpad', 'McQuack', 13, 2 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Launchpad', 'McQuack', 11, 2 );

INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Mark', 'Beaks', 9, 3 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Gandra', 'Dee', 8, 3 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Fenton', 'Crackshell', 10, 3 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Fenton', 'Crackshell', 19, 3 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Fethry', 'Duck', 8, 3 );

INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Drake', 'Mallard', 14, 4 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Storkules', 'Ithaquack', 15, 4 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Selene', 'Ithaquack', 15, 4 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Zeus', 'Ithaquack', 15, 4 );

INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Louie', 'Duck', 17, 1 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Dewey', 'Duck', 18, 2 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Huey', 'Duck', 19, 3 );
INSERT INTO employee (firstName, lastName, jobRole_id, manager_id ) VALUES ( 'Webby', 'Vanderquack', 20, 4 );

INSERT INTO employee (firstName, lastName, jobRole_id) VALUES ( 'Magica', 'DeSpell', 16);
INSERT INTO employee (firstName, lastName, jobRole_id ) VALUES ( 'Flintheart', 'Glomgold', 16);
INSERT INTO employee (firstName, lastName, jobRole_id) VALUES ( 'Don', 'Karnage', 16);
