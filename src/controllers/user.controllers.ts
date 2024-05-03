import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '../models/user.model';
import { validationResult } from 'express-validator';
import generateOTP from '../utils/generate-otp.helper';
import { sendEmail } from '../services/sendEmailOtp'
import Balance from '../models/funds.model';

// Controller to update first name and lastname
export const updateUserName = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.params.id;
    const { first_name, last_name } = req.body;

    // Find user by id
    let user = await User.findByPk(user_id);
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

// Controller to update first name and lastname
export const updateUserPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = req.params.id;
    const { plan_id } = req.body;

    // Find user by id
    let user = await User.findByPk(user_id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user fields
    user.plan_id = plan_id ?? user.plan_id;

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

// Controller for finding user by id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user ID from request parameters
    const user_id: string = req.params.id;

    // Find user by ID in the database
    const user = await User.findByPk(user_id);

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
    const user_id: string = req.params.id;

    // Find user by ID in the database
    const user = await User.findByPk(user_id);

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

// New code here

// Controller for verifying mobile number
export const checkUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile_no } = req.body;

    // Check if the mobile number is already registered
    const existingUser = await User.findOne({
      where: { mobile_no },
      attributes: ['is_registered', 'is_mobile_verified'],
    });

    if (existingUser && existingUser.is_registered && existingUser.is_mobile_verified) {
      res.status(200).json({ isRegistered: true, isVerified: true });
      return;
    }

    // Generate a new OTP using a faster method
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Update the user or create a new one with OTP
    const [user] = await User.upsert({
      mobile_no,
      mobile_otp: hashedOTP,
      otp_expiry: new Date(Date.now() + 5 * 60 * 1000), // OTP expires in 5 minutes
      is_mobile_verified: false,
      is_registered: false,
    }, { returning: true }); // Postgres-specific

    // ... (implement OTP sending logic)

    res.status(200).json({ isRegistered: false, isVerified: false, otp });
  } catch (error) {
    console.error('Error verifying mobile number:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to vrify pin for login
export const verifyPIN = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile_no, pin } = req.body;
    const user = await User.findOne({ where: { mobile_no } });

    if (user) {
      // Check if the PIN is correct
      const isPINValid = await bcrypt.compare(pin, user.pin);

      if (isPINValid) {
        // PIN is correct

        // Generate a JWT token
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '7d' });

        res.status(200).json({ message: 'PIN is valid', token: token, user_id: user.id });
      } else {
        // Password is incorrect
        res.status(401).json({ error: 'Invalid PIN' });
      }
    } else {
      // User not found
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error verifying PIN:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for verifying OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { mobile_no, otp } = req.body;

    // Find the user by mobile number
    const user = await User.findOne({ where: { mobile_no } });

    if (user) {
      // Check if the OTP is expired
      if (user.otp_expiry && user.otp_expiry < new Date()) {
        res.status(400).json({ error: 'OTP expired' });
        return;
      }

      // Check if the mobile_otp field is present
      if (user.mobile_otp) {
        // Compare the OTP with the stored value
        const isOTPValid = await bcrypt.compare(otp, user.mobile_otp);

        if (isOTPValid) {
          // OTP is valid, mark the user's mobile number as verified
          user.is_mobile_verified = true;
          user.mobile_otp = null; // Clear the OTP field
          user.otp_expiry = null; // Clear the OTP expiry
          await user.save();

          res.status(200).json({ message: 'OTP Verified Successfully', isRegistered: user.is_registered });
        } else {
          // OTP is incorrect
          res.status(400).json({ error: 'Invalid OTP' });
        }
      } else {
        // No OTP found for the user
        res.status(400).json({ error: 'OTP not found' });
      }
    } else {
      // User not found
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for saving additional fields for a verified mobile number
export const signUpUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { mobile_no, email, pin, first_name, last_name } = req.body;

    // Find the user by mobile number and check if email already exists in parallel
    const [user, existingUser] = await Promise.all([
      User.findOne({ where: { mobile_no } }),
      User.findOne({ where: { email }, attributes: ['id'] }),
    ]);

    if (!user) {
      // User not found
      return res.status(404).json({ error: 'User not found' });
    }

    if (existingUser && existingUser.id !== user.id) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    if (!user.is_mobile_verified) {
      // Mobile number not verified
      return res.status(400).json({ error: 'Mobile number not verified' });
    }

    // Hash the pin
    const hashedPin = await bcrypt.hash(pin, 10);

    // Update additional fields
    user.email = email;
    user.pin = hashedPin;
    user.first_name = first_name;
    user.last_name = last_name;
    user.is_registered = true;

    // Save the user
    await user.save();
    await Balance.create({ user_id: user.id }); // Creating a default balance for user
    return res.status(200).json({ message: 'Additional fields updated' });
  } catch (error) {
    console.error('Error saving additional fields:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const initiateEmailVerification = async (req: Request, res: Response): Promise<void> => {
  const EMAIL_OTP_EXPIRY_DURATION = 10 * 60 * 1000;
  try {
    const { user_id } = req.params;
    const { email } = req.body;

    // Find the user by ID
    const user = await User.findByPk(user_id);

    if (user && user.first_name && user.email === email) {
      // Generate an OTP for email verification
      const emailOTP = generateOTP();
      const hashedEmailOTP = await bcrypt.hash(emailOTP, 10);
      const otpExpiry = new Date(Date.now() + EMAIL_OTP_EXPIRY_DURATION);

      // Update the user with the email OTP and expiry
      user.email_otp = hashedEmailOTP;
      user.otp_expiry = otpExpiry;
      await user.save();

      // Send the OTP to the user's email
      await sendEmail(user.first_name, email, emailOTP)
        .catch(error => console.error('Error sending email:', error));

      res.status(200).json({ message: 'Email verification OTP sent successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error initiating email verification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller for verifying the email OTP
export const verifyEmailOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { otp } = req.body;

    // Find the user by ID
    const user = await User.findByPk(user_id);

    if (user) {
      // Check if the OTP is expired
      if (user.otp_expiry && user.otp_expiry < new Date()) {
        res.status(400).json({ error: 'OTP expired' });
        return;
      }
      // Check if the email_otp field is present
      if (user.email_otp) {
        // Compare the OTP with the stored value
        const isOTPValid = await bcrypt.compare(otp, user.email_otp);

        if (isOTPValid) {
          // OTP is valid, mark the user's email as verified
          user.is_email_verified = true;
          user.email_otp = null; // Clear the OTP field
          user.otp_expiry = null; // Clear the OTP expiry
          await user.save();

          res.status(200).json({ message: 'Email verified successfully' });
        } else {
          // OTP is incorrect
          res.status(401).json({ error: 'Invalid OTP' });
        }
      } else {
        // No OTP found for the user
        res.status(404).json({ error: 'OTP not found in the database' });
      }
    } else {
      // User not found
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};