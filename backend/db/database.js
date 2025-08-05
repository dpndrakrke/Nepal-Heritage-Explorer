const { Sequelize } = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, '../.env') });

const isTestEnvironment = process.env.NODE_ENV === 'test';

console.log(`Running in ${isTestEnvironment ? 'TEST' : 'DEVELOPMENT'} mode.`);

// Database configuration with environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'my@sql12',
  database: process.env.DB_NAME || 'nepal_heritage_db'
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? '[HIDDEN]' : '[EMPTY]'
});

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user, 
  dbConfig.password, 
  {
    host: dbConfig.host,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    
    // Provide helpful error messages
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("\n🔧 Troubleshooting tips:");
      console.error("1. Make sure MySQL is running on your system");
      console.error("2. Check if the database user and password are correct");
      console.error("3. Create a .env file in the backend directory with:");
      console.error("   DB_HOST=localhost");
      console.error("   DB_USER=your_mysql_username");
      console.error("   DB_PASS=your_mysql_password");
      console.error("   DB_NAME=nepal_heritage_db");
      console.error("4. Make sure the database 'nepal_heritage_db' exists");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("\n🔧 Troubleshooting tips:");
      console.error("1. Make sure MySQL server is running");
      console.error("2. Check if the host and port are correct");
    }
    
    throw error;
  }
};

module.exports = { sequelize, connectDB }; 