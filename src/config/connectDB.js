const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('sql6681762', 'sql6681762', "hCNMjtkwQC", {
    host: 'sql6.freemysqlhosting.net',
    dialect: 'mysql',
    logging: true
});
// Name: sql6681762
// Username: sql6681762
// Password: hCNMjtkwQC
// Port number: 3306
// const sequelize = new Sequelize("postgres://quanpham:APT9BSpF1cKIcaOUTsK2SzaVvYyswlfD@dpg-cmv4bcqcn0vc73amic9g-a.singapore-postgres.render.com/quanpham");

// postgres://quanpham:APT9BSpF1cKIcaOUTsK2SzaVvYyswlfD@dpg-cmv4bcqcn0vc73amic9g-a.singapore-postgres.render.com/quanpham
let connectDB = async()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = connectDB;
