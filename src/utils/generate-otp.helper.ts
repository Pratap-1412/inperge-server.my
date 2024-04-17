// utils/otp.ts
const generateOTP = (): string => {
    const length = 6; // Length of the OTP
    const digits = '0123456789'; // Characters used for generating OTP
  
    let otp = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * digits.length);
      otp += digits[index];
    }
  
    return otp;
  };
  
  export default generateOTP;
  