# Employee Tracker 
### At McDuck Enterprise (and Editable)

##
Welcome to my employee tracker. The purpose of this project is to create an application that allows a user to track and view their employees with a customizable interface to suit their business. The application is generated and visualised through the command line interface. 

As a business owner, you may want to view and manager the departments roles and employees in your company. I have designed and built a solution for managing a company’s employees using node, inquirer, and MySQL. The interface is designed to be easy for none-developers to use. 

![The McDuck money bin](public/assets/images/Money-bin.png)

For a bit of fun, I have created a test business that can be run with the interface centred around Duckburg and Scrooge McDuck’s Money Bin. 
There is a file included that will populate a database on MySQL for you and in the instructions, there are some suggested employees you can add to update and amend. I hope you have fun in Duckburg. 

During this project I have learnt how to populate a database using my SQL and enjoyed working out the logic to achieve the application that does it all. 

That is why my project stands out. Separate of a few necessary additions and updates I want to make, this interface should allow you to view employees by department, manager, job role and view all. And use all the other functions of updating adding and removing is as much detail. The instructions will elaborate. 


## Contents: 
1. [Installation](#Instalation) 
2. [Instructions for use](#Instructions)
3. [Improvements](#Improvements)
4. [Updates](#Updates)
5. [Credits](#Credits)
6. [License](#License)
7. [Contact](#Contact)

## Instalation

1.  Download the application to your computer with the zip file function on git hub or clone the repository.

2. You will need to install the necessary dependencies for the application to run. 
*	console.table
*	express
*	inquirer
*	mysql
*	nodemon

Use the command line ```> npm install <dependency name> ```

3. To run the application enter ``` > node index <Your password> ``` in your command line terminal. You will need to enter your password for your MySQL datatbase here to. 

4. I have named the application with a welcome to McDuck Enterprises. To change this to your own company name you will need to open index.js and in the top line of the mainMenu() function there is a console log with the welcome statement. There is also a thank you for leaving in the Exit option. Other than that, it’s all down to you to name and populate your departments and job roles. 

5. To Populate your database with McDuck Enterprises use the Seed.sql file in the database folder to set up the initial tables and insert the main employees. 

#### Technologies 
* Inquirer
* Express 
* Node.js 
* Javascript


## Instructions for use

1.	On first entering the application you are faced with 3 options: Exit, Open departments, open Employees. Exit will of course leave the application.

2. [Open Departments](#Open_Departments)
3. [Open Employees](#Open-Employees) 
4. [Open Job Roles](#OpenJobRoles)

* Click on the coral banners for video demonstrations.

### Open departments: 
This is all things business side to the application, manager the departments and roles but your employees are nowhere to be seen. You will need to return to the start menu and Open Employees using the “Return” option. 

Here you can:

##### Return to the main menu

##### Add new department:

Very simple as it says on the tin. You will be asked to name a department and the application will add it to the system with a unique id number. 

##### Remove a department:
There is a check in place here that allows you to escape if you accidently entered by mistake, you are then asked to choose from a list of your named departments. This will be permanently deleted. 

##### View departments:
View departments will list for you the department name and id and how many employees are employed under it. 

###### Departments Video Demonstration

[![Open departments](public/assets/images/Open-departments.png)](https://drive.google.com/file/d/1tp2jLQWGNjOHcajYAehnU6vY0BqUO33N/preview)

### Open Job Roles: 
This is all things Job role related. 

Here you can:

##### Return to the main menu

##### Add a job role to a department:
You are asked for the name of your job role, be sure to either stick to sentence case or lower case or some views may show you the same job role as two different entries. 

You are asked to choose a department to associate the role to, and salary which is validated by a numerical input. 

##### Remove a Job role:
You are asked which job role you wish to remove. Some departments may have the same job role, if this is the case, you are asked to select which department the role you are removing is from. 

if you wish to delete multiple you will need to run the programm again for each role. 

##### View Job roles
View Job Roles will list for you the job title and how many employees are employed under it. 

###### Job Roles Video Demonstration

[![Open Job Roles](public/assets/images/Open-jobroles.png)](https://drive.google.com/file/d/1e4YHIrBu2RmJLXKQYkf0YSh6zc-TaHA8/preview)

### Open Employees: 
This is all things employee based. You can assign their job roles, view and delete as you desire. 

Here you can:

##### Return to the main menu

##### Add a new employee 
When asked, input the employee’s first and last names (separately), choose a department, choose a job role, and decide if they need a manager or not. If they do, you will be asked to choose from the list of managers available. 

A manager’s job role must be ‘manager’ 

###### Add Employee Video Demonstration
[![Add Employee](public/assets/images/add-employee.png)](https://drive.google.com/file/d/1uFiP_aQEDCi6dV-HLfJJarsLh83MD7r7/preview)

##### Update an existing employee 

This selection is a little in depth. 

First you are asked for a reason such as promotion or reassignment. This currently does not have any benefit, but future updates can see actions attached to this.

You select the employee you wish to update, then which part of their information you wish to adjust. There is a confirmation question at the end to check if the information you enter is correct. 

*	Department:   
  You choose the department you want to move the employee too from your list of available departments.  

    This assigns the employee to a department first, however you cannot assign an employee to  a department alone. 

    Once the department is chosen you will be asked to choose from an associated job title. If there are none you will be asked to create one. This will spit you back out to the main menu and you will need to open the menu and update the employee again. 

    This way you may also be asked about managers and it makes sure all the boxes are ticked. 

<hr>


*	Job role:  
  You choose an available job role to assign to your employee. 

    Changing job roles means that your employee may change departments. If this is the case the program will inform you of such and ask if you wish to update the manager, at which point you are asked the relevant manager questions and taken through those steps. Do you want to assign a manager, if so who? 

<hr>

*	Manager:   
  You will be asked if the employee will need a manager, if yes, which manager from your available managers. 

    The program will inform you if you have chosen the manager they are currently assigned too and if you would like to choose another manager. 

<hr>

* HR: 
This is currently a somewhat "hidden" department. You cannot delete it, You can view it in view departments. 

Hopefully a future update will see employees that are displaced by the removal of a job role or department will be sent to HR for reassignment. 


##### Remove an employee 
There is a check in place here that allows you to escape if you accidently entered by mistake, you are then asked to choose from a list of your named employees. They will be permanently deleted. 

You are asked for a reason for the employee leaving service, for the moment there is a farewell statement attached to each, but future use could see an action attached to this command. 

You may have an employee with two job roles in the company, if this is the case and they are leaving one but not the other, the system checks for multiple entries and asks you to choose which role they are leaving displaying only the roles that employee holds. 

If you want to remove both roles, you will need to run the remove employee command a second time. 


##### And view employees 
You can view your employees in a number of ways 
By department will show you a list of departments to choose from and return a list of the employees under that department, salary , job role and id number. 

By manager will show you a list of managers to choose from and return a list of the employees under that manager, salary , job role and id number.

By job role will show you a list of company roles to choose from and return a list of the employees under that job role, salary , department name and id number.

By employee will show you a list of employees to choose from and return the employee name, salary , job role and id number.

View all, will show all employees, returning the employee name, salary , job role and id number.

### Additional employees and actions. - McDuck Enterprises. 
![Ducktales characters](public/assets/images/DuckTales_Characters.jpg)

* Goldie O'Guilt - Adventurer and bad guy you could add her into either the villan department or adventure department. But keep her under the watchful eye of Ms Beakley (Bentina). 

* Mark Beaks - a younge tech industry billionaire often siding with Flintheart Glomgold to bring down scrooge McDuck. Currently employed in the science department as a technologist. 

* Try adding a space program, captained by General Lunaris and his second in command Lieutenant Penumbra

* Hire more accountants Bently and Buford Buzzard. You could make it a seperate department managed by Bradford Buzzard, already employed by McDuck industries. 

* Black Heron - chemist, bad guy/gal. Many of Gyro Gearloose's inventions seem to turn evil, apparently so do his staff. 

* Mrs Featherby - Scrooge's secretary or you could add another Librarian. 

* Ludvig Von Drake - Senior Scientist, does not really report to anyone as he is a self proclaimed universal expert. Try adding him as another science department manager. 

Other characters. 
Gladstone Gander
Fergus McDuck 
M'Ma Crackershell - coppa
Fethry Duck - Genitor becomes scientist
Drake Mallard - Darkwing Duck / Tv Hero 
Daisy Duck - Event planner
Ripcord McQuack - pilot
King Blowhard - Hero 
Barnacle Biff - sailor 
Archibald Quackerbill - sailor 


## Improvements 

* When a department is deleted, the associated job roles and employees are added to a reassignment roster. 

* Some modifications to the updates function, update job role salaries. 

* Change process.argv for the database password to a .env file. 

* View employees that do not have a manager by adding "No Manager" to the lists. 


## Updates 

## Credits 

#### Resources
* w3Schools
* Developer mozilla 

I have not had to use many resources for this project, SQL and Inquirer seem to come quite easily to me for this. 


