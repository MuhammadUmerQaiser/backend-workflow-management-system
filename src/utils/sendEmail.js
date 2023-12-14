const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (receiver, otp) => {
  const msg = {
    to: receiver,
    from: "muhammadhariskuk123@gmail.com",
    subject: "Your One Time password is:",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your One Time password is: <strong>${otp}</strong></p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
module.exports = sendEmail;
