const express = require('express');
const { addCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');

const router = express.Router();

router.post('/add', AuthenticatorJWT, addCustomer);
router.get('/get', AuthenticatorJWT, getAllCustomers);
router.get('/get/:id', AuthenticatorJWT, getCustomerById);
router.put('/update/:id', AuthenticatorJWT, updateCustomer);
router.delete('/delete/:id', AuthenticatorJWT, deleteCustomer);

module.exports = router;