import nodemailer from "nodemailer";

export const sendEmail = async ({
  to=[],
  cc=[],
  bcc=[],
  attchment=[],
  text="",
  html="",
  subject="Route",
}={})=>{

const transporter =  nodemailer.createTransport({
  // host: "smtp.ethereal.email",
  service:"gmail",
  auth: {
    user: process.env.EMAIL,
    pass:process.env.EMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `" Route Academy👻" <${process.env.EMAIL}>`, // sender address
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    to,
    cc,
    bcc,
    text,
    html,
    subject,
    attchment,
  });
  console.log("Message Send Succssfully ",info.meesage);
  
}