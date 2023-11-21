const Invoice = require('../models/invoiceModel');

exports.getAllInvoices = async (req, res) => {
    try {
        await Invoice.find({ addedBy: req.user._id }).exec((err, result) => {
            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(404).json({ errorMessage: 'No Invoices found', err });
            }
        });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id });
        if (invoice) {
            res.status(200).json(invoice);
        }
        else {
            res.status(404).json({ errorMessage: 'No invoice found!' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.addInvoice = async (req, res) => {
    try {
        const invoice = new Invoice({
            client: req.body.client,
            amount: req.body.amount,
            dueDate: req.body.dueDate,
            dateNow: req.body.dateNow,
            status: req.body.status,
            addedBy: req.user._id
        });

        const saveInvoice = await invoice.save();
        if (saveInvoice) {
            const getInvoices = await Invoice.find({ addedBy: req.user._id });
            if (getInvoices) {
                let addNumber = getInvoices && getInvoices.length === 1 ? "0" : getInvoices.length > 1 ? getInvoices[getInvoices.length - 2]?.invoiceNumber : "0";
                console.log(addNumber)
                saveInvoice.invoiceNumber = parseInt(addNumber) + parseInt("1");
                saveInvoice.save();
                res.status(200).json({ successMessage: 'Invoice added successfuly!' });
            }
            else {
                res.status(404).json({ errorMessage: 'No Invoices found', err });
            }
        } else {
            res.status(400).json({ errorMessage: 'Invoice not added. Please try again' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id });
        if (invoice) {
            invoice.dueDate = req.body.dueDate;
            invoice.taxRates = req.body.taxRates;
            invoice.currency = req.body.currency;
            invoice.customer = req.body.customer;
            invoice.description = req.body.description;

            const saveInvoice = await invoice.save();
            if (saveInvoice) {
                res.status(200).json({ successMessage: 'Invoice updated successfuly!' });
            } else {
                res.status(400).json({ errorMessage: 'Invoice not updated. Please try again' });
            }
        } else {
            res.status(400).json({ errorMessage: 'Invoice not found' });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.addInvoiceItems = async (req, res) => {
    try {
        Invoice.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { items: req.body } },
            { new: true },
            function (error, success) {
                if (error) {
                    res.status(200).json({ successMessage: "Item saving failed", error })
                } else {
                    let total = success.items && success.items.reduce((a, b) => a + parseInt(b.qty) * parseInt(b.price) - parseInt(b.qty) * parseInt(b.price) * (parseInt(b.discount) / 100), 0).toFixed(2);
                    success.amount = total;
                    success.save();
                    res.status(200).json({ successMessage: "Item added successfully", success })
                }
            });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.deleteInvoiceItems = async (req, res) => {
    try {
        Invoice.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { items: { _id: req.body.itemId } } },
            { new: true },
            function (error, success) {
                if (error) {
                    res.status(200).json({ successMessage: "Item deleting failed", error })
                } else {
                    let total = success.items && success.items.reduce((a, b) => a + parseInt(b.qty) * parseInt(b.price) - parseInt(b.qty) * parseInt(b.price) * (parseInt(b.discount) / 100), 0).toFixed(2);
                    success.amount = total;
                    success.save();
                    res.status(200).json({ successMessage: "Item deleted successfully", success })
                }
            });
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.deleteInvoice = async (req, res) => {
    try {
        const findInvoice = await Invoice.findOne({ _id: req.params.id });
        if (findInvoice) {
            findInvoice.remove();
            res.status(200).json({ successMessage: 'Invoice deleted Successfully' })
        } else {
            res.status(404).json({ errorMessage: 'Invoice not found.' })
        }
    } catch (error) {
        res.status(400).send(error);
    }
}