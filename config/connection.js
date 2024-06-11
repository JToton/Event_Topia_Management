// *Import the Sequelize library.
const Sequelize = require("sequelize");

// *Load environment variables from a .env file into process.env.
require("dotenv").config();

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: "localhost",
        dialect: "postgres",
      }
    );

module.exports = sequelize;
