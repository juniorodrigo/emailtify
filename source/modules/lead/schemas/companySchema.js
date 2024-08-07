const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    city: { type: String, index: true },
    country: { type: String, index: true },
    domain: { type: String, index: true },
    headCount: { type: String },
    name: { type: String, index: true },
    revenue: { type: String, index: true },
    state: { type: String, index: true },
    street: { type: String },
    website: { type: String },
    // TODO: website debe ser separado entre dominio y tld
    zipcode: { type: String }
}, { _id: false });

module.exports = CompanySchema;