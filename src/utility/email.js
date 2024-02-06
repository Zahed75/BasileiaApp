const nodemailer = require('nodemailer');



const createToken = require('./createToken');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'customerservice@onnow.io',
    pass: 'mazcubtektrbwaww',
  },
});








exports.sendSetPasswordEmail = (to, user) => {
  const { email, brands } = user;

  const setPasswordToken = createToken({ email }, { expiresIn: '24h' });

  const setPasswordLink = `${process.env.CLIENT_URL}/invitation?token=${setPasswordToken}`;

  const brandManagerEmail = brandManagerInvitationEmail({
    setPasswordLink,
    brands,
  });

  let mailOptions = {
    from: 'Onnow Customer Service <customerservice@onnow.io>',
    to,
    subject: 'Brand Manager Set Password',
    html: brandManagerEmail,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (err, info) => {
      console.log({ info, err });
      if (err) resolve(err);
      resolve(info);
    });
  });
};





exports.setPasswordEmailOutlet = (to, user) => {
  const { email, outlets } = user;

  const setPasswordToken = createToken({ email }, { expiresIn: '24h' });

  const setPasswordLink = `${process.env.CLIENT_URL}/invitation?token=${setPasswordToken}`;

  const outletManagerEmail = outletManagerInvitationEmail({
    setPasswordLink,
    outlets,
  });

  let mailOptions = {
    from: 'Onnow Customer Service <customerservice@onnow.io>',
    to,
    subject: 'Outlet Manager Set Password',
    html: outletManagerEmail,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (err, info) => {
      console.log({ info, err });
      if (err) resolve(err);
      resolve(info);
    });
  });
};




exports.SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
  let mailOptions = {
    from: 'Syscomatic-Technologies  <tech.syscomatic@gmail.com>',
    to: EmailTo,
    subject: EmailSubject,
    text: EmailText,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (err, info) => {
      console.log({ info });
      if (err) {
        resolve(err);
      }
      resolve(info);
    });
  });
};

exports.sendManagerOrderPlacedEmail = (user, order) => {
  const { email, role } = user;

  const orderPlaceEmail = placedOrderManagerEmail(user, order);

  let mailOptions = {
    from: 'Onnow Customer Service <customerservice@onnow.io>',
    to: email,
    subject: `Your ${
      role === BRAND_MANAGER ? 'Brand' : 'Kitchen'
    } received an order`,
    html: orderPlaceEmail,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (err, info) => {
      console.log({ info });
      if (err) {
        resolve(err);
      }
      resolve(info);
    });
  });
};

exports.sendCustomerOrderPlacedEmail = (brand, order) => {
  const { customer } = order;

  const orderPlaceEmail = placedOrderCustomerEmail(brand, order);

  let mailOptions = {
    from: 'Onnow Customer Service <customerservice@onnow.io>',
    to: customer.email,
    subject: `Your order placed successfully`,
    html: orderPlaceEmail,
  };

  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (err, info) => {
      console.log({ info });
      if (err) {
        resolve(err);
      }
      resolve(info);
    });
  });
};
