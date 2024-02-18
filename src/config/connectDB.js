const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize('quanpham', 'quanpham',null,  {
//     host: 'localhost',
//     dialect: 'mysql',
//     logging: true
// });
const sequelize = new Sequelize('sql6684942', 'sql6684942', "EFL7g6MsAi", {
  host: 'sql6.freesqldatabase.com',
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
