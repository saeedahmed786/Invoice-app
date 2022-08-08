const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const customerRoutes = require('./Routes/customerRoutes');
const invoicesRoutes = require('./Routes/invoicesRoutes');
const mongoose = require('mongoose');
const path = require("path");
const nodemailer = require("nodemailer");
const pdf = require('html-pdf')
const Template = require("./pdf-template");
const config = require('./config/keys');
const { fileURLToPath } = 'url';
const { dirname } = 'path';
const app = express();

const router = express.Router();

/******************************************MiddleWares  ********************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoicesRoutes);

// const fileName = fileURLToPath()
// const dirName = dirname(fileName)

/******************************************MongoDb Connection********************************************/

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./frontend/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));

    });
}


app.post("/api/send/invoice", async (req, res) => {
    var options = { format: 'A3' };
    // console.log(JSON.stringify(req.body));
    // console.log(req.files);
    const { customer } = req.body
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email,
            pass: config.password,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    pdf.create(Template(req.body), options).toFile('invoice.pdf', (err) => {

        // send mail with defined transport object
        transporter.sendMail({
            from: ` UniAncer admin@uniancer.com`, // sender address
            to: `${customer}`, // list of receivers
            subject: `Invoice from UniAncer`, // Subject line
            text: `Invoice from UniAncer`, // plain text body
            attachments: [{
                filename: 'invoice.pdf',
                path: `./invoice.pdf`
            }]
        });

        if (err) {
            res.send(Promise.reject());
        }
        res.status(200).json({ successMessage: "Invoice sent successfully" });
    });
})

router.get("/api", async(req, res) => {
    res.send("Server running....")
})


app.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));


