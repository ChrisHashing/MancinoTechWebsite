// server/models/Lead.js
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        logo: { type: String },
        budget: { type: String },
        deliveryDate: { type: String },
        style: { type: String },
        purpose: { type: String },
        source: { type: String },
        status: { type: String, enum: ['new', 'contacted', 'qualified', 'lost', 'won'], default: 'new' },
        meta: { type: Object },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Lead', LeadSchema);


