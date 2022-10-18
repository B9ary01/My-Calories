//importing required packages
const mongoose = require('mongoose')

//create schema to save food data
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    typicalvalues: { type: String },
    unitvalue: { type: String, required: true },
    calories: { type: String, required: true },
    carbs: { type: String, required: true },
    fat: { type: String, required: true },
    protein: { type: String, required: true },
    salt: { type: String, required: true },
    sugar: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})



module.exports = mongoose.model('Food', foodSchema);









