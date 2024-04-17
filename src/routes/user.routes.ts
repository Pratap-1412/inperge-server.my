import express from 'express';
import { userSignup, findAllUsers, updateUserName, userLogin, getUserById, deleteUserById, sendOTP, setPassword,  } from '../controllers/user.controllers';
import { ValidateSignupFields } from '../errors/auth-validation.error';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';

const authRouter = express.Router();
const userRouter = express.Router();

// Authentication Routes
authRouter.use(checkSecuritySignature); // Middleware to verify email for all auth routes
authRouter.post('/login', userLogin);
authRouter.post('/signup', ValidateSignupFields, userSignup);
authRouter.post('/send-otp', sendOTP);
authRouter.patch('/set-password', setPassword);

// User Routes
userRouter.use(checkSecuritySignature,verifyToken ); // Middleware to verify token & checkSecuritySignature for all user routes
userRouter.get('/', findAllUsers);
userRouter.put('/:id', updateUserName);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);


export { authRouter, userRouter };
