import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { ErrorAlert, SuccessAlert } from '../../../components/Messages/Messages';
import { Layout } from '../../../Layouts/Layout'
import { PDFExport } from '@progress/kendo-react-pdf';
import "./Invoice.css"
import { Loading } from '../../../components/Loading/Loading';


export const Invoice = (props) => {
    const [invoice, setInvoice] = useState({});
    const [totalAmount, setTotalAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const invoiceId = props.match.params.id;
    const pdfExportComponent = useRef(null);
    const contentArea = useRef(null);

    const getInvoice = () => {
        axios.get(`/api/invoices/get/${invoiceId}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setInvoice(res.data);
                let total = res.data.items && res.data.items.reduce((a, b) => a + parseInt(b.qty) * parseInt(b.price) - parseInt(b.qty) * parseInt(b.price) * (parseInt(b.discount) / 100), 0).toFixed(2);
                setTotalAmount(total);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    useEffect(() => {
        if (!invoiceId) {
            props.history.push("/");
        }
        getInvoice();

        return () => {

        }
    }, []);

    const handleExportWithComponent = (event) => {
        console.log(contentArea)
        pdfExportComponent.current.save();
        // console.log(pdfExportComponent.toFile())
    }

    const sendInvoice = () => {
        setLoading(true);
        axios.post(`/api/send/invoice`, {
            invoiceNumber: invoice.invoiceNumber,
            id: invoice._id,
            client: invoice.client,
            customer: invoice.customer,
            status: invoice.status,
            dateNow: invoice.dateNow,
            dueDate: invoice.dueDate,
            currency: invoice.currency,
            items: invoice.items,
            subTotal: totalAmount,
            vat: 4,
            totalAmount: parseInt(totalAmount) + (parseInt(totalAmount) * 4 / 100),
            paid:
                invoice.status == "Paid" ?
                    parseInt(invoice.amount).toFixed(2)
                    :
                    0
            ,
            balance:
                invoice.status == "Unpaid" ?
                    parseInt(invoice.amount).toFixed(2)
                    :
                    0
            ,
            note: invoice.description
        }, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    return (
        <Layout sidebar>
            <div className='Invoice'>
                {
                    loading ?
                        <Loading />
                        :
                        <>
                            <div className='header'>
                                <h2>Invoice</h2>
                                <div className='buttonsContainer'>
                                    <div className='row'>
                                        <div className='col-md-4 mb-2 mb-md-0'>
                                            <button className='btn' onClick={sendInvoice}>Send to Customer</button>
                                        </div>
                                        <div className='col-md-4 mb-2 mb-md-0'>
                                            <button className='btn' onClick={handleExportWithComponent}>Download PDF</button>
                                        </div>
                                        <div className='col-md-4 mb-2 mb-md-0'>
                                            <Link to={"/invoice/update/" + invoiceId} className='btn'><i className="fa-solid fa-pen-to-square mx-2"></i> Edit Invoice</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <PDFExport ref={pdfExportComponent} paperSize="A2">
                                <div className='w-100' ref={contentArea}>
                                    <div className='invoiceNoContainer mx-0 mx-md-5'>
                                        <div className='text-dark fs-6 fs-md-4 p-2 p-md-4'>
                                            {invoice._id}
                                        </div>
                                        <div className='InvoiceNo'>
                                            <h3>Invoice</h3>
                                            <h6>No.</h6>
                                            <h6 className='text-dark'>{invoice.invoiceNumber}</h6>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='row summary mx-0 mx-md-5'>
                                        <div className='col-md-6'>
                                            <h6>From</h6>
                                            <h5>{invoice.client}</h5>
                                            <h6 className='mt-4'>BILL TO</h6>
                                            <h5>{invoice.customer}</h5>
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
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className='col-md-4'></div>
                                        <div className='col-md-8 mt-5'>
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
                                                            <td>{totalAmount}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>VAT(%)</td>
                                                            <td>4</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td className='text-dark fw-bold'>{invoice.currency} {parseInt(totalAmount) + (parseInt(totalAmount) * 4 / 100)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Paid</td>
                                                            <td className='text-dark fw-bold'>
                                                                {invoice.currency} &nbsp;
                                                                {
                                                                    invoice.status == "Paid" ?
                                                                        parseInt(invoice.amount).toFixed(2)
                                                                        :
                                                                        0
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Balance Due</td>
                                                            <td className='text-dark fw-bold'>
                                                                {invoice.currency} &nbsp;
                                                                {
                                                                    invoice.status == "Unpaid" ?
                                                                        parseInt(invoice.amount).toFixed(2)
                                                                        :
                                                                        0
                                                                }
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <hr className='mt-4' />
                                        <div className='col-12'>
                                            <h6 className='fw-bold mt-4 text-dark'>Note/Payment Info</h6>
                                            <p>{invoice.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </PDFExport>
                        </>
                }
            </div>
        </Layout>
    )
}
