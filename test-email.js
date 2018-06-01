var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'corentin.duval9@gmail.com',
    pass: 'Massey6277!'
  }
});

var mailOptions = {
  from: 'corentin.duval9@gmail.com',
  to: 'corentin.duval9@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});