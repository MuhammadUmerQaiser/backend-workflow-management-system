const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (receiver,password) => {
  const msg = {
    to: receiver,
    from: "muhammadhariskuk123@gmail.com",
    subject: "Your credentials are:",
    text: `Your password against the email ${receiver} is: ${password}`,
    html: `<p>Your  password is: <strong>${password}</strong></p>`,
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
