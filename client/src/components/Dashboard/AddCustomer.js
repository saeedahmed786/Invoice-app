import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Icon, TextField } from '@mui/material';
import "./AddCustomer.css"

export default function AddCustomer({ newCustomer, submitHandler, updateCustomer, customer }) {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });

    const { fullName, email, phone, address } = data;

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleOpen = () => {
        customer && setData(customer);
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    return (
        <>
            {
                newCustomer ?
                    <a className='btn' onClick={handleOpen}>
                        <Icon baseClassName="fas" className="fa-plus-circle" color="primary" />  New Customer
                    </a>
                    :
                    updateCustomer &&
                    <a className='text-muted' onClick={handleOpen}>Edit</a>
            }
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='fullModal'>
                    <header>
                        <div>
                            <div className='fw-bold fs-3'>{newCustomer ? "New" : "Update"} Customer</div>
                        </div>
                        <div>
                            <a className="text-white fs-3" onClick={handleClose}>x</a>
                        </div>
                    </header>
                    <div className='form'>
                        <div>
                            <TextField value={fullName} name='fullName' fullWidth id="standard-basic" label="Name" variant="standard" onChange={handleChange} />
                        </div>
                        <div>
                            <TextField value={email} name='email' fullWidth id="standard-basic" label="Email" variant="standard" onChange={handleChange} />
                        </div>
                        <div>
                            <TextField value={phone} name='phone' fullWidth id="standard-basic" label="Phone" variant="standard" onChange={handleChange} />
                        </div>
                        <div>
                            <TextField value={address} name='address' fullWidth id="standard-basic" label="Address" variant="standard" onChange={handleChange} />
                        </div>
                        <div className='text-end'>
                            <button className='btn' onClick={() => submitHandler(data, customer?._id)}>Save Customer</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
