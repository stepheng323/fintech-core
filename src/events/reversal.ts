/* eslint-disable no-console */
import EventEmitter from 'events';
import { creditAccount } from '../helpers/account';
import Models from '../database/models';

const eventEmitter = new EventEmitter();

export const emitReversal = (reference: string) => {
  eventEmitter.emit('emitReversal', reference);
};

export const onEmittReversal = () => {
  eventEmitter.on('emitReversal', async (reference) => {
    console.log('reversal called');
    const t = await Models.sequelize.transaction();
    try {
      const transaction = await Models.Transaction.findOne({ where: { reference, type: 'debit' } });
      if (!transaction) return console.log('No transaction found');

      const {
        status, amount, userId, accountId,
      } = transaction;
      if (status !== 'failed') return console.log('trying to reverse a transaction that didnt fail');

      const purpose = 'reversal';
      const fundingResponse = await creditAccount({
        amount, accountId, reference: '', purpose, t, metadata: '',
      });
      if (!fundingResponse?.success) throw new Error('Funding error, reversal failed');
      await t.commit();
      return console.log('reversal successful');
    } catch (error) {
      console.log(error);
      await t.rollback();
    }
  });
};
