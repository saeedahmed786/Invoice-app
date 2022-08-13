import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import "./Profile.css"
import { ErrorAlert, SuccessAlert } from '../Messages/Messages';
import axios from 'axios';
import { isAuthenticated } from '../Auth/auth';
import { Loading } from '../Loading/Loading';

export default function Profile() {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        fullName: "",
        email: ""
    });

    const { fullName, email } = data;

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        setFile(
            e.target.files[0]
        )
    }

    const handleOpen = () => {
        getUserById();
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

    const getUserById = () => {
        setLoading(true);
        axios.get(`/api/users/get/${isAuthenticated()._id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setData(res.data);
                setImage(res.data.file.url);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    const submitHandler = () => {
        setLoading(true);
        let data = new FormData();
        data.append("fullName", fullName);
        data.append("email", email);
        if (file) {
            data.append("file", file);
        }
        axios.put(`/api/users/update/${isAuthenticated()._id}`, data, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                document.location.reload();
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    return (
        <div>
            <a onClick={handleOpen}>Profile</a>
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='fullModal Profile'>
                    <header>
                        <div>
                            <div className='fw-bold fs-3'> Profile</div>
                        </div>
                        <div>
                            <a className="text-white fs-3" onClick={handleClose}>
                                <i className="fa-solid fa-xmark"></i>
                            </a>
                        </div>
                    </header>
                    {
                        loading ?
                            <Loading />
                            :
                            <div className='form'>
                                <div>
                                    <img src={image} alt="user" width="200px" height="200" />
                                    <div className="custom-file mt-4">
                                        <input type="file" name='file' required onChange={handleImageChange} />
                                        <label className="custom-file-label" for="customFile"></label>
                                    </div>
                                </div>
                                <div>
                                    <TextField value={fullName} name='fullName' fullWidth id="standard-basic" label="Name" variant="standard" onChange={handleChange} />
                                </div>
                                <div>
                                    <TextField value={email} name='email' fullWidth id="standard-basic" label="Email" variant="standard" onChange={handleChange} />
                                </div>
                                <div className='text-end'>
                                    <button className='btn' onClick={submitHandler}>Save</button>
                                </div>
                            </div>
                    }
                </div>
            </Modal>
        </div>
    );
}
