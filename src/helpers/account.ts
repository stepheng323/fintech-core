import Models from '../database/models';

export async function creditAccount({
  amount, accountId, purpose, reference, metadata, t,
}) {
  const account = await Models.Account.findOne({ where: { id: accountId } });

  if (!account) {
    return {
      success: false,
      error: 'Account does not exist',
    };
  }

  await Models.Account.increment(
    { availableBalance: amount }, { where: { id: accountId }, transaction: t },
  );

  await Models.Transaction.create({
    type: 'credit',
    purpose,
    userId: account.userId,
    amount,
    status: 'success',
    accountId,
    reference,
    metadata,
    balanceBefore: Number(account.availableBalance),
    balanceAfter: Number(account.availableBalance) + Number(amount),
  }, {
    transaction: t,
    lock: t.LOCK.UPDATE,
  });
  return {
    success: true,
    message: 'Credit successful',
  };
}

export async function debitAccount({
  amount, accountId, purpose, reference, metadata, t,
}) {
  const account = await Models.Account.findOne({
    where: { id: accountId },
    transaction: t,
    lock: true,
  });

  if (!account) {
    return {
      success: false,
      error: 'Account does not exist',
    };
  }

  if (Number(account.availableBalance) < amount) {
    return {
      success: false,
      error: 'Insufficient balance',
    };
  }
  await Models.Account.increment(
    { availableBalance: -amount }, { where: { id: accountId }, transaction: t },
  );
  await Models.Transaction.create({
    transactionType: 'debit',
    purpose,
    amount,
    status: 'pending',
    accountId: account.id,
    reference,
    metadata,
    balanceBefore: Number(account.balance),
    balanceAfter: Number(account.balance) - Number(amount),
  }, {
    transaction: t,
    lock: t.LOCK.UPDATE,
  });
  return {
    success: true,
    message: 'Debit successful',
  };
}