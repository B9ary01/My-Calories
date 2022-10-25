//importing required packages
const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

//create schema to save food data
const foodSchema = new mongoose.Schema({
	name: {     type: String,     required: true   },
	typicalvalues: {   type: String   },
	unitvalue: {  type: String,     required: true   },
	 calories: {  type: String,required: true },
	carbs: {  type: String,required: true},
	fat: {  type: String,required: true },
	protein: {     type: String,required: true },
	salt: { type: String,required: true},
	sugar: { type: String, required: true },
	  createdAt: {     type: Date,     default: Date.now   },
	slug: { type: String,  required: true,     unique: true   },
	sanitizedHtml: {     type: String,     required: true   } })

foodSchema.pre('validate', function(next) {
	 if (this.name) {
	    this.slug = slugify(this.name, {
		 lower: true, strict: true })
          }
         if (this.unitvalue) {
	     this.sanitizedHtml = dompurify.sanitize(marked(this.unitvalue))
   	       next()}
         });

module.exports = mongoose.model('Food', foodSchema );









