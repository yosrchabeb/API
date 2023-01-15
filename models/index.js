const dbConfig = require("../config/db");


const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect:"mysql",
  operatorsAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.announcements = require("./ann_model")(sequelize, Sequelize);

module.exports = db;