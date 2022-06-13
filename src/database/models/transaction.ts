module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.ENUM('debit', 'credit'),
    },
    purpose: {
      type: DataTypes.ENUM('deposit', 'transfer', 'reversal'),
    },
    status: {
      type: DataTypes.STRING,
    },
    accountId: {
      type: DataTypes.INTEGER,
    },
    reference: {
      type: DataTypes.STRING,
    },
    metadata: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2).UNSIGNED,
    },
    balanceBefore: {
      type: DataTypes.DECIMAL(20, 2).UNSIGNED,
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(20, 2).UNSIGNED,
    },
    note: {
      type: DataTypes.STRING,
    },
  }, {});

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, {
      foreignKey: 'accountId',
      onDelete: 'CASCADE',
      as: 'account',
    });
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user',
    });
  };
  return Transaction;
};
