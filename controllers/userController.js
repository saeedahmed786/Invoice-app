const User = require('../models/userModel');
var fs = require('fs');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinaryConfig');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config/keys');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT);


exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    if (users) {
        res.status(200).json(users);
    }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
}

exports.getUserById = async (req, res) => {
    console.log(req.params.id)
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
}

exports.signUp = async (req, res) => {
    const ifEmailAlreadyPresent = await User.findOne({ email: req.body.email });
    if (ifEmailAlreadyPresent) {
        res.status(201).json({ errorMessage: 'Email already exists. Please try another one.' });
    }
    else {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hash
        });

        const saveUser = await user.save();
        if (saveUser) {
            res.status(200).json({ successMessage: 'Account created successfuly!. Please Sign in.' });
        } else {
            res.status(400).json({ errorMessage: 'Account not created. Please try again' });
        }
    }
}


exports.login = async (req, res) => {
    const findUser = await User.findOne({ email: req.body.email });
    if (findUser) {
        const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
        if (checkPassword) {
            const payload = {
                user: {
                    _id: findUser._id
                }
            }
            jwt.sign(payload, config.jwtSecret, (err, token) => {
                if (err) res.status(400).json({ errorMessage: 'Jwt Error' })
                const { _id, fullName, email, file } = findUser;
                res.status(200).json({
                    _id, fullName, email, file,
                    token,
                    successMessage: 'Logged In Successfully',
                });
            });
        } else {
            res.status(201).json({ errorMessage: 'Incorrect username or password.' })
        }

    } else {
        res.status(201).json({ errorMessage: 'Incorrect username or password.' })
    }
}



exports.updateUserProfile = async (req, res) => {
    console.log(req.body);
    const findUser = await User.findOne({ _id: req.params.id });
    if (findUser) {
        if (req.file) {
            const imgUrl = findUser.cloudinary_id;
            await imgUrl && cloudinaryCon.uploader.destroy(imgUrl);
            const { path } = req.file;
            const uploading = await cloudinary.uploads(path, 'User Images');
            fs.unlinkSync(path);
            findUser.fullName = req.body.fullName;
            findUser.email = req.body.email;
            findUser.file = uploading;

            const saveUser = await findUser.save();
            if (saveUser) {
                res.status(200).json({
                    successMessage: 'Logged In Successfully',
                })
            } else (
                res.status(400).json({ errorMessage: 'User could not be Updated.' })
            )
        }
        else {
            findUser.fullName = req.body.fullName;
            findUser.email = req.body.email;

            const saveUser = await findUser.save();
            if (saveUser) {
                res.status(200).json({ successMessage: 'User Updated Successfully' })
            } else (
                res.status(400).json({ errorMessage: 'User could not be Updated.' })
            )
        }
    } else {
        res.status(404).json({ errorMessage: 'User not found.' })
    }
}




/******************************************************** Third-Party Login ***************************************/
// Google Login
exports.googleLogin = async (req, res) => {
    const { idToken } = req.body;
    if (idToken) {
        googleClient
            .verifyIdToken({ idToken: req.body.idToken, audience: config.googleClient })
            .then(response => {
                const { email_verified, name, email } = response.payload;
                if (email_verified) {
                    User.findOne({ email }).exec((err, user) => {
                        if (user) {
                            const payload = {
                                user: {
                                    _id: user._id
                                }
                            }
                            jwt.sign(payload, config.jwtSecret, (err, token) => {
                                if (err) res.status(400).json({ errorMessage: 'Jwt Error' })
                                const { _id, fullName, email } = user;
                                res.status(200).json({
                                    _id, fullName, email,
                                    token,
                                    successMessage: 'Logged In Successfully',
                                });
                            });
                        } else {
                            let password = email + config.jwtSecret;
                            user = new User({ fullName: name, email, password });
                            user.save((err, data) => {
                                if (err) {
                                    console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                                    res.status(400).json({
                                        errorMessage: 'User signup failed with google'
                                    });
                                }
                                const payload = {
                                    user: {
                                        _id: user._id
                                    }
                                }
                                jwt.sign(payload, config.jwtSecret, (err, token) => {
                                    if (err) res.status(400).json({ errorMessage: 'Jwt Error' })
                                    const { _id, fullName, email } = data;
                                    res.status(200).json({
                                        _id, fullName, email,
                                        token,
                                        successMessage: 'Logged In Successfully',
                                    });
                                });
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        errorMessage: 'Please provide valid verified email'
                    });
                }
            });
    } else {
        console.log("error")
    }
}