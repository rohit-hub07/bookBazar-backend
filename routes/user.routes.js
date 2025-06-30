import express from 'express'
import { loginController, logoutController, registerController, userProfileController } from '../controllers/user.controller.js';
import { isVerified } from '../middleware/authenticateUser.js';

const userRouter = express.Router();

userRouter.post('/register',registerController)
userRouter.get('/me',isVerified, userProfileController)
userRouter.post('/login', loginController)
userRouter.get('/logout',isVerified, logoutController)

export default userRouter;