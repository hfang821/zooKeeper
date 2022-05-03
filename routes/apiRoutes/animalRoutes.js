//use router to declare routes in any file.
const router = require('express').Router();
const {filterByQuery,findById,createNewAnimal,validateAnimal}=require('../../lib/animals');
const {animals} = require('../../data/animals');

router.get('/animals',(req, res) => {
    let results = animals;
    //req.query is multifaceted(combining multiple parameters)
    if(req.query){
        results = filterByQuery(req.query,results);
    }
    console.log(req.query)
    res.json(results);
});

router.get('./animals/:id',(req, res)=>{
    //not using filterByQuery here because we know that we are returning a single animal and id is unique. && no query on a single animal.
    //req.param is specific to a single property
    const result = findById(req.params.id,animals);
    if(result){
        res.json(result);
    } else {
        res.send(404);
    }
});

//two ways to post data:
//1. The developer team populates the server with the data manually, because they have access to the server code.
//2. Users of the app populate the server with data by sending data from the client side of the application to the server.
router.post('/animals',(req,res)=>{
    //req.body is where our incoming content will be
    //set id based on what the next index of the array will be (but only will work if we dont remove any data from animals.json)
    req.body.id = animals.length.toString();

    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted');
    } else {
        //add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body,animals)
        res.json(animal);
    }
});

module.exports = router;