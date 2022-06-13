import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth.middleware';
import {
    addBeneficiary,
    transferFund,
    getBeneficiaries,
    fundAccount,
    getAccountInfo
} from '../../controllers/users.controller'
import {
    validateAccountFunding,
    validateAddBeneficiary,
    validateTransfer
} from '../../middlewares/user.middleware';

const user = Router();


user.get('/account/balance', checkAuth, getAccountInfo);
user.post('/beneficiary', checkAuth, validateAddBeneficiary, addBeneficiary);
user.get('/beneficiaries', checkAuth, getBeneficiaries);

user.post('/fund-transfer', checkAuth, validateTransfer, transferFund);
user.post('/fund-account/:id', checkAuth, validateAccountFunding, fundAccount)



export default user;