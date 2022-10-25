
const express = require('express')
const Food = require('../models/food')
const router = express.Router()

//if user is not loggedin, the user is redirected to the login page
const redirectLogin = (req, res, next) => { if 
(!req.session.userId ) {
	 res.redirect('./login') }
 else { next (); } }

//get route renders new page to add food details
router.get('/new', (req, res) => {
  res.render('foods/new', { food: new Food() })
});

//route to edit food data using particular food id
router.get('/edit/:id', async (req, res) => {
  const food = await Food.findById(req.params.id)
	  res.render('foods/edit', { food: food}) });

//save food data and redirect to foodpage
router.post('/', async (req, res, next) => {
	        req.food = new Food()
	         next()
}, saveFoodAndRedirect('http://localhost:8000/foodpage'));


//ejs template displays food data using slug 
router.get('/:slug', async (req, res) => {
const food = await Food.findOne({ slug: req.params.slug })
	 if (food == null) res.redirect('http://localhost:8000/foodpage')
	res.render('foods/show', { food: food })
});

//cart ejs page displays data using slug
router.get('/cart/:slug', async (req, res) => {
const food = await Food.findOne({ slug: req.params.slug })
if (food == null) res.redirect('http://localhost:8000/foodpage');
	res.render('foods/cart', { food: food })
});

//edit and update food data with the help of unique id
router.put('/:id', async (req, res, next) => {
        req.food = await Food.findById(req.params.id)
	        next()
}, saveFoodAndRedirect('edit'))

//delete food using unique id
router.delete('/:id', async (req, res) => {
	        await Food.findByIdAndDelete(req.params.id)
         res.redirect('http://localhost:8000/foodpage') });

//save and redirect function
function saveFoodAndRedirect(path) {
	        return async (req, res) => {
         let food = req.food
		 food.name = req.body.name                                                       
		 food.typicalvalues= req.body.typicalvalues  
		 food.unitvalue = req.body.unitvalue 
		 food.calories = req.body.calories 
		 food.carbs = req.body.carbs  
		 food.fat = req.body.fat                  
		 food.protein = req.body.protein          
		 food.salt = req.body.salt                       
		 food.sugar = req.body.sugar                                                            
	 try { food= await food.save()
	 res.redirect('http://localhost:8000/savedpage')
	 } catch (e) {
	res.send( '<a href='+'http://localhost:8000/'+'>Home</a>'+ '<br />'
	+'Link to homepage');

		} } }
module.exports = router;                                                                   
                                                    





