
import config from "../../config/config.js";
import nodemailer from "nodemailer"
import { User } from "../../models/index.js"



function connection(){
  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: {
        user: config.mail.username,
        pass: config.mail.password,
    },
  });

  return transporter
}

const send = (users, book)=>{
  const connector = connection();

  const mailOptions = {
    from: config.mail.sender,
    to: users.map(u=>u.email),
    subject: book.title,
    text: book.description,
    html: book.description
  };

  connector.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error: ' + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

export default {
  notifyAllUsers:async (book) => {
    const users = await User.find();
    send(users, book)
  }
}