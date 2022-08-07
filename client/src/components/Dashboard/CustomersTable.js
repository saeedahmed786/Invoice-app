import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ErrorAlert, SuccessAlert } from '../Messages/Messages';
import AddCustomer from './AddCustomer'

export const CustomersTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [limit, setLimit] = useState(10);

    const getCustomers = () => {
        setLoading(true);
        axios.get(`/api/customers/get`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setData(res.data)
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    useEffect(() => {
        getCustomers()

        return () => {

        }
    }, [success]);


    const submitHandler = (data, id) => {
        setLoading(true);
        axios.put(`/api/customers/update/${id}`, data, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                setSuccess(true)
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    const deleteHandler = (id) => {
        setLoading(true);
        axios.delete(`/api/customers/delete/${id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                setSuccess(true)
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    return (
        <div>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Number</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0 && data.slice(0, limit).map((customer, index) => {
                                return (
                                    <tr>
                                        <td>
                                            <span className='number'>{index + 1}</span>
                                            <div className='d-flex gap-2'>
                                                <AddCustomer submitHandler={submitHandler} updateCustomer={true} customer={customer} />
                                                <a className='danger' onClick={() => deleteHandler(customer._id)}>Delete</a>
                                            </div>
                                        </td>
                                        <td>{customer.fullName}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className='text-end showMore'>
                <button className='btn' onClick={() => setLimit(100000000000)} style={{ fontFamily: "'Roboto', sans-serif", color: "#069697", fontSize: "14px" }}>Show more</button>
            </div>
        </div>
    )
}
