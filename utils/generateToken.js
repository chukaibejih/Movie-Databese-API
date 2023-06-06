const jwt = require('jsonwebtoken')
const UserToken = require('../models/UserToken')

const generateTokens = async (user) => {
    try {
        const payload = {_id: user._id, role: user.role}
        const accessToken = jwt.sign(payload, 
                process.env.ACCESS_PRIVATE_KEY,
                { expiresIn: "30m"});
        const refreshToken = jwt.sign(payload,
            process.env.REFRESH_PRIVATE_KEY,
            { expiresIn: "2d"});

            const userToken = await UserToken.findOne({ userId: user._id})
            if (userToken){
                await userToken.deleteOne({ userId:user._id})
            }

            await new UserToken({ userId: user._id, token: refreshToken}).save()
            return Promise.resolve({ accessToken, refreshToken })
    } catch (error) {
        return Promise.reject(error)
    }
}


module.exports.generateTokens = generateTokens