const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    namePersons: [{ type: String, required: true }],
    namePersonsFather: [{ type: String, required: true }],
    namePersonsMother: [{ type: String, required: true }],
    namePersonsBDay: [{ type: String, required: true }],
    namePersonsAddress: [{ type: String, required: true }],
    namePersonsNumber: [{ type: String, required: true }],
    namePersonsCity: [{ type: String, required: true }],
    nameCompanys: [{ type: String, required: true }],
    nameCompanysAddress: [{ type: String, required: true }],
    nameCompanysADay: [{ type: String, required: true }],
    part: { type: String, required: true },
    date: { type: Date, required: true },
    ministry: { type: String, required: true },
    text: { type: String, required: true },
});

module.exports = sectionSchema;