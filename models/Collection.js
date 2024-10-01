const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    namePersons: [{ type: String, required: false }],
    namePersonsFather: [{ type: String, required: false }],
    namePersonsMother: [{ type: String, required: false }],
    namePersonsBDay: [{ type: String, required: false }],
    namePersonsAddress: [{ type: String, required: false }],
    namePersonsNumber: [{ type: String, required: false }],
    namePersonsCity: [{ type: String, required: true }],
    nameCompanys: [{ type: String, required: false }],
    nameCompanysAddress: [{ type: String, required: false }],
    nameCompanysADay: [{ type: String, required: false }],
    part: { type: String, required: true },
    date: { type: Date, required: true },
    ministry: { type: String, required: true },
    text: { type: String, required: true },
});

module.exports = mongoose.model('Collection', CollectionSchema)