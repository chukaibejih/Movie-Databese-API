const UserToken = require('../models/UserToken');
const jwt = require('jsonwebtoken');

const verifyRefreshToken = async (refreshToken) => {
  const privateKey = process.env.REFRESH_PRIVATE_KEY;

  try {
    const token = await UserToken.findOne({ token: refreshToken });
    console.log(refreshToken)

    if (!token && token == null) {
      throw { error: 'Invalid refresh token' };
    }

    const tokenDetails = jwt.verify(refreshToken, privateKey);
    console.log(tokenDetails)
    return { message: 'Valid refresh token', tokenDetails };
  } catch (error) {
    throw { error: 'Invalid refresh token' };
  }
};

const verifyAcessToken = (req, res, next) => {
  const privateKey = process.env.ACCESS_PRIVATE_KEY;

  const header = req.header('Authorization')
  const token = header && header.split(' ')[1]

  if(!token) {
    throw { error: 'Access denied. Token missing.'}
  }
  try {
    const decoded = jwt.verify(token, privateKey)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({error: "Invalid token"})
  }
}

module.exports.verifyRefreshToken = verifyRefreshToken;
module.exports.verifyAcessToken = verifyAcessToken;
