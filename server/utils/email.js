const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log(`[EmailService] Attempting to send email to: ${options.email}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('----------------------------------------------------');
        console.log('CRITICAL: Missing email credentials in .env');
        console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'FOUND' : 'MISSING');
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'FOUND' : 'MISSING');
        console.log('Simulating email send (STDOUT only):');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log('----------------------------------------------------');
        throw new Error('Email configuration missing in server .env');
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Student Result System" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || `<p>${options.message}</p>`,
        };

        console.log(`[EmailService] Sending via Nodemailer...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Email sent successfully: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`[EmailService] Error occurred:`, error.message);
        throw error; // Re-throw so controller can handle it
    }
};

module.exports = sendEmail;
