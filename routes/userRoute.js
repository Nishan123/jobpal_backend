const express = require('express')

const router = express.Router();

const userController = require('../controllers/userController')
const { verifyToken } = require('../middleware/auth');


router.post('/login', userController.loginUser);
router.post('/signup', userController.registerUser);
router.get('/view_users',userController.getUser)
router.put('/profile', verifyToken, userController.updateUser);
router.put('/change-password', verifyToken, userController.changePassword);

// router.post('/create_users',userController.createUser)
// router.put('/:id',userController.updateUser)
// router.delete('/:id',userController.deleteUser)

module.exports = router;