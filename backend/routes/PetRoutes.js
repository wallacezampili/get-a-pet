//Controller
const PetController = require('../controllers/PetController');

//Create router
const router = require('express').Router();

//Middlewares
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

//Create a pet
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create);

//Schedule Visit
router.patch('/schedule/:id', verifyToken, PetController.schedule);

//Conclude Adoption
router.patch('/conclude/:id', verifyToken, PetController.conclude)

//Get my pets
router.get('/mypets', verifyToken, PetController.getAllUserPets);

//Get all adoptions
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions);


//Get pet by id
router.get('/:id', PetController.getPetById);

//Delete by id
router.delete('/:id', verifyToken, PetController.deletePetById);

//Update by id
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet);



//Get all pets
router.get('/', PetController.getAll);



module.exports = router;