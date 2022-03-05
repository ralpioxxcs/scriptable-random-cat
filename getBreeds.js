let axios = require('axios');
let fs = require('fs');

let config = {
  method: 'get',
  url: 'https://api.thecatapi.com/v1/breeds',
  headers: {
    'Content-Type': 'application/json'
  }
};

let breedIds = [];

axios(config)
  .then((res) => {
    const obj = res.data;

    obj.forEach(elem => {
      breedIds.push(elem.id);
    });

    let file = fs.createWriteStream('breeds.txt');
    breedIds.forEach(elem => { 
      file.write('\'' + elem + '\','); 
    });

    file.end();
    
  })
  .catch((err) => {
    console.log(err);
  });
