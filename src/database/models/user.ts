module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  }, {});

  User.associate = (models) => {
    User.hasOne(models.Account, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'account',
    });
    User.hasMany(models.Beneficiary, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'beneficiaries',
    });
  };
  return User;
};
