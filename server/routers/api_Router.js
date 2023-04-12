const Router            = require('express');
const router            = new Router();

const Auth               = require('../middleware/auth_m_ware.js');
const Auth_Controller    =  require('../controllers/auth_Controller')
const Api_Transactions   = require('../controllers/api_Transactions')
const Api_Users          = require('../controllers/api_Users')
const Api_Customers      = require('../controllers/api_Customers.js')

//auth
router.post('/login', Auth_Controller.login);
router.post('/logout', Auth_Controller.logout);
router.post('/check', Auth_Controller.check);

//transactions
router.get('/transactions/transactions', Auth,  Api_Transactions.getEntrys);  
router.get('/transactions/transaction', Auth,   Api_Transactions.getEntry);  
router.post('/transactions/transaction_update',Auth,   Api_Transactions.updateEntry);
router.post('/transactions/transaction_delete', Auth,  Api_Transactions.deleteEntry);


router.post('/transactions/transaction_add', Auth,  Api_Transactions.addEntry);

//users
router.get('/users/users', Auth,  Api_Users.getEntrys);  
router.get('/users/user',  Auth,  Api_Users.getEntry);  
router.post('/users/user_add',  Auth,  Api_Users.addEntry);
router.post('/users/user_update',  Auth,  Api_Users.updateEntry);
router.post('/users/user_delete',  Auth,  Api_Users.deleteEntry);
router.post('/users/user_add_deposit',  Auth,  Api_Users.addDeposit);


//customer  
router.get('/customers/customer', Auth, Api_Customers.getAccount);
router.get('/customers/deposit', Auth, Api_Customers.getDeposit);
router.get('/customers/withdraw', Auth, Api_Customers.getWithdraw);
router.get('/customers/widget', Auth, Api_Customers.balanceWidget);
router.post('/customers/withdraw_save', Auth, Api_Customers.saveWithdraw);
router.post('/customers/deposit_save', Auth, Api_Customers.saveDeposit);


router.post('/customers/withdraw_request', Auth, Api_Customers.requestWithrdaw);
router.post('/customers/withdraw_cancel', Auth, Api_Customers.cancelWithrdaw);


module.exports = router