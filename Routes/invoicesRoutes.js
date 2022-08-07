const express = require('express');
const { getAllInvoices, addInvoice, getInvoiceById, deleteInvoice, addInvoiceItems, deleteInvoiceItems, updateInvoice, sendInvoice } = require('../controllers/invoiceController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const router = express.Router();


router.get('/get', AuthenticatorJWT, getAllInvoices);
router.get('/get/:id', AuthenticatorJWT, getInvoiceById);
router.post('/add', AuthenticatorJWT, addInvoice);
router.post('/items/add/:id', AuthenticatorJWT, addInvoiceItems);
router.put('/update/:id', AuthenticatorJWT, updateInvoice);
router.post('/items/delete/:id', AuthenticatorJWT, deleteInvoiceItems);
// router.post('/send', sendInvoice);
router.delete('/delete/:id', AuthenticatorJWT, deleteInvoice);

module.exports = router; 