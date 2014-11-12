var nodemailer = require('nodemailer'); 

var transporter = nodemailer.createTransport({
	service: 'Gmail', 
	auth: {
		user: process.env.NODEMAILER_USER, 
		pass: process.env.NODEMAILER_PASSWORD
	}	
})

var mailOptions = {
    from: process.env.NODEMAILER_USER, // sender address
    to: "", // list of receivers
    subject: '', // Subject line
    text: '', // plaintext body
    html: '' // html body
};

// transporter.sendMail(mailOptions, callback);

var userInfo = {
	user: process.env.NODEMAILER_USER, 
	pass: process.env.NODEMAILER_PASSWORD
}


module.exports = {
	transporter: transporter, 
	options: mailOptions, 
	userInfo: userInfo
}