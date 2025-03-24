import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';
import { Html } from 'next/document';

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
      //create hash token
      const hashedToken = await bcryptjs.hash(userId.toString(), 10);

      if (emailType === "VERIFY") {
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        });
      } else if (emailType === "RESET") {
        await User.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        });
      }

      // Looking to send emails in production? Check out our Email API/SMTP product!
      var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "0e62902446b98e",
          pass: "535423ec10bfa2",
          //TODO add these credentials to .env
        },
      });

      const mailOptions = {
        from: 'moonvaishnavi92@gmail.com',
        to: email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
        to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
        or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
        </p>`
      }

      const mailresponse = await transport.sendMail(mailOptions);
      return mailresponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
}