const Movie = require('../models/Movie')
const Review = require('../models/Movie')
const { createMovieValidation, postReviewValidation } = require('../utils/validation')
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

router.get('/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId)
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({message: error.message})
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


// User Reviews

router.get('/:movieId/reviews', async (req, res) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId)
        const movieReviews = movie.reviews
        res.status(200).json(movieReviews)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

router.post('/:movieId/reviews', async (req, res) => {
    try {
        const { movieId } = req.params
        const { error } = postReviewValidation(req.body)
        if(error){
            return res.status(400).json({error: error.details[0].message})
        }

        const movie = await Movie.findById(movieId)
        if(!movie) {
            return res.status(404).json({ error: "Movie not found"})
        }

        const { userId, comment } = req.body
        const newReview = {
            userId: userId,
            comment: comment
        }

        movie.reviews.push(newReview)
        await movie.save()

        res.status(201).json(newReview)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.put('/:movieId/reviews/:reviewId', async (req, res) => {
    try {
        const { movieId, reviewId } = req.params;

        const movie = await Movie.findById(movieId)
        if(!movie) {
            return res.status(404).json({ error: "Movie not found"})
        }
            
        const review = await movie.reviews.find((r) => r._id == reviewId)
    
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
    
        if (review.userId !== req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    
        const updatedReview = await review.findByIdAndUpdate(reviewId, req.body, {
            new: true,
        });
    
        res.status(200).json(updatedReview);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router