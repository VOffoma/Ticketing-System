# Ticketing-System

This project is a backend implementation for a customer support ticketing system. This system allows customers to be able to place support requests, and support agents to process the request.

---
## Requirements

* NodeJS: Simply ensure that you have the most recent stable version of Node.js. 
* MongoDB Compass: This application makes use of a database instance in Mongodb altas. The link to the database is in the .env.dev and .env.prod files.

## How to setup and run the application
To setup the application, Kindly do the following

    $ git clone https://github.com/VOffoma/Ticketing-System
    $ cd Ticketing-System
    $ npm install or yarn install
    $ npm run start:dev (to run in dev mode)
    $ npm run start (to run in prod)
    
## Scripts to note
Apart from the scripts for running the application, there are scripts that do other things you may want to explore

* `npm run jest:test` - this script is responsible for running tests
* `npm run jest:test:coverage` - this script is responsible for running tests and generating coverage reports
* `npm run generate:tsdoc` - This script is responsible for generating some documentations on the methods, functions and interfaces in this project. This script generates a folder call docs in the root of the project. There is an index.html document in the docs folder that you can access. 

## Endpoints

The endpoints on the app are:

| resource      | description                       |
|:--------------|:----------------------------------|
| POST: `http://localhost:7077/api/v1/auth/signup` | register a user  |
| POST: `http://localhost:7077/api/v1/auth/signin`    | authenticate user|
| GET: `http://localhost:7077/api/v1/tickets/` | get all tickets |
| POST: `http://localhost:7077/api/v1/tickets/`      | post a ticket |
| GET: `http://localhost:7077/api/v1/tickets/:ticketId`  | get details of a specific ticket |
| PATCH: `http://localhost:7077/api/v1/tickets/:ticketId/updateStatus` | update the status of a ticket |
| POST: `http://localhost:7077/api/v1/tickets/:ticketId/comments` | post a comment on a ticket |
| GET: `http://localhost:7077/api/v1/tickets/:ticketId/comments` | get all comments for a ticket |
| PATCH: `http://localhost:7077/api/v1/tickets/:ticketId/assignSupport` | assign a support persons or self to a ticket |
| GET: `http://localhost:7077/api/v1/tickets/report` | get report of closed tickets in the last 30 days in csv format |
| PATCH: `http://localhost:7077/api/v1/users/:userId` | update a user's role |


Note: All routes excepts for the routes for signin and signup are protected. Ensure the token you recieved after signin is sent back in the header 'x-access-token' when trying to access protected routes. 

## Functionality covered
This application has 3 different categories of users and the category is determined by the role of the user. There are three roles: USER, SUPPORT and ADMIN.

### Functionality available to the users with role of "USER"
* this user can create a ticket.
* this user can see all the tickets he or she ever created.
* this user can make comment on his or her ticket with a caveat that the support person has to comment first.
* this user can see all the comments made on his or her ticket.
* this user can get details regarding a ticket he or she created.

### Functionality available to the users with role of "SUPPORT"
This user has all the ability of the above stated category and the following below: 
* This user can see all tickets that are Open or in progress.
* This user can assign a ticket to himself to another support person
* This user can get report of the tickets closed in the last 30 days in csv format.
* This user can update the status of a ticket.

### Functionality available to the users with role of Admin
This user has all the ability of the above stated category and the following below: 
* An admin can update a user's role. This means he or she can change a user's role from just user to support person

## Assumptions made
* When a user registers on the application, He or She retains the role of 'USER' until the admin update the role to the something else
* When a user visits the endpoint for getting all ticket, the experience is different depending on the role of the user
    * A user would only see tickets he or she created over time
    * A supportperson would only see all tickets are open or in progress
    * The admin will see all tickets

## Note
### Requirements unmet: 
### Issues faces: 
No technical issues. 
### Feedback
None for now

