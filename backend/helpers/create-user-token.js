const jwt = require('jsonwebtoken');



const createuserToken = async (user, req, res) => {

    //Create token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "secret");

    //Send Token
    res.status(200).json({
        message: "Você está autenticado",
        token: token,
        userId: user._id
    })


}

module.exports = createuserToken;