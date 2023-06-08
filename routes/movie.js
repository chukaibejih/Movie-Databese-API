const Movie = require('../models/Movie')
const Review = require('../models/Movie')
const { createMovieValidation, postReviewValidation } = require('../utils/validation')
const { verifyAccessToken } = require('../utils/verifyRefreshToken')
const router = require('express').Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - genre
 *         - summary
 *         - cast
 *         - directors
 *         - year
 *         - runtime
 *       properties:
 *         title:
 *           type: string
 *           description: Movie title
 *         genre:
 *           type: string
 *           description: Movie genre
 *         summary:
 *           type: string
 *           description: The summary of the movie
 *         cast:
 *           type: string
 *           description: Movie cast
 *         directors:
 *           type: string
 *           description: The director/directors of the movie
 *         year:
 *           type: number
 *           description: Release date
 *         runtime:
 *           type: string
 *           description: The duration of the movie
 *     Review:
 *       type: object
 *       required: 
 *         - userId
 *         - comment
 *       properties:
 *         userId:
 *           type: string
 *           description: User's ID
 *         comment:
 *           type: string
 *           description: Review comment
 */

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Movies Endpoint
 *   - name: Review
 *     description: Review Endpoint
 */


/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get a list of all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Successful response with the list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Internal server error
 */

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

/**
 * @swagger
 * /api/movies/{movieId}:
 *   get:
 *     summary: Get a Movie
 *     tags: [Movies]
 *     parameters:
 *      - in: path
 *        name: movieId
 *        required: true
 *        schema:
 *         type: string
 *         description: ID for the movie to retrieve
 *     responses:
 *       200:
 *         description: Successful response with the movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID or request
 *       500:
 *         description: Internal server error
 *
 */
router.get('/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params
        const movie = await Movie.findById(movieId)
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


 /**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Add a new Movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie Saved Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Some validation error
 *       500:
 *         description: Some server error
 *
 */

// endpoint to post a movie as admin
router.post('/', async (req, res) => {
    try {
        const { error } = createMovieValidation(req.body)
        if(error){
            res.status(400).json({error: error.details[0].message})
        }
        const movie = await Movie.create(req.body)
        res.status(200).json({message: "Movie Saved Successfully", movie})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

/* public endpoints */

// search for a movie

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Partial search
 *     tags: [Movies]
 *     parameters:
 *      - in: query
 *        name: keyword
 *        required: true
 *        schema:
 *         type: string
 *         description: Keyword to search for movie
 *     responses:
 *       200:
 *         description: Successful response with the movie details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *
 */

router.get('/api/movies/search', async (req, res) => {
    const { keyword } = req.query;
    const query = {};
  
    // Perform partial search using regular expression
    query.$or = [
      { title: { $regex: new RegExp(keyword, 'i') } },
      { genre: { $regex: new RegExp(keyword, 'i') } },
      { cast: { $regex: new RegExp(keyword, 'i') } },
      { directors: { $regex: new RegExp(keyword, 'i') } }
    ];
    
    try {
        const matchedMovies = await Movie.find(query);
        if (matchedMovies.length === 0) {
        res.status(404).json({ message: 'Movie not found' });
        } 
        res.status(200).json(matchedMovies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// User Reviews

/**
 * @swagger
 * /api/movies/{movieId}/reviews:
 *   get:
 *     summary: Get reviews of a movie
 *     tags: [Movies]
 *     parameters:
 *      - in: path
 *        name: movieId
 *        required: true
 *        schema:
 *         type: string
 *         description: ID for the movie to retrieve it's reviews
 *     responses:
 *       200:
 *         description: Successful response with the movie reviews
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid movie ID or request
 *       500:
 *         description: Internal server error
 *
 */
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


// post review

 /**
 * @swagger
 * /api/movies/{movieId}/reviews:
 *   post:
 *     summary: Post a new review
 *     tags: [Movies]
 *     parameters:
 *      - in: path
 *        name: movieId
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review posted Successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Some validation error
 *       500:
 *         description: Some server error
 *
 */
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

router.put('/:movieId/reviews/:reviewId', verifyAccessToken, async (req, res) => {
  try {
    const { movieId, reviewId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const reviewIndex = movie.reviews.findIndex((r) => r._id == reviewId);
    if (reviewIndex === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = movie.reviews[reviewIndex];
    if (review.userId !== req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    movie.reviews[reviewIndex] = { ...review, ...req.body };
    await movie.save();

    res.status(200).json(movie.reviews[reviewIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router