import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "./Layout.css";
import logo from "../assets/Logo Dashboard.png"
import { loadCSS } from 'fg-loadcss';
import NavMenu from './Menu';
import AddCustomer from '../components/Dashboard/AddCustomer';
import { ErrorAlert, SuccessAlert } from '../components/Messages/Messages';
import axios from 'axios';
import AddInvoice from '../components/Dashboard/AddInvoice';

export const Layout = (props) => {
    const [loading, setLoading] = useState(false);
    React.useEffect(() => {
        const node = loadCSS(
            'https://use.fontawesome.com/releases/v5.14.0/css/all.css',
            // Inject before JSS
            document.querySelector('#font-awesome-css') || document.head.firstChild,
        );

        return () => {
            node.parentNode.removeChild(node);
        };
    }, []);

    const submitHandler = (data) => {
        setLoading(true);
        axios.post(`/api/customers/add`, data, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then((res) => {
            setLoading(false);
            if (res.status === 200) {
                SuccessAlert(res.data.successMessage);
                setTimeout(() => {
                    document.location.reload();
                }, 2000);
            } else {
                ErrorAlert(res.data.errorMessage);
            }
        });
    };

    return (
        <div className='Layout'>
            {
                props.sidebar ?
                    <div className='row p-2'>
                        <div className='col-12'>
                            <nav>
                                <img src={logo} alt="Logo" width="130" />
                                <NavMenu />
                            </nav>
                        </div>
                        <div className='col-md-3 text-center'>
                            <div className='buttonsCont'>
                                <div>
                                    <div className='dashBtn mb-4 mb-md-0'>
                                        <Link to='/' className='btn'>Dashboard</Link>
                                    </div>
                                    <div className='cutomerBtn mb-4 mb-md-0'>
                                        <AddInvoice />
                                    </div>
                                    <div className='cutomerBtn mb-4 mb-md-0'>
                                        <AddCustomer newCustomer={true} submitHandler={submitHandler} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-9'>
                            {props.children}
                        </div>

                    </div>
                    :
                    props.children
            }

        </div >
    )
}