const jwt = require('jsonwebtoken')
const User = require('../model/user')

module.exports = async (req, res, next) => {
    
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'verySecret')
        const user = await User.findOne({_id : decode._id, token})

        if(!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }
    catch(e) {
        res.status(401).send({'error' : 'please authenticate your self..'})
    }
    
}

