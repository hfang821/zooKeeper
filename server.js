const fs = require('fs');
const path = require('path');
const {animals} = require('./data/animals.json');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
//parse incoming string or array data (extend:true means tell our server may be sub-array data nested so need to look deep)
app.use(express.urlencoded({ extended:true}));
//parse incoming JSON data into the req.body javascript object
app.use(express.json());

function filterByQuery(query,animalsArray){
    let personalityTraitsArray = [];
    //We save the animalsArray as filtered Results here
    let filteredResults = animalsArray;
    if(query.personalityTraits){
        //Save personalityTraits as a dedicated array.
        //If personalityTraits is a string (not an array), place it into a new array and save.
        if(typeof query.personalityTraits === 'string'){ 
            personalityTraitsArray = [query.personalityTraits];
        }else{
            personalityTraitsArray = query.personalityTraits;
        }
    //Loop through each trait in the personalityTraits Array.
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
        filteredResults =filteredResults.filter(
            //indexOf === -1 means no match found
            animals => animals.personalityTraits.indexOf(trait) !== -1
        );
    });
  }
    if(query.diet) {
        filteredResults = filteredResults.filter(animals => animals.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animals => animals.species === query.species);
    }
    if(query.name){
        filteredResults = filteredResults.filter(animals =>animals.name === query.name);
    }
    //return the filtered results.
    return filteredResults;
} 

function findById(id,animalsArray) {
    const result = animalsArray.filter(animals => animals.id === id)[0];
    return result;
}

function createNewAnimal(body,animalsArray) {
    console.log(body);
    //function's main code here
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        //the path will be from the root of whatever machine this code runs on to the location of our animals.json file.
        path.join(__dirname,'./data/animals.json'),
        //null means we dont want to edit any of our exising data
        //2 means we want to create white space between our values to make it more readable.
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    //return finished code to post route for response
    return animal;
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name !=='string'){
        return false;
    }
    if(!animal.species || typeof animal.species !=='string'){
        return false;
    }
    if(!animal.diet || typeof animal.diet !=='string'){
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true;
}

app.get('/api/animals',(req, res) => {
    let results = animals;
    //req.query is multifaceted(combining multiple parameters)
    if(req.query){
        results = filterByQuery(req.query,results);
    }
    console.log(req.query)
    res.json(results);
});

app.get('./api/animals/:id',(req, res)=>{
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
app.post('/api/animals',(req,res)=>{
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


app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
});