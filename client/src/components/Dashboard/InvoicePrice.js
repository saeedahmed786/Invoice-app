import React from 'react'

export const InvoicePrice = ({ invoice }) => {
    let total = invoice.reduce((a, b) => a + parseInt(b.qty) * parseInt(b.price) - parseInt(b.qty) * parseInt(b.price) * (parseInt(b.discount) / 100), 0);
    return (
        <>
            {
                total.toFixed(2)
            }
        </>
    )
}
