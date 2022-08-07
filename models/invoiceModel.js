const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        default: "0"
    },
    client: {
        type: Object,
    },
    amount: {
        type: String,
        default: "0"
    },
    dueDate: {
        type: String,
    },
    dateNow: {
        type: String,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        default: "Unpaid"
    },
    taxRates: {
        type: String,
        default: "4%"
    },
    currency: {
        type: String,
        default: "USD"
    },
    description: {
        type: String,
    },
    customer: {
        type: String,
    },
    items: {
        type: Array,
        default: []
    }

}, { timestamps: true }
);

const invoiceModel = new mongoose.model('invoice', invoiceSchema);
module.exports = invoiceModel;
