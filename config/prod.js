module.exports = {
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE,
    email: process.env.GMAIL,
    password: process.env.PASSWORD,
    googleClient: process.env.GOOGLE_CLIENT
}