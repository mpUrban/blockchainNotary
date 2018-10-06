/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level'); 
const db = level('./chaindata'); //This will create or open the underlying LevelDB store.

//test good
function addBlock(key, value){ 
  return new Promise((resolve, reject) => { 
    db.put(key, value, (err) => {
       if (err) reject(err); 
    resolve(key, value); 
    console.log('Added block: ' + key)});
  });
}

//test good
function getBlock (key) { 
  return new Promise((resolve, reject) => { 
    db.get(key, (err, value) => { 
      if (err) return console.log('Invalid block height', err);
    resolve(JSON.parse(value));
  }); 
}); 
}

//test good
function getBlockHeight() { 
  return new Promise((resolve, reject) => { 
    let height = -1; 
    db.createReadStream()
    .on('data', (data) => { 
      height++; 
    })
    .on('error', (err) => { 
        reject(err); 
      })
    .on('close', () => { 
        resolve(height); 
      }); 
    }); 
  }
    
module.exports = {getBlock, getBlockHeight, addBlock};
