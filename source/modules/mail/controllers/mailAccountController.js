const mongoose = require('mongoose');
const mailingServices = require('../services/mailingServices');
const { validateEmail } = require('../../../common/helpers/helper');
const MailAccount = require('../models/mailAccountModel');
const bcrypt = require('bcrypt');

// Router handlers
const addSmtpMailAccount = async (req, res) => {
    try {
        const accountConfigs = req.body
        const { firstName, lastName, email, password, imapHost, imapPort, smtpHost, smtpPort } = accountConfigs;

        if (!firstName || !lastName || !email || !password || !imapHost || !imapPort || !smtpHost || !smtpPort) {
            throw new Error('Faltan campos requeridos');
        }
        if (!validateEmail(email)) throw new Error('Formato de email inválido');

        // Validación de no existencia de la cuenta de email
        const existingMail = await MailAccount.findOne({ email });
        if (existingMail) {
            return res.error('Email already exists', 400, 'Duplicate Email');
        }

        // Valida que la conexión al servidor IMAP sea exitosa
        const imapConnection = await mailingServices.validateImapConnection(email, password, imapHost, imapPort);
        if (!imapConnection) throw new Error('No se pudo conectar al servidor IMAP');

        // Valida la conexión SMTP
        const smtpConnection = await mailingServices.validateSmtpConnection(email, password, smtpHost, smtpPort);
        if (!smtpConnection.success) throw new Error('No se pudo conectar al servidor SMTP');

        // Acá se realiza la inserción del nuevo registro a mongo
        accountConfigs.password = await bcrypt.hash(req.body.password, 10);
        const newMailAccount = new MailAccount({
            email: accountConfigs.email,
            type: 'smtp',
            config: accountConfigs
        });
        const resultx = await newMailAccount.save();

        if (!resultx) throw new Error("No se pudo agregar la cuenta SMTP");

        res.success('Cuenta de email SMTP agregada correctamente');
    } catch (error) {
        res.error(error.message);
    }
};

const validateImapConnection = async (req, res) => {
    try {
        const { email, password, imapHost, imapPort } = req.body;

        if (!email || !password || !imapHost || !imapPort) throw new Error('Faltan campos requeridos');
        if (!validateEmail(email)) throw new Error('Formato de email inválido');

        const result = await mailingServices.validateImapConnection(email, password, imapHost, imapPort);

        if (!result) throw new Error('No se pudo conectar al servidor IMAP');

        res.success('Conexión exitosa al servidor IMAP');
    } catch (error) {
        res.error(error.message);
    }
};

const validateSmtpConnection = async (req, res) => {
    try {
        const { email, password, smtpHost, smtpPort } = req.body;

        if (!email || !password || !smtpHost || !smtpPort) throw new Error('Faltan campos requeridos');
        if (!validateEmail(email)) throw new Error('Formato de email inválido');

        const result = await mailingServices.validateSmtpConnection(email, password, smtpHost, smtpPort);

        if (!result.success) throw new Error(result.message);

        res.success('Conexión exitosa al servidor SMTP');
    } catch (error) {
        res.error(error.message);
    }
};


// Funciones puras
const addSmtpMailAccountFunction = async (settings) => {
    const { firstName, lastName, email, password, imapHost, imapPort, smtpHost, smtpPort } = settings;

    // TODO: Validar si el mail ya está registrado para ese workspace


};

module.exports = {
    addSmtpMailAccount,
    addSmtpMailAccountFunction,
    validateImapConnection,
    validateSmtpConnection
}