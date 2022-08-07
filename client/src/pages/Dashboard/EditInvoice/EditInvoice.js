import { Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Layout } from '../../../Layouts/Layout'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import "./EditInvoice.css"
import { ErrorAlert, SuccessAlert } from '../../../components/Messages/Messages';
import axios from 'axios';
import moment from 'moment';
import AddInvoiceItem from '../../../components/Dashboard/AddInvoiceItem';

export const EditInvoice = (props) => {
    const invoiceId = props.match.params.id;
    const [customer, setCustomer] = useState("");
    const [currency, setCurrency] = useState("");
    const [loading, setLoading] = useState(false);
    const [customersList, setCustomersList] = useState([]);
    const [invoice, setInvoice] = useState({});
    const [totalAmount, setTotalAmount] = useState("");
    const [date, setDate] = useState("");
    const [data, setData] = useState({
        taxRates: "",
        description: ""
    });

    const { taxRates, description } = data;

    const handleChange = (event) => {
        setCustomer(event.target.value);
    };


    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const getCustomers = () => {
        axios.get(`/api/customers/get`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setCustomersList(res.data)
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    const getInvoice = () => {
        axios.get(`/api/invoices/get/${invoiceId}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                let total = res.data.items && res.data.items.reduce((a, b) => a + parseInt(b.qty) * parseInt(b.price) - parseInt(b.qty) * parseInt(b.price) * (parseInt(b.discount) / 100), 0).toFixed(2);
                setTotalAmount(total);
                setInvoice(res.data);
                setData(res.data);
                setDate(res.data.dueDate);
                setCustomer(res.data.customer);
                setCurrency(res.data.currency);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    useEffect(() => {
        if (!invoiceId) {
            props.history.push("/");
        }
        getCustomers()
        getInvoice();

        return () => {

        }
    }, []);

    const submitHandler = () => {
        setLoading(true);
        axios.put(`/api/invoices/update/${invoiceId}`, { customer, dueDate: moment(date).format('MMMM DD YYYY'), description, taxRates, currency }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                props.history.push(`/invoice/${invoiceId}`);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    const updateComponent = () => {
        getInvoice();
    }


    const deleteHandler = (id) => {
        setLoading(true);
        axios.post(`/api/invoices/items/delete/${invoiceId}`, { itemId: id }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                getInvoice();
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };


    return (
        <Layout sidebar>
            <div className='EditInvoice'>
                <div className='header'>
                    <h1 className='text-dark'>Invoice</h1>
                    <h4 className='text-end text-dark'>Invoice</h4>
                    <div className='invoiceNoContainer'>
                        <div>
                            Invoice #:
                        </div>
                        <div className='InvoiceNo'>
                            {invoice.invoiceNumber}
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row summary'>
                    <div className='col-md-6'>
                        <label className='mb-4'>BILL TO</label>
                        <FormControl fullWidth>
                            <InputLabel id="demo-multiple-name-label">Select Customer</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                value={customer}
                                onChange={handleChange}
                                input={<OutlinedInput label="Name" />}
                            >
                                {customersList?.map((customer) => (
                                    <MenuItem
                                        key={customer.fullName}
                                        value={customer.email}
                                    >
                                        {customer.fullName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='col-md-6 right'>
                        <div><label>Status</label></div>
                        <div className={`text ${invoice.status}`}>{invoice.status}</div>
                        <div><label>Date</label></div>
                        <div className='text'>{invoice.dateNow}</div>
                        <div><label>Due Date</label></div>
                        <div className='text'>{invoice.dueDate}</div>
                        <div><label>Amount</label></div>
                        <div className='text text-dark fs-3'>{invoice.currency} {totalAmount}</div>
                    </div>
                    <div className='col-12'>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Item</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Disc(%)</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        invoice.items && invoice?.items.length > 0 && invoice.items.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{item.item}</td>
                                                    <td>{item.qty}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.discount}</td>
                                                    <td>{parseInt(item.qty) * parseInt(item.price) - parseInt(item.qty) * parseInt(item.price) * parseInt(item.discount) / 100}</td>
                                                    <td>
                                                        <a className='text-dark' onClick={() => deleteHandler(item._id)}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <AddInvoiceItem invoiceId={invoiceId} updateComponent={updateComponent} />
                        </div>
                    </div>
                    <div className='col-md-4'></div>
                    <div className='col-md-8'>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Invoice Summary</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Sub Total:</td>
                                        <td>{invoice.currency} {totalAmount}</td>
                                    </tr>
                                    <tr>
                                        <td>VAT(%)</td>
                                        <td>4</td>
                                    </tr>
                                    <tr>
                                        <td>Total</td>
                                        <td className='text-dark fw-bold'>{invoice.currency} {parseInt(totalAmount) + (parseInt(totalAmount) * 4 / 100)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='col-md-8 bottomInputs row mt-5'>
                        <div className='col-md-4'>
                            <TextField name='taxRates' value={taxRates} onChange={handleInputChange} fullWidth id="standard-basic" label="Tax Rates(%)" variant="standard" />
                        </div>
                        <div className='col-md-4'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    label="Due Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={date}
                                    onChange={(value) => setDate(value)}
                                    renderInput={(params) => <TextField variant="standard" {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div className='col-md-4'>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="demo-simple-select-standard-label">Select Currency</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    label="Select Currency"
                                >
                                    <MenuItem value="USD">United States</MenuItem>
                                    <MenuItem value="EURO">United Kingdom</MenuItem>
                                    <MenuItem value="DIR">UAE</MenuItem>
                                    <MenuItem value="YEN">Japan</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='col-12'>
                        <h6 className='fw-bold mt-4 text-dark px-2 mt-5'>Note/Payment Info</h6>
                        <textarea name='description' value={description} onChange={handleInputChange} className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: "100px" }}></textarea>
                    </div>
                    <div className='col-12 text-center mt-4'>
                        <Button onClick={submitHandler} variant="contained" startIcon={<i className="fa-solid fa-floppy-disk"></i>}>
                            Save and Continue
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
