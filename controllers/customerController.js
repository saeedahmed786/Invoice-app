const Customer = require('../models/customerModel');

exports.getAllCustomers = async (req, res) => {
    const customers = await Customer.find({ addedBy: req.user._id });
    if (customers) {
        res.status(200).json(customers);
    }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
}

exports.getCustomerById = async (req, res) => {
    const customer = await Customer.findOne({ _id: req.params.id });
    if (customer) {
        res.status(200).json(customer);
    }
    else {
        res.status(404).json({ errorMessage: 'No customer found!' });
    }
}

exports.addCustomer = async (req, res) => {
    const customer = new Customer({
        fullName: req.body.fullName,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        addedBy: req.user._id
    });

    const saveCustomer = await customer.save();
    if (saveCustomer) {
        res.status(200).json({ successMessage: 'Customer added successfuly!' });
    } else {
        res.status(400).json({ errorMessage: 'Customer not added. Please try again' });
    }
}



exports.updateCustomer = async (req, res) => {
    const findCustomer = await Customer.findOne({ _id: req.params.id });
    if (findCustomer) {
        findCustomer.fullName = req.body.fullName;
        findCustomer.email = req.body.email;
        findCustomer.phone = req.body.phone;
        findCustomer.address = req.body.address;

        const saveCustomer = await findCustomer.save();
        if (saveCustomer) {
            res.status(200).json({ successMessage: 'Customer Updated Successfully' })
        } else (
            res.status(400).json({ errorMessage: 'Customer could not be Updated.' })
        )
    } else {
        res.status(404).json({ errorMessage: 'Customer not found.' })
    }
}

exports.deleteCustomer = async (req, res) => {
    const findCustomer = await Customer.findOne({ _id: req.params.id });
    if (findCustomer) {
        findCustomer.remove();
        res.status(200).json({ successMessage: 'Customer deleted Successfully' })
    } else {
        res.status(404).json({ errorMessage: 'Customer not found.' })
    }
}