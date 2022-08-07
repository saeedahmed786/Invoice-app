const Template = (
    {
        invoiceNumber,
        status,
        client,
        customer,
        currency,
        dueDate,
        dateNow,
        id,
        note,
        subTotal,
        vat,
        totalAmount,
        items,
        paid,
        balance
    }) => {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
.invoice-container {
    margin: 0;
    padding: 0;
    padding-top: 10px;
    font-family: 'Roboto', sans-serif;
    width: 530px;
    margin: 0px auto;
    }
table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}
table td, table th {
  border: 1px solid rgb(247, 247, 247);
  padding: 10px;
}
table tr:nth-child(even){background-color: #f8f8f8;}
table tr:hover {background-color: rgb(243, 243, 243);}
table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #FFFFFF;
  color: rgb(78, 78, 78);
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;
    
}
.address {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0px 15px 0px;
    line-height: 10px;
    font-size: 12px;
    margin-top: -20px
}
.status {
    text-align: right;
}
.receipt-id {
    text-align: right;
}
.title {
    font-weight: 100px;
    text-transform: uppercase;
    color: gray;
    letter-spacing: 2px;
    font-size: 8px;
    line-height: 5px;
}
.summary {
    margin-top: 2px;
    margin-right: 0px;
    margin-left: 50%;
    margin-bottom: 15px;
}

.Paid {
  color: #29D919 !important;
  font-weight: 100px;
  text-transform: uppercase;
  color: gray;
  letter-spacing: 2px;
  font-size: 8px;
  line-height: 5px;
}

.Unpaid {
  color: #F00C0C;
  font-weight: 100px;
  text-transform: uppercase;
  color: gray;
  letter-spacing: 2px;
  font-size: 8px;
  line-height: 5px;
}

</style>
</head>
<body>
    <div class="invoice-container" style="margin-top: 160px">
        <section class="address">
            <div>
                <p class="title">From:</p>
                <h4 style="font-size: 9px; line-height: 5px">${client}</h4>
            </div>
            <div style="margin-bottom: 100px; margin-top: 20px">
                <p class="title">Bill to:</p>
                <p style="font-size: 9px; line-height: 5px">${customer}</p>
            </div>
            <div class="status" style="margin-top: -280px">
                <h1 style="font-size: 12px">Invoice Number</h1>
                <p style="font-size: 8px; margin-bottom: 10px">${invoiceNumber}</p>
                <h1 style="font-size: 12px">id</h1>
                <p style="font-size: 8px; margin-bottom: 10px">${id}</p>
                <p class={"${status}"} style="font-size: 8px">Status</p>
                <h3 style="font-size: 12px">${status}</h3>
                <p class="title" style="font-size: 8px">Date</p>
                <p style="font-size: 9px">${dateNow}</p>
                <p class="title" style="font-size: 8px">Due Date</p>
                <p style="font-size: 9px">${dueDate}</p>
                <p class="title" style="font-size: 8px">Amount</p>
                <h3 style="font-size: 12px">${currency} ${totalAmount}</h3>
            </div>
        </section>
        <table>
            <tr>
                <th style="font-size: 9px">Item</th>
                <th style="font-size: 9px">Quantity</th>
                <th style="font-size: 9px">Price</th>
                <th style="font-size: 9px">Discount(%)</th>
                <th style="text-align: right; font-size: 9px">Amount</th>
            </tr>
            ${items.map((item) => (
        `<tr>
                <td style="font-size: 9px">${item.item}</td>
                <td style="font-size: 9px">${item.qty}</td>
                <td style="font-size: 9px">${item.price}</td>
                <td style="font-size: 9px">${item.discount}</td>
                <td style="text-align: right; font-size: 9px">${(item.qty * item.price) - (item.qty * item.price) *
        item.discount / 100}</td>
            </tr>`
    ))
        }
        </table>
        <section class="summary">
            <table>
                <tr>
                    <th style="font-size: 9px">Invoice Summary</th>
                    <th></th>
                </tr>
                <tr>
                    <td style="font-size: 9px">Sub Total</td>
                    <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${subTotal}</td>
                </tr>
                <tr>
                    <td style="font-size: 10px">VAT</td>
                    <td style="text-align: right; font-size: 9px; font-weight: 700">${vat}</td>
                </tr>
                <tr>
                    <td style="font-size: 10px">Total</td>
                    <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${totalAmount}</td>
                </tr>
                <tr>
                    <td style="font-size: 10px">Paid</td>
                    <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${paid}</td>
                </tr>
                <tr>
                    <td style="font-size: 9px">Balance Due</td>
                    <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${balance}</td>
                </tr>

            </table>
        </section>
        <div>
            <hr>
            <h4 style="font-size: 9px">Note</h4>
            <p style="font-size: 9px">${note}</p>
        </div>
    </div>
</body>
</html>`
        ;
};

module.exports = Template;