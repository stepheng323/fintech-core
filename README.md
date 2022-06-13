# fintech-core
---
# Setup Dotenv

#### A .env file is used to store configuration files especialy about development and testing.

#### Guide to use dotenv in this project

- Install dotenv package as a project dependency using "npm install dotenv" or "yarn add dotenv"
- Create .env file in project root directory.
- Add environment variables to .env file as seen in the .env.example file in the root folder.

# Installation Guide

- Clone this repo 
- Cd into fintech-core
- install nodejs and npm if you dont have them already on your machine
- install create a mysql database and add the connection string to the .env file 
- run "npm install"  to install project dependencies
- run "npm run migration" to migrate schema against the database
- finally, start the server with "npm run dev"

# Documentations

### The Api request and response structure has been captured using postman

- API-DOCS - https://documenter.getpostman.com/view/7771727/UzBgtpAh
- API-BASEURL - http:localhost:4000/api/v1












