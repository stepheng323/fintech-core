import fetch from 'node-fetch';
import { v4 as uuid } from 'uuid';
import { PAYSTACK_SECRET_KEY } from '../config/env';

const token = `Bearer ${PAYSTACK_SECRET_KEY}`;

export const initializePaystackPayment = async ({
  email, amountInNaira, metaData,
}: { email: string, amountInNaira: number, metaData: any }): Promise<any> => {
  const url = 'https://api.paystack.co/transaction/initialize';
  const request = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
    body: JSON.stringify({
      reference: uuid(),
      email,
      amount: Number(amountInNaira) * 100,
      callback_url: '',
      metadata: {
        custom_fields: [
          {
            ...metaData,
          },
        ],
      },
    }),
  });
  const result = await request.json();
  return result;
};

export const verifyPaystackTransaction = async (reference: string) => {
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  const request = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token
    },
  });
  const result = await request.json();
  return result;
};


