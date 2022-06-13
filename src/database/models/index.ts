import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize'
import { NODE_ENV } from '../../config/env'
const configs = require('../../config/database');

const basename = path.basename(__filename);
const env = NODE_ENV || 'development';
const config = configs[env];
const db: any = {};

export const sequelize = config.use_env_variable
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);
fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && ((file.slice(-3) === '.ts') || (file.slice(-3) === '.js')))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
