import { Request, Response } from 'express'
import { respondWithWarning, respondWithSuccess } from '../helpers/responseHandler';
import Models from '../database/models';
import { generateToken } from '../helpers/jwt';
import { hashText, compareHash } from '../helpers/crypto'
import { catchAsync } from '../utils';


export const signup = catchAsync(async function (req: Request, res: Response) {
  const { email, password } = req.body;
  const userExist = await Models.User.findOne({ where: { email } });
  if (userExist) return respondWithWarning(res, 409, 'user with the email exist', {});
  const hashedPassword = await hashText(password);
  const t = await Models.sequelize.transaction();
  try {
    const user = await Models.User.create({
      ...req.body,
      password: hashedPassword
    }, { transaction: t });

    await Models.Account.create({
      userId: user.id,
    }, { transaction: t });

    await t.commit();
    return respondWithSuccess(res, 201, 'user created successfully', {
      ...user.dataValues,
      password: undefined
    });

  } catch (error: any) {
    await t.rollback()
    throw new Error(error.message)
  }
})

export const login = catchAsync(async function (req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await Models.User.findOne({ where: { email } });

  if (!user) return respondWithWarning(res, 401, 'incorrect email or password', {});
  const { password: hashedPassword } = user;
  const verify = await compareHash(password, hashedPassword);
  if (!verify) return respondWithWarning(res, 401, 'incorrect email or password', {})

  const token = await generateToken({
    ...user.dataValues, password: undefined
  });
  return respondWithSuccess(res, 200, 'login successful', {
    ...user.dataValues,
    token,
    password: undefined,
    createdAt: undefined,
    updatedAt: undefined
  })
});