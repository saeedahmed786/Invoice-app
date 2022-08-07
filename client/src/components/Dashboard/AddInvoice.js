import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { FormControl, Icon, MenuItem, Select, TextField } from '@mui/material';
import "./AddCustomer.css"
import { ErrorAlert, SuccessAlert } from '../Messages/Messages';
import axios from 'axios';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';

export default function AddInvoice() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Unpaid");
    const [data, setData] = useState({
        client: "",
        dueDate: ""
    });

    const { client, dueDate } = data;

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

    const submitHandler = (data) => {
        setLoading(true);
        axios.post(`/api/invoices/add`, { client, dueDate, status, dueDate: moment(date).format('MMMM DD YYYY'), dateNow: moment().format("MMMM DD YYYY") }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                setTimeout(() => {
                    document.location.reload();
                }, 1000);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    console.log(date)
    return (
        <>

            <a className='btn' onClick={handleOpen}>
                <Icon baseClassName="fas" className="fa-plus-circle" color="primary" />  New Invoice
            </a>

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
                            <div className='fw-bold fs-3'>New Invoice</div>
                        </div>
                        <div>
                            <a className="text-white fs-3" onClick={handleClose}>x</a>
                        </div>
                    </header>
                    <div className='form'>
                        <div>
                            <TextField name='client' fullWidth id="standard-basic" label="Client" variant="standard" onChange={handleChange} />
                        </div>
                        <div>
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
                        <div>
                            {/* <TextField name='status' fullWidth id="standard-basic" label="Status" variant="standard" onChange={handleChange} /> */}
                            <FormControl variant="standard" fullWidth>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    label="status"
                                >
                                    <MenuItem value="Paid">Paid</MenuItem>
                                    <MenuItem value="Unpaid">Unpaid</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='text-end'>
                            <button className='btn' onClick={submitHandler}>Save Invoice</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
