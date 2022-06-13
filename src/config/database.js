const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    use_env_variable: true,
    url: process.env.DEV_DATABASE_URL,
    dialect: 'mysql',
    protocol: 'mysql',
    benchmark: false,
  },
  test: {
    use_env_variable: true,
    url: process.env.DEV_DATABASE_URL,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    use_env_variable: true,
    url: process.env.DEV_DATABASE_URL,
    protocol: 'mysql',
    dialect: 'mysql',
    logging: false,
    benchmark: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
