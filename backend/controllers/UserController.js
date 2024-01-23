const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Helpers
const createuserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');


module.exports = class UserController {

    static async register(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body;


        //Validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' });
            return;
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' });
            return;
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' });
            return;
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' });
            return;
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória' });
            return;
        }

        //Check confirm password
        if (confirmpassword !== password) {
            res.status(422).json({ message: 'As senhas não conferem' });
            return;
        }

        let userExists = await User.findOne({ email: email });

        if (userExists) {
            res.status(422).json({ message: 'Este e-mail já está em uso' });
            return;
        }

        //Create Passowrd
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        //const passwordHash = password; 

        //Create User
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        });


        try {
            //Save the new User
            const newUser = await user.save();

            //Create a Token for the new user
            await createuserToken(newUser, req, res);
        } catch (error) {
            res.status(500).json({ message: error })
        }



    }

    static async login(req, res) {
        const { email, password } = req.body;

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' });
            return;
        }

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' });
            return;
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(422).json({
                message: "Não há usuário com este e-mail"
            });

            return;
        }

        //Check password
        //const checkPassword = password == user.password 
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            res.status(422).json({
                message: "Senha inválida!"
            });

            return;
        }

        await createuserToken(user, req, res);

    }

    static async checkUser(req, res) {
        let currentUser;
        try {

            if (req.headers.authorization) {
                const token = getToken(req);
                const decoded = jwt.verify(token, 'secret');
                
                currentUser = await User.findById(decoded.id);
                console.log(token, currentUser);
                currentUser.password = undefined;
            }
            else {
                currentUser = null;
            }
        }
        catch {

            res.status(200).send({ message: "Usuário inválido." })
            return;

        }
        res.status(200).send(currentUser)

    }


    static async getUserById(req, res) {
        try {
            const id = req.params.id;
            const user = await User.findById(id).select("-password");

            if (!user) {
                res.status(422).json({
                    message: "Usuário não encontrado"
                })
                return;
            }

            res.status(200).json({ user });
        } catch (err) {

            res.status(422).json({
                message: err.message
            })
            return;
        }
    }


    static async editUser(req, res) {
        const { name, email, phone, password, confirmpassword } = req.body;

        //Check if User Exists
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (!user) {
            res.status(422).json({
                message: "Usuário não encontrado"
            })
            return;
        }

        if (req.file) {
            user.image = req.file.filename
        }


        //Validations
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' });
            return;
        }
        user.name = name;

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' });
            return;
        }

        //Check if email is already used
        const userExists = await User.findOne({ email: email });
        if (user.email != email && userExists) {
            res.status(422).json({
                message: "Este e-mail já está em uso!"
            })
            return;
        }

        user.email = email;


        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' });
            return;
        }

        user.phone = phone;

        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' });
            return;
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória' });
            return;
        }

        if (password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem' });
            return;
        } else if (password === confirmpassword && password != null) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            // const passwordHash = password
            
            user.password = passwordHash;
        }


        try {
            //Returns updated data
            await User.findByIdAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            );

            res.status(200).json({ message: "Usuário atualizado com sucesso!" });

        } catch (error) {
            res.status(500).json({ message: error });
            return;
        }


    }
}; 