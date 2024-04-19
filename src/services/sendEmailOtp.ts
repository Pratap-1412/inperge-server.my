import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(name:string ,to: string, otp: string): Promise<void> {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_EMAIL_HOST,
    port: process.env.SMTP_EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL_USERNAME,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  // Example HTML content with OTP
  const htmlContent = `
 <!DOCTYPE html>
 <html>
   <head>
     <title>OTP Verification</title>
   </head>
   <body>
     

<table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:550px">
<tbody>

    <tr style="border-collapse:collapse">
        <td align="left" style="padding:0;Margin:0">
            <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px">
                <tbody>
                    <tr style="border-collapse:collapse">
                        <td align="center" valign="top" style="padding:0;Margin:0;width:600px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                <tbody>
                                    <tr style="border-collapse:collapse">
                                      <td align="center" style="padding:0;Margin:0;font-size:0">
                                            <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                                <tbody>
                                                    <tr style="border-collapse:collapse">
                                                        <td style="padding:0;Margin:0;border-bottom:2px solid #e5ffda;background:none;height:1px;width:100%;margin:0px">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                     </td>
                                  </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>

   <!-- <tr style="border-collapse:collapse">
        <td align="left" bgcolor="#ffffff" style="Margin:0;padding-top:25px;padding-bottom:25px;padding-right:40px;background-color:#ffffff;border-bottom: 1px solid #88b873;">
            <img src="{{LOGO_URL}}" style="display:block;border:0;outline:none;text-decoration:none;width:80px;">
        </td>
    </tr> -->

    <tr style="border-collapse:collapse">
        <td align="left" style="padding:25px 0 25px 0;Margin:0;">
             <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border-spacing:0px">
                <tbody>
                    <tr style="border-collapse:collapse">
                        <td valign="top" align="center" style="padding:0;Margin:0;width:520px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="border-collapse:collapse;border-spacing:0px">
                                <tbody>
                                    <tr style="border-collapse:collapse">
                                       <td align="center" height="16" style="padding:0;Margin:0"></td>
                                    </tr>

                                    <tr style="border-collapse:collapse">
                                       <td align="left" style="padding:0;Margin:0"><p style="Margin:0;line-height:34px;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;font-size:14px;font-style:normal;font-weight:normal;">Dear ${name}</p></td>
                                    </tr>

                                    <tr style="border-collapse:collapse">
                                       <td align="center" height="16" style="padding:0;Margin:0"></td>
                                    </tr>

                                    <tr style="border-collapse:collapse">
                                       <td align="left" style="padding:0;Margin:0">
                                        <p style="Margin:0 0 20px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">Thank you for choosing Inperge India. To ensure the security of your account and to complete the registration process, please use the following One-Time Password (OTP) to verify your email:</p>

                                        <p style="Margin:10px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">Your OTP: <strong>${otp}</strong></p>

                                        <p style="Margin:0 0 20px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">Please enter the OTP in the designated field on our website to verify your email address. If you did not attempt to sign up for an account with Inperge, please disregard this message.</p>

                                        <p style="Margin:0 0 20px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">If you encounter any issues or need further assistance, please do not hesitate to reach out to our support team at help@inperge.com.</p>

                                        <p style="Margin:0 0 20px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">We look forward to supporting your Stock Market endeavors.</p>
                                    </td>
                                    </tr>                                        

                                    <tr style="border-collapse:collapse">
                                       <td align="left" style="padding-top:15px;Margin:0">
                                        <p style="Margin:20px 0 0px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">Best Regards,</p>

                                        <p style="Margin:5px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">Inperge</p> 

                                        <p style="Margin:5px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">Email: help@inpergeindia.com</p> 
                                        <p style="Margin:5px 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;font-size:14px">Website: www.inperge.com</p> 

                                        </td>
                                    </tr>
                                    <tr style="border-collapse:collapse">
                                       <td align="left" style="padding:0;Margin:0"><p style="margin:20px 0 0 0;font-family:-apple-system,blinkmacsystemfont,roboto,helvetica,arial,sans-serif;line-height:17px;border-top: 1px solid #88b873;font-size:14px;text-align: center;padding: 20px 0 0 0;">
                                        <b style="margin-bottom: 15px;">Inperge Private Limited</b><br/>
                                        A-140,  Sector-62<br/>Noida, Uttar Pradesh
                                        </td>
                                    </tr>

                                </tbody>
                           </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>

</tbody>
</table>
   </body>
 </html>
 `;

  // Define the email options
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'hello@wizweb.in',
    to: to,
    subject: "Email OTP Verification Inperge",
    html: htmlContent,
  };

  try {
    // Send the email
    const info: nodemailer.SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }

}

