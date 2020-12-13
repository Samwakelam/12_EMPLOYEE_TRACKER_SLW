DROP SCHEMA IF EXISTS employeeTracker;
CREATE SCHEMA employeeTracker;
USE employeeTracker;


------------------------------------- departments table ------------------------------------------------------

-- id
-- name

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    depName VARCHAR(50),
);

-- Add department 
INSERT INTO departments (depName) VALUES ( var1 );

-- View department
SELECT * FROM departments

-- View department roles and employees -- confirmed
SELECT depName, jobTitle, firstName, lastName
FROM departments AS dep
INNER JOIN
jobRole AS jr
ON dep.id = jr.departments_id
INNER JOIN 
employee AS emp 
ON jr.id = emp.jobRole_id
-- filter by jobTitle
WHERE jobTitle = 'var1'
-- filter by employee first and last name 
WHERE (firstName, lastName) = ('Scroge', 'McDuck')

-- View departments and employee count --confirmed 
SELECT depName, count(firstName)
FROM departments AS dep
LEFT JOIN 
jobRole AS jr
ON jr.departments_id = dep.id
LEFT JOIN
employee AS emp
ON emp.jobRole_id = jr.id
GROUP BY depName

-- Delete department
DELETE FROM departments WHERE id = num

-- View employee and jobtitles where department has been deleted 
SELECT * FROM departments AS dep
RIGHT Join 
jobrole AS jr 
ON dep.id = jr.departments_id
RIGHT JOIN
employee AS emp 
ON emp.jobRole_id = jr.id
WHERE depName IS NULL 


------------------------------------- jobRole table ------------------------------------------------------

-- id
-- jobTitle 
-- Salary
-- department id

CREATE TABLE jobRole (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jobTitle VARCHAR(50) NOT NULL,
    salary INTEGER NOT NULL,
    departments_id INTEGER NOT NULL,
);

-- Add jobRole 
INSERT INTO jobRole (title, salary, department_id) VALUES ( var1, var2, var3 );

-- View jobRole
SELECT * FROM jobRole

-- View only Jobrole list (no repeat values) -- confirmed
SELECT jobTitle FROM jobRole
GROUP BY jobTitle


------------------------------------- employee table ------------------------------------------------------

-- id
-- first name 
-- last name 
-- jobRole id 
-- manager id

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50), 
    lastName VARCHAR(50),
    jobRole_id INTEGER NOT NULL, 
    manager_id INTEGER, 
);

-- Add employee
INSERT INTO employee (firstName, lastName, role_id, manager_id ) VALUES ( var1, var2, var3, var4 );

-- View employee
SELECT * FROM employee

-- View employee and job title -- confirmed
SELECT firstName, lastName, depName, jobTitle, salary
FROM employee AS emp
INNER JOIN 
jobRole AS jr
ON jr.id = emp.jobRole_id 
INNER JOIN
departments AS dep
ON dep.id = jr.departments_id
-- Add to above to see only 'managers' -- confirmed 
WHERE jobTitle = 'var1'

-- View employee and manager -- confirmed
SELECT empE.firstName , empE.lastName, empM.firstName, empM.lastName
FROM employee AS empE
INNER JOIN 
employee AS empM
ON empE.manager_id = empM.id 
-- Add to above to see employees of a specific manager -- confirmed
WHERE empM.lastName = 'McDuck'

-- View all employee data including thier manager 
SELECT empM.firstName, empM.lastName, empE.firstName , empE.lastName, jobTitle, salary, empE.id
FROM employee AS empE
INNER JOIN 
employee AS empM
ON empE.manager_id = empM.id 
INNER JOIN
jobRole AS jr 
ON empE.jobRole_id = jr.id

-- View employee, job title and department -- confirmed 
SELECT firstName, lastName, jobTitle, depName
FROM employee AS emp
INNER JOIN 
jobRole AS jr
ON jr.id = emp.jobRole_id 
INNER JOIN 
departments AS dep
ON dep.id = jr.departments_id 
-- Add to above to see employees and job roles of a specific department -- confirmed
WHERE depName = 'adventure'


-- update employee role
UPDATE employee SET jobRole_id = 'var1'
WHERE .... 

-- update employee manager
UPDATE employee SET manager_id = 'var1'
WHERE .... 

