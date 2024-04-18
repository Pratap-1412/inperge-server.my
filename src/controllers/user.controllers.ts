import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '../models/UserModel';
import { validationResult } from 'express-validator';
import generateOTP from '../utils/generate-otp.helper';

// Controller for user signup
export const userSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user data from request body
    const { first_name, last_name, email, mobile_no } = req.body;

    // Check if required fields are provided
    if (!first_name || !last_name || !email || !mobile_no) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check if the email or mobile number is already registered
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobile_no }],
      },
    });
    if (existingUser) {
      res.status(409).json({ error: 'Email or mobile number is already registered' });
      return;
    }

    // Create a new user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      mobile_no,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });

    // Send token along with user data in response
    res.status(201).json({
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        country_code: newUser.country_code,
        mobile_no: newUser.mobile_no,
        pin: newUser.pin,
      },
      token,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for user login
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Validate email format
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // Check if password is provided
    if (!password) {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check if password is null
    if (user.password === null) {
      res.status(409).json({ error: 'Password is not set' });
      return;
    }

    // Check if email is verified
    if (!user.is_email_verified) {
      res.status(409).json({ error: 'Email is not verified' });
      return;
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });

    // Send token along with user data in response
    res.status(200).json({
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        country_code: user.country_code,
        mobile_no: user.mobile_no,
        pin: user.pin,
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserName = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { first_name, last_name } = req.body;

    // Find user by id
    let user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user fields
    user.first_name = first_name ?? user.first_name;
    user.last_name = last_name ?? user.last_name;

    // Save updated user
    user = await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for finding all users
export const findAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error finding users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user ID from request parameters
    const userId: string = req.params.id;

    // Find user by ID in the database
    const user = await User.findByPk(userId);

    if (user) {
      // User found, send success response
      res.status(200).json({ user });
    } else {
      // User not found, send 404 error response
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    // Handle server error
    console.error('Error finding user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for deleting a user by ID
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user ID from request parameters
    const userId: string = req.params.id;

    // Find user by ID in the database
    const user = await User.findByPk(userId);

    if (user) {
      // Delete the user
      await user.destroy();
      // Send success response
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      // User not found, send 404 error response
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    // Handle server error
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for sending otp
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  const OTP_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      const otp = generateOTP();
      const otp_expiry = new Date(Date.now() + OTP_EXPIRY_DURATION);
      const hashedOTP = await bcrypt.hash(otp, 10);
      user.otp = hashedOTP;
      user.otp_expiry = otp_expiry;
      await user.save();

      // Here you should handle sending the OTP to the user via email
      // For example:
      // emailService.sendPasswordResetEmail(user.email, otp);

      console.log(otp); // For testing purposes, log the OTP to the console
      res.status(200).json({ message: 'OTP sent successfully', otp : otp});
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error initiating password reset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for handling password reset with OTP
export const setPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && user.id && user.otp && user.otp_expiry && user.otp_expiry > new Date()) {
      const isOTPValid = await bcrypt.compare(otp, user.otp);

      if (isOTPValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otp_expiry = null;
        user.is_email_verified = true;
        await user.save();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
        res.status(200).json({ message: 'Password reset successful', token });
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } else {
      res.status(400).json({ error: 'Invalid request or OTP expired' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};