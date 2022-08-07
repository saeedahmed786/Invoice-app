const express = require('express');
const { signUp, login, getAllUsers, getUserById, updateUserProfile, googleLogin } = require('../controllers/userController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');
const upload = require('../middlewares/multer');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/get', AuthenticatorJWT, getAllUsers);
router.get('/get/:id', getUserById);
router.put('/update/:id', upload.single("file"), AuthenticatorJWT, updateUserProfile);

module.exports = router;