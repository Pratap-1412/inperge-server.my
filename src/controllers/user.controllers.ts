import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '../models/UserModel';
import { validationResult } from 'express-validator';
import generateOTP from '../utils/generate-otp.helper';
import { sendEmail } from '../services/sendEmailOtp'

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
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '24h' });

    // Send token along with user data in response
    res.status(201).json({
      user: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        country_code: newUser.country_code,
        mobile_no: newUser.mobile_no,
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
        mobile_no: user.mobile_no
      },
      token,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to update first name and lastname
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

// Controller for finding user by id
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
export const initiatePasswordSet = async (req: Request, res: Response): Promise<void> => {
  const OTP_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && user.first_name) {
      const mobile_otp = generateOTP();
      const email_otp = generateOTP();
      const otp_expiry = new Date(Date.now() + OTP_EXPIRY_DURATION);
      const mobileHashedOTP = await bcrypt.hash(mobile_otp, 10);
      const emailHashedOTP = await bcrypt.hash(email_otp, 10);
      user.mobile_otp = mobileHashedOTP;
      user.email_otp = emailHashedOTP;
      user.otp_expiry = otp_expiry;
      await user.save();

      await sendEmail(user.first_name, email, email_otp)
        .catch(error => console.error('Error:', error));

      res.status(200).json({ message: 'OTP sent successfully', mobile_otp: mobile_otp });// !!!!! Edit in production !!!!!!!
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
    const { email, mobile_otp, email_otp, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && user.id && user.mobile_otp && user.email_otp && user.otp_expiry && user.otp_expiry > new Date()) {
      const isMobileOTPValid = await bcrypt.compare(mobile_otp, user.mobile_otp);
      const isEmailOTPValid = await bcrypt.compare(email_otp, user.email_otp);

      if (isMobileOTPValid && isEmailOTPValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.mobile_otp = null;
        user.email_otp = null;
        user.otp_expiry = null;
        user.is_email_verified = true;
        user.is_mobile_verified = true;
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
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '7d' });

        res.status(200).json({ message: 'PIN is valid', token });
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

    return res.status(200).json({ message: 'Additional fields updated' });
  } catch (error) {
    console.error('Error saving additional fields:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};