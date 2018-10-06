const Blockchain = require('./blockchainClass');
const Block = require('./blockClass');
const leveldb = require('./levelFunctions');

let blockchain = new Blockchain();


// console.log(blockchain.getBlockHeight()); //promise pending



// let testHeight = blockchain.getBlockHeight();
// testHeight.then(function(result) {
//     console.log('Block height: ' + result);
// })


//this chunk will add blocks to the chain while validating

// (function theLoop(i) {
//     setTimeout(function () {
//         let blockTest = new Block("Test Block - " + (i + 1));
//         blockchain.addBlock(blockTest).then((result) => {
//             console.log(result);
//             console.log('----------------------------');
//             i++;
//             if (i < 10) theLoop(i);
//         });
//         let height = blockchain.getBlockHeight();
//         height.then(function (result) {
//             console.log('Block height: ' + result);
//             blockchain.validateBlock(result);
//         })
//     }, 1000);
// })(0);


//this chunk will replace block 2 with an invalid block for testing 

// blockchain.getBlock(2).then((block) => {     // where bc is a Blockchain instance and you've added at least 2 blocks
//     block.body = "error";
//     leveldb.addBlock(2, JSON.stringify(block));
// })



blockchain.validateChain();
