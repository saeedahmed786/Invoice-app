import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorAlert, SuccessAlert } from '../Messages/Messages';
import { InvoicePrice } from './InvoicePrice';

export const InvoicesTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [limit, setLimit] = useState(10);

    const getInvoices = () => {
        setLoading(true);
        axios.get(`/api/invoices/get`, {
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
        getInvoices()

        return () => {

        }
    }, [success]);

    const deleteHandler = (id) => {
        setLoading(true);
        axios.delete(`/api/invoices/delete/${id}`, {
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
                            <th scope="col">Client</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Due Date</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.length > 0 && data.slice(0, limit).map((invoice) => {
                                return (
                                    <tr>
                                        <td>
                                            <span className='number'>{invoice.invoiceNumber}</span>
                                            <div className='d-flex gap-2'>
                                                <Link className='text-muted' to={"/invoice/update/" + invoice._id}>Edit</Link>
                                                <a className='danger' onClick={() => deleteHandler(invoice._id)}>Delete</a>
                                            </div>
                                        </td>
                                        <td>{invoice.client}</td>
                                        <td>{invoice.items.reduce((a, b) => a + parseInt(b.qty) * parseInt(b.price) - parseInt(b.qty) * parseInt(b.price) * (parseInt(b.discount) / 100), 0).toFixed(2)}</td>
                                        <td>{invoice.dueDate}</td>
                                        <td className={invoice.status}>{invoice.status}</td>
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
