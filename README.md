# Event Quest

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Description

Event Quest is a web application that allows users to discover and explore local events in their area, similar to platforms like Ticketmaster and Eventbrite. Users can search for events based on keywords, location, and dates, making it easy to find exciting activities and plan their leisure time. The application also provides a personalized user experience by allowing users to save events to their profile for future reference.

## Table of Contents

- [Screenshot](#screenshot)
- [Installation](#installation)
- [Usage](#usage)
- [Database Model](#database-model)
- [API Routes](#api-routes)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Questions](#questions)
- [Citations](#citations)

## Screenshot

![Screenshot](/public/images/screenshot.PNG)

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:
2. Navigate to the project directory:
3. Create or ensure that a package.json and package-lock.json are present.
4. Run "npm init" if necessary.
5. Use the command "npm install".
6. Install the dependencies:

- "axios": "^1.7.2"
- "bcrypt": "^5.1.1"
- "connect-session-sequelize": "^7.1.7"
- "dotenv": "^8.6.0"
- "express": "^4.19.2"
- "express-handlebars": "^5.3.5"
- "express-session": "^1.18.0"
- "handlebars": "^4.7.6"
- "mysql2": "^3.10.0"
- "pg": "^8.12.0"
- "pg-hstore": "^2.3.4"
- "sequelize": "^6.37.3"

7. Update the .env file with any necessary credentials needed.

8. Set up the Postgres SQL database:

- Create a new database for the application
- Within the db folder there is a schema.sql file.
- Open schema.sql within an integrated terminal.
- Login to postgres via "psql -U postgres".
- Enter the passphrase: "password".
- run the schema.sql file via "\i schema.sql".
- Exit out of postgres login and database connection via "\q" or "quit"

9. Run the application:

- Open an integrated terminal.
- Enter the command "npm run start" to start the server.
- Server will be accessible via insomnia using http://localhost:3000/

## Usage

1. Upon starting the server, you will be presented with the following output:

> node server.js
> App listening on port 3000

2. Once the application is running, you can access the webpage within the local host link within any browser of your choosing.

## Database Model

The application includes the following database models:

- User: Represents a user.
- saved Event: Represents a event that has been saved by the user.

The models are defined using Sequelize and have the following associations:

- A user has many saved events.
- An event belongs to a user.
-

## API Routes

- GET events
- POST events
- GET events by ID
- GET login
- POST login
- GET signup
- POST signup
- POST logout
- POST geolocation
- POST remove event
- .all (GET and POST) search event

## Features

- User-friendly interface for browsing and searching events
- Event search functionality based on keywords, state, city, and dates
- User authentication and personalized profiles
- Ability to save events to user profiles for later viewing
- Responsive design for seamless access across different devices
- Automatic displaying of local events based on user location

## Technologies Used

- Node.js and Express.js for building the RESTful API
- Handlebars.js as the templating engine for dynamic web pages
- PostgreSQL and Sequelize ORM for database management
- Render for deployment and hosting
- Discovery API from ticketmaster for event queries
- HTML, CSS, and JavaScript for the front-end user interface
- Express-session and cookies for user authentication and session management
- Environment variables for securing sensitive information

## Contributing

Contributions are not welcome. This is a graded classroom assignment that is an assesment of our groups skills regarding the usage of the technologies listed above. If you have any suggestions, bug reports, or feature requests, please open an issue or leave a comment for our future knowledge base and usage.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Questions

If you have any questions about Event Quest, you can reach the repo owner at Jake_Toton@live.com. You can find more of our teams work at [Jtoton](https://github.com/Jtoton/). [Cherbear01](https://github.com/Cherbear01). [DallasGiles](https://github.com/DallasGiles). [ddprzy37](https://github.com/ddprzy37).

## Citations

1. Node.js. (n.d.). Node.js. Retrieved from https://nodejs.org/
2. PostgreSQL. (n.d.). PostgreSQL: The World's Most Advanced Open Source Relational Database. Retrieved from https://www.postgresql.org/
3. Open Source Initiative. (n.d.). The MIT License. Retrieved from https://opensource.org/licenses/MIT

4. Project 2. (n.d.). https://bootcampspot.instructure.com/courses/5301/assignments/74873

- Canvas assignment page which housed the assignment description, requirments and acceptance criteria.
- This additionally provided the database schema to use including the tables and setup.
- Assignment contained source code that was provided.

7. Course instructors and T.A.'s provided assistance, materials and various links located within our classroom slack channels.
8. SQL Tutorial. (n.d.). https://www.w3schools.com/sql/
9. Node.js NPM. (n.d.). https://www.w3schools.com/nodejs/nodejs_npm.asp
10. Sequelize. (n.d.). Feature-rich ORM for Modern TypeScript & JavaScript. https://sequelize.org/
11. Introduction to Insomnia | Insomnia Docs. (n.d.). https://docs.insomnia.rest/insomnia/get-started
12. Documentation | Dotenv. (n.d.). https://www.dotenv.org/docs/
13. npm: dotenv. (n.d.). Npm. https://www.npmjs.com/package/dotenv
14. Lastname, N. (n.d.). Discovery API 2.0. The Ticketmaster Developer Portal. https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
15. Getting started | Axios Docs. (n.d.). https://axios-http.com/docs/intro
