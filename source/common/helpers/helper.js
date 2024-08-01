const { v4: uuidv4 } = require('uuid');
const { Binary } = require('bson');
// Otros
module.exports.generateUID = () => {
    return uuidv4();
};

module.exports.validateEmail = (emailString) => {
    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(emailString);
}

module.exports.isValidUUID = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

module.exports.uuidToBinary = (uuid) => {
    const hex = uuid.replace(/-/g, '');
    const buffer = Buffer.from(hex, 'hex');
    return new Binary(buffer, Binary.SUBTYPE_UUID);
}