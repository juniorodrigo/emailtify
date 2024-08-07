const mongoose = require('mongoose');
const PhoneNumberSchema = require('./phoneNumberSchema');
const CompanySchema = require('./companySchema');

const LeadSchema = new mongoose.Schema({
    firstName: { type: String, index: true },
    lastName: { type: String, index: true },
    fullName: { type: String, index: true },

    company: CompanySchema,

    country: { type: String, index: true },
    city: { type: String, index: true },
    state: { type: String, index: true },

    jobLevel: { type: String, index: true },
    jobTitle: { type: String, index: true },
    industry: { type: String, index: true },
    subIndustry: { type: [String], index: true },
    dept: { type: [String], index: true },

    linkedIn: { type: String },
    phoneNumbers: [PhoneNumberSchema],
    source: { type: String, index: true },
}, {
    timestamps: true
});

LeadSchema.index({ firstName: 1, lastName: 1 });

module.exports = LeadSchema;
