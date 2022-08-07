import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Fab, Icon, TextField } from '@mui/material';
import "./AddCustomer.css"
import { ErrorAlert, SuccessAlert } from '../Messages/Messages';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function AddInvoiceItem({ invoiceId, updateComponent }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        item: "",
        qty: "",
        price: "",
        discount: ""
    });

    const { item, qty, price, discount } = data;

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleOpen = () => {
        setOpen(true)
    };
    const handleClose = () => setOpen(false);


    const submitHandler = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`/api/invoices/items/add/${invoiceId}`, { _id: uuidv4(), item, qty, price, discount }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                updateComponent();
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    return (
        <>
            <Fab className='my-4 mb-5 my-md-0' color="primary" aria-label="add" onClick={handleOpen}>
                <a className='fs-3 text-white'>+</a>
            </Fab>
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='fullModal invoice'>
                    <header>
                        <div>
                            <div className='fw-bold fs-3'>New Invoice Item</div>
                        </div>
                        <div>
                            <a className="text-white fs-3" onClick={handleClose}>x</a>
                        </div>
                    </header>
                    <form onSubmit={submitHandler}>
                        <div>
                            <TextField value={item} name='item' fullWidth id="standard-basic" label="Item" variant="standard" onChange={handleChange} />
                        </div>
                        <div>
                            <TextField value={qty} name='qty' fullWidth id="standard-basic" label="Qty" variant="standard" onChange={handleChange} />
                        </div>
                        <div>
                            <TextField value={price} name='price' fullWidth id="standard-basic" label="Price" variant="standard" onChange={handleChange} />
                        </div>
                        <div>
                            <TextField value={discount} name='discount' fullWidth id="standard-basic" label="Discount" variant="standard" onChange={handleChange} />
                        </div>
                        {/* <div>
                            <TextField value={amount} name='amount' fullWidth id="standard-basic" label="Amount" variant="standard" onChange={handleChange} />
                        </div> */}
                        <div className='text-end mt-4'>
                            <button type='submit' className='btn'>Save Item</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
