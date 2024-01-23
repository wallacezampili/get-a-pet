//Import Model
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Pet = require('../models/Pet');
const ObjectId = require('mongoose').Types.ObjectId
module.exports = class PetController {

    static async create(req, res) {
        const { name, age, weight, color } = req.body;
        const available = true;

        //Images Upload
        const images = req.files

        //Validation
        if (!name) {
            return res.status(422).json({ message: "O nome é obrigatório" });

        }
        if (!age) {
            return res.status(422).json({ message: "A idade é obrigatória" });
        }
        if (!weight) {
            return res.status(422).json({ message: "O peso é obrigatório" });
        }
        if (!color) {
            return res.status(422).json({ message: "A cor é obrigatória" });
        }
        if (images.length === 0) {
            return res.status(422).json({ message: "A imagem é obrigatória" });
        }

        //Get pet ower
        const getToken = require('../helpers/get-token');
        const getUserByToken = require('../helpers/get-user-by-token');
        const token = getToken(req);
        const user = await getUserByToken(token);
        //Create Pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        });


        //Set images name
        images.map(image => {
            pet.images.push(image.filename)
        })

        try {

            //Save pet
            const newPet = await pet.save();

            res.status(201).json({
                message: "Pet cadastrado com sucesso",
                newPet
            })

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }


    static async getAll(req, res) {
        try {
            const pets = await Pet.find().sort('-createdAt');
            res.status(200).json({ pets });
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAllUserPets(req, res) {

        //Get user from token
        const token = getToken(req);
        const user = await getUserByToken(token);


        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');


        res.status(200).json({ pets });
    }


    static async getAllUserAdoptions(req, res) {
        //Get user from token
        const token = getToken(req)
        const user = await getUserByToken(token);


        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');


        res.status(200).json({ pets });
    }


    static async getPetById(req, res) {
        const id = req.params.id;
        if (!id) {
            res.status(422).json({ message: "O id é obrigatório" });
            return;
        }
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "O id é inválido" });
            return;
        }


        //Get Pet
        try {
            const pet = await Pet.findById(id);
            if (!pet) {
                res.status(404).json({ message: "Pet não encontrado" });
                return;
            }

            res.status(200).json({ pet });
        } catch (error) {
            res.status(500).json({ messsae: error })
        }

    }


    static async deletePetById(req, res) {
        const id = req.params.id;

        //Id Validation
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "Id inválido!" });
            return;
        }

        //Check if Pet Exists
        const pet = await Pet.findById(id);

        if (!pet) {
            res.status(422).json({ message: "Pet não encontrado" });
            return;
        }

        //Check if the pet is registered by the logged user
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user._id.toString() !== pet.user._id.toString()) {
            res.status(422).json({ message: "Usuário inválido!" });
            return;
        }


        await Pet.findByIdAndDelete(id);
        res.status(200).json({ message: "Pet deletado com sucesso!", pet: pet });

    }


    static async updatePet(req, res) {
        const id = req.params.id;
        const { name, age, weight, color, available } = req.body;

        //Images Upload
        const images = req.files
        console.log(images)
        const updatedData = {};

        //Id Validation
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "Id inválido!" });
            return;
        }


        //Validation
        if (!name) {
            return res.status(422).json({ message: "O nome é obrigatório" });
        }else{
            updatedData.name = name;
        }
        if (!age) {
            return res.status(422).json({ message: "A idade é obrigatória" });
        }else{
            updatedData.age = age;
        }
        if (!weight) {
            return res.status(422).json({ message: "O peso é obrigatório" });
        }else{
            updatedData.weight = weight;
        }
        if (!color) {
            return res.status(422).json({ message: "A cor é obrigatória" });
        }else{
            updatedData.color = color;
        }
        if (images.length > 0) {
            updatedData.images = [];
            
            images.map(img => {
                console.log(img);
                updatedData.images.push(img.filename);
            })

        }

        //Check if Pet Exists
        const pet = await Pet.findById(id);

        if (!pet) {
            res.status(422).json({ message: "Pet não encontrado" });
            return;
        }

        //Check if the pet is registered by the logged user
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user._id.toString() !== pet.user._id.toString()) {
            res.status(422).json({ message: "Usuário inválido!" });
            return;
        }

        console.log(updatedData);
        await Pet.findByIdAndUpdate(id, updatedData);

        res.status(200).json({message: "Pet atualizado com sucesso!", pet: updatedData});


    }

    static async schedule(req, res)
    {
        const id = req.params.id;

        //Check if Pet Exists
        const pet = await Pet.findById(id);

        if (!pet) {
            res.status(422).json({ message: "Pet não encontrado" });
            return;
        }

        //Check if the pet is registered by the logged user
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user._id.equals(pet.user._id)) {
            res.status(422).json({ message: "Você não pode agendar uma visita para seu próprio pet!" });
            return;
        }

        //Check if an visit is already scheduled
        if(pet.adopter)
        {
            if(pet.adopter._id.equals(user._id))
            {
                res.status(422).json({ message: "Você já agendou uma visita para este pet!" });
                return;
            }
        }


        //Add user to pet
        pet.adopter = {
            _id: user._id,
            image: user.image,
            name: user.name
        }

        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({message: `A visita foi agendada com sucesso! Entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}!`});




    }

    static async conclude(req, res)
    {
        const id = req.params.id;

        //Check if Pet Exists
        const pet = await Pet.findById(id);

        if (!pet) {
            res.status(422).json({ message: "Pet não encontrado" });
            return;
        }

        //Check if the pet is registered by the logged user
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (user._id.toString() !== pet.user._id.toString()) {
            res.status(422).json({ message: "Usuário inválido!" });
            return;
        }

        pet.available = false;
        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({message: `Parabéns, ${pet.name} foi adotado com sucesso!`})
    }
}