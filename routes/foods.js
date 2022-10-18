const express = require('express')
const Food = require('./../models/food')

const router = express.Router()


//add food details
router.get('/new', (req, res) => {
    res.render('foods/new')
});

module.exports = router;                                                                   
