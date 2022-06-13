module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    availableBalance: {
      type: DataTypes.DECIMAL(20, 2).UNSIGNED,
    },
  }, {});

  Account.associate = (models) => {
    Account.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user',
    });
    Account.hasMany(models.Transaction, {
      foreignKey: 'accountId',
      onDelete: 'CASCADE',
      as: 'transactions',
    });
  };
  return Account;
};
