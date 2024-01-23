const UserController = require('../controllers/UserController');

const router = require('express').Router();

//Middlewares
const verifyToken = require('../helpers/verify-token');
const {imageUpload} = require('../helpers/image-upload');
//Register
router.post('/register', UserController.register);

//Login
router.post('/login', UserController.login);

//User Validation
router.get('/checkuser', UserController.checkUser);

//Get User By Id
router.get('/:id', UserController.getUserById);

//Edit User
router.patch('/edit/:id', verifyToken,imageUpload.single("image"), UserController.editUser);

module.exports = router;