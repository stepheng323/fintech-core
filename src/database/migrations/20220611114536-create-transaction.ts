'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM('debit', 'credit'),
      },
      purpose: {
        type: Sequelize.ENUM('deposit', 'transfer', 'reversal'),
      },
      status: {
        type: Sequelize.STRING,
      },
      accountId: {
        type: Sequelize.INTEGER,
      },
      reference: {
        type: Sequelize.STRING,
      },
      metadata: {
        type: Sequelize.TEXT,
      },
      amount: {
        type: Sequelize.DECIMAL(20, 2).UNSIGNED,
      },
      balanceBefore: {
        type: Sequelize.DECIMAL(20, 2).UNSIGNED,
      },
      balanceAfter: {
        type: Sequelize.DECIMAL(20, 2).UNSIGNED,
      },
      note: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};