import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_GOOGLE_USER,
    pass: process.env.APP_GOOGLE_PASS,
  },
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,

  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // console.log({user,url,token})
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@ph.com>',
          to: user.email,
          subject: "Please verify your email",
          html: `<div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
    
    <h2 style="color: #333; text-align: center;">
      Verify Your Email Address
    </h2>

    <p style="color: #555; font-size: 15px;">
      Hello,${user.name}
    </p>

    <p style="color: #555; font-size: 15px; line-height: 1.6;">
      Thank you for creating an account with <strong>Prisma Blog</strong>.
      Please confirm your email address by clicking the button below.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}"
         style="background-color: #2563eb; color: #ffffff; padding: 12px 24px;
                text-decoration: none; border-radius: 6px; font-size: 16px;">
        Verify Email
      </a>
    </div>

    <p style="color: #555; font-size: 14px;">
      If the button doesn’t work, copy and paste the following link into your browser:
    </p>

    <p style="word-break: break-all; font-size: 13px; color: #2563eb;">
      ${url}
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

    <p style="color: #777; font-size: 12px; text-align: center;">
      If you did not create this account, you can safely ignore this email.
      <br />
      © Prisma Blog. All rights reserved.
    </p>
  </div>
</div>
`
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err)
        throw err;
      }

    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

});