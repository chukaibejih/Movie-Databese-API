const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const { registrationValidation, loginValidation } = require('../utils/validation')
const { generateTokens } = require('../utils/generateToken')

router.post('/register', async (req, res) => {
    
    try {
        const { name, email, password, age } = req.body

        // validate the request
        const { error } = registrationValidation(req.body)
        if(error){
            res.status(400).json({error: error.details[0].message})
        }

        // check if user exists
        const existingUser = await User.findOne({ email })
        if(existingUser) {
            res.status(400).json({error: "User already exist"})
        }

        // hash password
        const hashedpassword = await bcrypt.hash(password, saltRounds)

        // save new user
        const user = new User ({
            name,
            email,
            password: hashedpassword,
            age
        });

        await user.save()
        res.status(200).json({message:"Registration Successful", user:user})
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const { error } = loginValidation(req.body)
    if(error) {
        res.send(400).json({error: error.details[0].message})
    }

    const user = await User.findOne({ email })
    if(!user) {
        res.status(400).json({error: 'Invalid User'})
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
        res.status(400).json({error: "Invalid Password"})
    }

    // create and sign jwt for logged in user
    const { accessToken, refreshToken } = await generateTokens(user)
    console.log(accessToken)
    res.status(200).json({message:'Logged in', access_token:accessToken, refresh_token: refreshToken})
  } catch (error) {
        res.status(500).json({error: error.message})
  }
});


module.exports = router