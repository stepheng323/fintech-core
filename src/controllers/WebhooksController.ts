import { Request, Response } from 'express'
import crypto from 'crypto';
import Models from '../database/models';
import { PAYSTACK_SECRET_KEY } from '../config/env'
import { creditAccount, } from '../helpers/account';


export const paystack = async function (req: Request, res: Response) {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY!).update(JSON.stringify(req.body)).digest('hex');
  const paystackSigature = req.headers['x-paystack-signature'];
  if (hash !== paystackSigature) return res.send(200)
  const { event, data } = req.body;

  if (event === 'charge.success') {
    const { reference, amount, metadata: { custom_fields } } = data
    const userId = custom_fields[0].userId;
    const transactionExist = await Models.Transaction.findOne({ where: { reference } });
    if (transactionExist) return res.send(200);

    const account = await Models.Account.findOne({ where: { userId } });
    const t = await Models.sequelize.transaction();
    const amountInNaira = Number(amount) / 100;
    try {
      const creditResponse = await creditAccount({
        amount: amountInNaira,
        reference,
        accountId: account.id,
        purpose: 'deposit',
        metadata: '',
        t
      })
      if (!creditResponse.success) throw new Error(creditResponse.error);
      await t.commit();
      res.send(200);

    } catch (error) {
      await t.rollback()
    }
  }
}