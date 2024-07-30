const nodemailer = require('nodemailer');
const imaps = require('imap-simple');


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // La URL de tu servidor SMTP
    port: process.env.SMTP_PORT, // El puerto de tu servidor SMTP
    secure: process.env.SMTP_SECURE === 'true', // true para puerto 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER, // Tu dirección de correo electrónico
        pass: process.env.SMTP_PASS, // Tu contraseña de correo electrónico
    },
});

// Define las opciones del correo electrónico
const mailOptions = {
    from: process.env.SMTP_USER, // Dirección del remitente
    to: 'destinatario@ejemplo.com', // Dirección del destinatario
    subject: 'Asunto del correo',
    text: 'Contenido del correo en texto plano',
    html: '<p>Contenido del correo en formato HTML</p>',
};

// Envía el correo
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log('Error al enviar el correo:', error);
//     }
//     console.log('Correo enviado:', info.response);
// });


// Pure functions

const validateImapConnection = async (email, password, host, port) => {
    const config = {
        imap: {
            user: email,
            password: password,
            host: host,
            port: port,
            tls: true,
            authTimeout: 3000
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.end();
        return true;
    } catch (error) {
        return false;
    }
};

const validateSmtpConnection = async (email, password, host, port) => {
    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user: email,
            pass: password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        await transporter.verify();
        return { success: true, message: 'Connection successful' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}


module.exports = {
    validateImapConnection,
    validateSmtpConnection
}