const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('quanpham', 'quanpham',null,  {
//     host: 'localhost',
//     dialect: 'mysql',
//     logging: true
// });
const sequelize = new Sequelize('sql12713448', 'sql12713448', "6adfHPdDxl", {
  host: 'sql12.freesqldatabase.com',
  dialect: 'mysql',
  logging: true
});

let connectDB = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = connectDB;

// "development": {
//   "username": "sql6684942",
//   "password": "EFL7g6MsAi",
//   "database": "sql6684942",
//   "host": "sql6.freesqldatabase.com",
//   "dialect": "mysql",
//   "logging": false,
//   "query":{
//     "raw": true
//   },
//   "timezone":"+07:00"
// },