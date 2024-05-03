import express from 'express';
import {  findAllUsers, updateUserName, getUserById, deleteUserById, checkUser, verifyOTP, signUpUser, verifyPIN, updateUserPlan, initiateEmailVerification, verifyEmailOTP,  } from '../controllers/user.controllers';
import { ValidateSignupFields } from '../errors/auth-validation.error';
import { verifyToken } from '../middlewares/verify-jwt-token.middleware';
import checkSecuritySignature from '../middlewares/signature-all-api.middleware';

const authRouter = express.Router();
const userRouter = express.Router();

// Authentication Routes
authRouter.use(checkSecuritySignature); // Middleware to verify email for all auth routes
authRouter.post('/login', checkUser);
authRouter.post('/signup',  signUpUser);
authRouter.post('/verify-otp',  verifyOTP);
authRouter.post('/verify-pin', verifyPIN);

// User Routes
userRouter.use(checkSecuritySignature,verifyToken ); // Middleware to verify token & checkSecuritySignature for all user routes
userRouter.get('/', findAllUsers);
userRouter.put('/:id', updateUserName);
userRouter.put('/update-plan/:id', updateUserPlan);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);
userRouter.post('/send-email-otp/:user_id', initiateEmailVerification);
userRouter.post('/verify-email-otp/:user_id', verifyEmailOTP);


export { authRouter, userRouter };
