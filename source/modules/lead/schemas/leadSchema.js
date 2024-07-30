const mongoose = require('mongoose');
const PhoneNumberSchema = require('./phoneNumberSchema');
const MetaSchema = require('./metaSchema');
const CompanySchema = require('./companySchema');

const LeadSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    extid: { type: String, required: true, index: true },
    city: { type: String, index: true },
    company: CompanySchema,
    country: { type: String, index: true },
    d_source: { type: String, index: true },
    dept: { type: [String], index: true },
    firstName: { type: String, index: true },
    fullName: { type: String, index: true },
    industry: { type: String, index: true },
    jobLevel: { type: String, index: true },
    jobTitle: { type: String, index: true },
    lastName: { type: String, index: true },
    linkedIn: { type: String },
    phoneNumbers: [PhoneNumberSchema],
    state: { type: String, index: true },
    subIndustry: { type: [String], index: true },
    meta: MetaSchema
}, {
    timestamps: true
});

LeadSchema.index({ firstName: 1, lastName: 1 });

module.exports = LeadSchema;
