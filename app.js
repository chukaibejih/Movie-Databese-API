const express = require('express')
require('dotenv').config()
const { default: mongoose } = require('mongoose')
const port = (process.env.PORT || 3000)
const userRoute = require('./routes/auth')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    console.log("Hello World")
})

// router middleware
app.use('/api/users/', userRoute)

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