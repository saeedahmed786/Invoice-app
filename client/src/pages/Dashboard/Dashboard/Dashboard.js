import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { CustomersTable } from '../../../components/Dashboard/CustomersTable'
import { InvoicesTable } from '../../../components/Dashboard/InvoicesTable'
import { Loading } from '../../../components/Loading/Loading'
import { ErrorAlert } from '../../../components/Messages/Messages'
import { Layout } from '../../../Layouts/Layout'
import "./Dashboard.css"

export const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, []);


  return (
    <Layout sidebar>
      {
        loading ?
          <Loading />
          :
          <div className='Dashboard'>
            <div className='boxes row'>
              <div className='col-6 col-sm-4 col-md-3 col-lg-2 received'>
                <div>
                  <div>
                    <h4>Received payment</h4>
                    <h4 className='count'>
                      {
                        data.filter(d => d.status == "Paid")?.length > 0 ?
                          data.filter(d => d.status == "Paid").reduce((a, b) => parseInt(a) + parseInt(b?.amount), 0).toFixed(2)
                          :
                          "0"
                      }$
                    </h4>
                  </div>
                </div>
              </div>
              <div className='col-6 col-sm-4 col-md-3 col-lg-2 pending'>
                <div>
                  <div>
                    <h4>Pending amount</h4>
                    <h4 className='count'>{
                      data.filter(d => d.status == "Unpaid")?.length > 0 ?
                        data.filter(d => d.status == "Unpaid").reduce((a, b) => parseInt(a) + parseInt(b?.amount), 0).toFixed(2)
                        :
                        "0"
                    }$</h4>
                  </div>
                </div>
              </div>
              <div className='col-6 col-sm-4 col-md-3 col-lg-2 totalAmount'>
                <div>
                  <div>
                    <h4>Total amount</h4>
                    <h4 className='count'> {
                      data.reduce((a, b) => parseInt(a) + parseInt(b?.amount), 0).toFixed(2)
                    }$</h4>
                  </div>
                </div>
              </div>
              <div className='col-6 col-sm-4 col-md-3 col-lg-2 totalInvoices'>
                <div>
                  <div>
                    <h4>Total invoices</h4>
                    <h4 className='count'>{data.length}</h4>
                  </div>
                </div>
              </div>
              <div className='col-6 col-sm-4 col-md-3 col-lg-2 UnpaidInvoices'>
                <div>
                  <div>
                    <h4>Unpaid Invoices</h4>
                    <h4 className='count'>{data.length > 0 ? data.filter(d => d.status == "Unpaid").length : 0}</h4>
                  </div>
                </div>
              </div>
              <div className='col-6 col-sm-4 col-md-3 col-lg-2 Overdue'>
                <div>
                  <div>
                    <h4>Overdue</h4>
                    <h4 className='count'>
                      {data.length > 0 ? data.filter(d => moment(d.dueDate, 'MMMM DD YYYY').diff(moment(new Date()), 'days') <= -1).length : 0}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <InvoicesTable />
            <CustomersTable />
          </div>
      }
    </Layout>
  )
}
