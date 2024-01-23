const jwt = require('jsonwebtoken');

const User = require('../models/User');


//Get user By jwt Token
const getUserByToken = async (token) => {

    if(!token)
    {
        return res.status(401).json({message: "Acesso Negado!"});
    }

    const decoded = jwt.verify(token, 'secret');
   
    const userid = decoded.id;

    const user = await User.findById(userid);
    
    return user;
}


module.exports = getUserByToken;