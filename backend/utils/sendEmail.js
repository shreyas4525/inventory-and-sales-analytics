import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
  from: `"InvenTrack" <${process.env.EMAIL}>`,
  to: email,
  subject: "InvenTrack OTP Verification",
  html: `
    <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
      <div style="max-width:500px; margin:auto; background:white; padding:25px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
        
        <h2 style="text-align:center; color:#1f8ea3; margin-bottom:10px;">
          InvenTrack
        </h2>

        <p style="font-size:14px; color:#555; text-align:center;">
          Your One-Time Password (OTP)
        </p>

        <div style="text-align:center; margin:25px 0;">
          <span style="
            display:inline-block;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            color:#222;
            background:#eef2f3;
            padding:12px 20px;
            border-radius:8px;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:13px; color:#777; text-align:center;">
          This OTP is valid for 10 minutes. Do not share it with anyone.
        </p>

        <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />

        <p style="font-size:12px; color:#aaa; text-align:center;">
          If you didn’t request this, you can ignore this email.
        </p>

      </div>
    </div>
  `
});
};

export default sendEmail;