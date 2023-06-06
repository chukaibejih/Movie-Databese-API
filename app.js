const express = require('express')
require('dotenv').config()
const { default: mongoose } = require('mongoose')
const port = (process.env.PORT || 3000)
const userRoute = require('./routes/auth')
const movieRoute = require('./routes/movie')
const swagger = require('./swagger')
const app = express()

app.use(express.json())
// invoke swagger config
swagger(app)

app.get('/', (req, res) => {
    console.log("Hello World")
})

// router middleware
app.use('/api/users/', userRoute)
app.use('/api/movies/', movieRoute)

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected!")
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch((error) => {
    console.log(error.message)
})

module.exports = app