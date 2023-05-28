const { query } = require('express')
const Movie = require('../models/Movie')
const { createMovieValidation } = require('../utils/validation')
const router = require('express').Router()

/* requires admin role */

// endpoint to get a list of all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find({})
        res.status(200).json(movies)        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// endpoint to post a movie as admin
router.post('/', async (req, res) => {
    try {
        const { error } = createMovieValidation(req.body)
        if(error){
            res.status(400).json({error: error.details[0].message})
        }
        const movie = await Movie.create(req.body)
        res.status(200).json({message: "Saved Successfully", movie})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

/* public endpoints */

// search for a movie

router.get('/search', async (req, res) => {
    const { keyword } = req.query
    const query = {}

    // perform partial search using regular expression
    query.$or = [
        {title: { $regex: new RegExp(keyword, 'i')}},
        {genre: { $regex: new RegExp(keyword, 'i')}},
        {cast: { $regex: new RegExp(keyword, 'i')}},
        {directors: { $regex: new RegExp(keyword, 'i')}},
        // {year: { $regex: new RegExp(keyword, 'i')}},
    ]

    try {
        const matchedMovies  = await Movie.find(query)
        res.status(200).json(matchedMovies)
    } catch (error) {
       res.status(500).json({error: error.message}) 
    }
})


module.exports = router