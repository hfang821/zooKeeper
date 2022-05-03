//dependencies
const fs = require('fs');
const path = require('path');

function filterByQuery(query,zookeepers){
    let filteredResults = zookeepers;

    if(query.age){
        filteredResults = filteredResults.filter(
            //since our form data will be coming in as strings, and our JSON is storing
            //age as a number, we must convert the query string to a number to 
            //perform a comparison
            (zookeeper)=> zookeeper.age ===Number(query.age)
        );
        }
    if(query.favoriteAnimal) {
        filteredResults = filteredResults.filter(
            (zookeeper)=> zookeeper.favoriteAnimal === query.favoriteAnimal);
    }
    if(query.name){
        filteredResults = filteredResults.filter(
            (zookeeper)=> zookeeper.name === query.name);
    }
    //return the filtered results.
    return filteredResults;
} 

function findById(id,zookeepers) {
    const result = zookeepers.filter((zookeeper) => zookeeper.id === id)[0];
    return result;
}

function createNewZookeeper(body,zookeepers) {
    const zookeeper = body;
    zookeepers.push(zookeeper);

    fs.writeFileSync(
        path.join(__dirname,'../data/zookeepers.json'),
        //null means we dont want to edit any of our existing data
        //2 means we want to create white space between our values to make it more readable.
        JSON.stringify({zookeepers}, null, 2)
    );
    //return finished code to post route for response
    return zookeeper;
}

function validateZookeeper(zookeeper) {
    if (!zookeeper.name || typeof zookeeper.name !== "string") {
      return false;
    }
    if (!zookeeper.age || typeof zookeeper.age !== "number") {
      return false;
    }
    if (
      !zookeeper.favoriteAnimal ||
      typeof zookeeper.favoriteAnimal !== "string"
    ) {
      return false;
    }
    return true;
  }

module.exports = {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper
};