const { JsonWebTokenError } = require('jsonwebtoken')
const AuthService = require('../auth/auth-service')

async function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  console.log('authToken:', authToken)
  let bearerToken
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken)
    console.log('payload:', payload)

    const user = await AuthService.getUserWithUserName(
      req.app.get('db'),
      payload.sub,
    )
    console.log('user is:', user)

    if (!user)
      return res.status(401).json({ error: 'No User Unauthorized request' })

    req.user = user
    next()
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      console.log('no JWT instance')
      return res.status(401).json({ error: 'JWT Token issue Unauthorized request' })

    next(error)
  }
}

module.exports = {
  requireAuth,
}
