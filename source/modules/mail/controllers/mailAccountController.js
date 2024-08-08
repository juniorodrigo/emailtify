const mongoose = require('mongoose');
const mailingServices = require('../services/mailingServices');
const { validateEmail } = require('../../../common/helpers/helper');
const MailAccount = require('../models/mailAccountModel');
const bcrypt = require('bcrypt');

// Router handlers
const addSmtpMailAccount = async (req, res) => {
    try {
        const accountConfigs = req.body
        const { firstName, lastName, email, password, imapHost, imapPort, smtpHost, smtpPort, workspaceId } = accountConfigs;

        if (!firstName || !lastName || !email || !password || !imapHost || !imapPort || !smtpHost || !smtpPort || !workspaceId) {
            throw new Error('Faltan campos requeridos');
        }
        if (!validateEmail(email)) throw new Error('Formato de email inválido');

        // Validación de no existencia de la cuenta de email
        // TODO: Validar que un mismo correo puede existir para más de un workspace. el duplicado solo puede verificar para el workspace mismo.
        const existingMail = await MailAccount.findOne({ email });
        if (existingMail) throw new Error('Ya existe esa cuenta de email');


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

        // Se ingresa el registro al workspace
        // TODO: Analizar extraer este bloque a una interfaz, para evitar importar modelo Workspace
        const Workspace = mongoose.model('Workspace');
        const workspaceRegistry = await Workspace.findByIdAndUpdate(workspaceId, { $push: { mailAccounts: resultx._id } });

        if (!workspaceRegistry) throw new Error('No se pudo agregar la cuenta SMTP al workspace');

        res.success('Cuenta de email SMTP agregada correctamente');
    } catch (error) {
        console.log(error);
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

const addGmailAccount = async (req, res) => {
    try {
        const { email, password, workspaceId } = req.body;

        if (!email || !password) throw new Error('Faltan campos requeridos');
        if (!validateEmail(email)) throw new Error('Formato de email inválido');

        const existingMail = await MailAccount.findOne({ email });
        if (existingMail) throw new Error('Ya existe esa cuenta de email');

        // TODO: Añadir validación de conexión a Gmail

        const accountConfigs = {}
        accountConfigs.email = email
        accountConfigs.password = await bcrypt.hash(req.body.password, 10);

        const newMailAccount = new MailAccount({
            email: email,
            type: 'gmail-simple',
            config: accountConfigs
        });

        const resultx = await newMailAccount.save();
        if (!resultx) throw new Error("No se pudo agregar la cuenta gmail");

        // Se ingresa el registro al workspace
        // TODO: Analizar extraer este bloque a una interfaz, para evitar importar modelo Workspace
        const Workspace = mongoose.model('Workspace');
        const workspaceRegistry = await Workspace.findByIdAndUpdate(workspaceId, { $push: { mailAccounts: resultx._id } });

        if (!workspaceRegistry) throw new Error('No se pudo agregar la cuenta gmail al workspace');

        res.success('Cuenta de gmail agregada correctamente');

    } catch (error) {
        console.log(error)
        res.error(error.message);

    }
}

const addOutlookAccount = async (req, res) => {
    try {
        const { email, password, workspaceId } = req.body;

        if (!email || !password) throw new Error('Faltan campos requeridos');
        if (!validateEmail(email)) throw new Error('Formato de email inválido');

        const existingMail = await MailAccount.findOne({ email });
        if (existingMail) throw new Error('Ya existe esa cuenta de email');

        // TODO: Añadir validación de conexión a Gmail

        const accountConfigs = {}
        accountConfigs.email = email
        accountConfigs.password = await bcrypt.hash(req.body.password, 10);

        const newMailAccount = new MailAccount({
            email: email,
            type: 'outlook-simple',
            config: accountConfigs
        });

        const resultx = await newMailAccount.save();
        if (!resultx) throw new Error("No se pudo agregar la cuenta outlook");

        // Se ingresa el registro al workspace
        // TODO: Analizar extraer este bloque a una interfaz, para evitar importar modelo Workspace
        const Workspace = mongoose.model('Workspace');
        const workspaceRegistry = await Workspace.findByIdAndUpdate(workspaceId, { $push: { mailAccounts: resultx._id } });

        if (!workspaceRegistry) throw new Error('No se pudo agregar la cuenta outlook al workspace');

        res.success('Cuenta de outlook agregada correctamente');

    } catch (error) {
        console.log(error)
        res.error(error.message);

    }
}

// Funciones puras
const addSmtpMailAccountFunction = async (settings) => {
    const { firstName, lastName, email, password, imapHost, imapPort, smtpHost, smtpPort } = settings;

    // TODO: Validar si el mail ya está registrado para ese workspace


};

module.exports = {
    addSmtpMailAccount,
    addGmailAccount,
    addOutlookAccount,

    addSmtpMailAccountFunction,
    validateImapConnection,
    validateSmtpConnection
}