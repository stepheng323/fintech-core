import { NextFunction, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { respondWithWarning, respondWithSuccess } from '../helpers/responseHandler';
import Models from '../database/models';
import { creditAccount, debitAccount } from '../helpers/account';
import { catchAsync } from '../utils';
import { initializePaystackPayment } from '../services/paystack';
import { emitReversal } from '../events/reversal';


export const getAccountInfo = catchAsync(async function (req: Request, res: Response) {
  const { id: userId } = req.auth;
  const account = await Models.Account.findOne({ where: { userId } })
  return respondWithSuccess(res, 200, 'account balance fetched successfully', account)

})

export const addBeneficiary = catchAsync(async function (req: Request, res: Response) {
  const { id: userId } = req.auth;
  const { email } = req.body;

  const user = await Models.User.findOne({ where: { email } });
  if (!user) return respondWithWarning(res, 400, 'no user with the email found', {});
  const { id: beneficiaryId, firstName, lastName } = user;

  if (beneficiaryId == userId) return respondWithWarning(res, 403, 'forbidden', {});
  const beneficiaryExist = await Models.Beneficiary.findOne({ where: { email } });
  if (beneficiaryExist) return respondWithWarning(res, 400, 'user already a beneficiary', {});

  const beneficiary = await Models.Beneficiary.create({
    email,
    name: `${firstName} ${lastName}`,
    userId,
  });
  return respondWithSuccess(res, 201, 'beneficiary added successfully', beneficiary);
})

export const getBeneficiaries = catchAsync(async function (req: Request, res: Response) {
  const { id: userId } = req.auth;
  const beneficiaries = await Models.Beneficiary.findAll({ where: { userId } });
  if (!beneficiaries.length) return respondWithSuccess(res, 200, 'no beneficiaries found', [])
  return respondWithSuccess(res, 201, 'beneficiaries fetched successfully', beneficiaries);
})

export const transferFund = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
  const { id: userId } = req.auth
  const { email, amount } = req.body;


  const beneficiary = await Models.Beneficiary.findOne({ where: { email, userId } });
  if (!beneficiary) return respondWithWarning(res, 404, 'please add this user as beneficiary')

  const sendersAccount = await Models.Account.findOne({ where: { userId } });
  const { id: senderAccountId } = sendersAccount

  const purpose = 'transfer'
  const reference = uuid()

  const t = await Models.sequelize.transaction();
  try {
    const debitResponse = await debitAccount({
      amount,
      accountId: senderAccountId,
      purpose,
      reference,
      metadata: '',
      t
    })

    if (!debitResponse.success) {
      await t.rollback();
      return respondWithWarning(res, 400, debitResponse.error!);
    }

    const beneficiaryInfo = await Models.User.findOne({
      where: { email },
      include: {
        model: Models.Account,
        as: 'account',
        attributes: ['id']
      }
    });
    const { id: receiversAccountId } = beneficiaryInfo.account;

    const creditResponse = await creditAccount({
      amount,
      accountId: receiversAccountId,
      purpose,
      reference,
      metadata: '',
      t
    });
    if (!creditResponse.success) {
      await t.commit()
      await Models.Transaction.update({ status: 'failed' }, { where: { reference } })
      emitReversal(reference);
      return respondWithWarning(res, 500, creditResponse.error!);
    }
    await t.commit();
    return respondWithSuccess(res, 200, 'transfer successful')
  } catch (error) {
    await t.rollback();
    return next(error)
  }
})

export const fundAccount = catchAsync(async function (req: Request, res: Response) {
  const { email, id: userId } = req.auth;
  const { amount } = req.body;
  const result = await initializePaystackPayment({
    email, amountInNaira: amount, metaData: { userId }, callbackUrl: ''
  });
  const { data, message } = result;
  return respondWithSuccess(res, 200, message, data.authorization_url)
})