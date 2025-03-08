import config from "../../config/config.js";
import nodemailer from "nodemailer";
import { User } from "../../models/index.js";
import { resolve } from "path";
import { pugEngine } from "nodemailer-pug-engine";

function connection() {
  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: null,
  });

  transporter.use(
    "compile",
    pugEngine({
      templateDir: resolve("views/emails"),
      pretty: true,
    })
  );

  return transporter;
}

const newBookCreated = (users, book) => {
  const connector = connection();
  const mailOptions = {
    from: config.mail.sender,
    to: users.map((u) => u.email),
    subject: book.title,
    template: "book_notification",
    ctx: {
      title: book.title,
      description: book.description,
    },
  };

  connector.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const newUserCreated = (user) => {
  const connector = connection();

  const mailOptions = {
    from: config.mail.sender,
    to: user.email,
    subject: "Welcome ITI",
    template: "register",
    ctx: {
      name: user.name,
    },
  };

  connector.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const newOrderCreated = async (order) => {
  const connector = connection();

  await order.populate("userId")

  const mailOptions = {
    from: config.mail.sender,
    to: order.userId.email,
    subject: "New Order ITI",
    template: "order_confirm",
    ctx: {
      name: order.userId.name,
      orderId: order._id,
      totalAmount: order.totalPrice,
      status: order.status,
    },
  };

  connector.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};



const orderStatusUpdated = async (order) => {
  const connector = connection();
  await order.populate("userId")

  const mailOptions = {
    from: config.mail.sender,
    to: order.userId.email,
    subject: "New Order ITI",
    template: "order_status",
    ctx: {
      name: order.userId.name,
      orderId: order._id,
      status: order.status,
    },
  };

  connector.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};


export default {
  notifyAllUsers: async (book) => {
    const users = await User.find();
    newBookCreated(users, book);
  },
  welcome: async (user) => {
    newUserCreated(user);
  },
  new_order: async (order) => {
    newOrderCreated(order);
  },
  order_updated: async (order) => {
    orderStatusUpdated(order);
  },
};
