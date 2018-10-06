///////////////////////////////////////
//test message signature functions

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const Response = require('./responseClass');

let addressTest = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
let signatureTest = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
let messageTest = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

let requestTimeStamp = new Date().getTime().toString().slice(0, -3);

console.log(bitcoinMessage.verify(messageTest, addressTest, signatureTest));
//console.log('timestamp = ' + requestTimeStamp);
//console.log('----------------------------');

////////////////////////////////////////////////////////////////////
//test creating a response based on responseClass


resp1 = new Response;
resp1.address = addressTest;
resp1.requestTimeStamp = requestTimeStamp;
resp1.message = resp1.address + ':' + resp1.requestTimeStamp + ':starRegistry';

//console.log(resp1);


////////////////////////////////////////////////////////////////////
//test creating mempool - pushing each request to an array


// create mempool

console.log('----------------------------');

mempool = [];
mempool.push(resp1);

console.log(JSON.parse(JSON.stringify(mempool[0])));

console.log('----------------------------');

let addressTest2 = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3ZZZ'

resp2 = new Response;
resp2.address = addressTest2;
resp2.requestTimeStamp = '1538785655';
resp2.message = resp2.address + ':' + resp2.requestTimeStamp + ':starRegistry';

mempool.push(resp2);

console.log(JSON.parse(JSON.stringify(mempool[1])));

console.log(mempool.length);

console.log(resp2.requestTimeStamp)


////////////////////////////////////////////////////////////////////
//test checking mempool for new tx with address already in mempool

console.log('----------------------------');

// let mempoolSearch = mempool.find(Response => {
//     return Response.address === addressTest2
// })
//console.log(mempoolSearch.address);

console.log(mempool.findIndex(f => f.address === addressTest));

//findIndex returns '-1' if not present
console.log(mempool.findIndex(f => f.address === 'fakeAddress'));

//findIndex returns >= 0, then it exists




////////////////////////////////////////////////////////////////////
//need to check current time against time of matched address 
//resp2 or mempool[1] has a hardcoded old time

console.log('----------------------------');
let nowTime = new Date().getTime().toString().slice(0, -3);
console.log(nowTime);
console.log(resp2.requestTimeStamp);
let timeDiff = nowTime - resp2.requestTimeStamp;
console.log(timeDiff);

if (timeDiff >= 300) {
    console.log('time expired');
}

if (mempool.findIndex(f => f.address === addressTest) >= 0) {
    console.log('address found');
}

if (mempool.findIndex(f => f.address === 'fakeShit') === -1) {
    console.log('address not found');
}





////////////////////////////////////////////////////////////////////
//
//need to retrieve resp.requestTimeStamp property from index

console.log('----------------------------');

let reqIdx = mempool.findIndex(f => f.address === addressTest2);
console.log('index is: ' + reqIdx);

console.log('retrieved timestamp is: ' + mempool[1].requestTimeStamp);

mempool.splice(reqIdx);
console.log(mempool[reqIdx]);


////////////////////////////////////////////////////////////////////
//
//test signing integration

console.log('----------------------------');

console.log('T/F of signature validation: ' + bitcoinMessage.verify(messageTest, addressTest, signatureTest));

//let signatureTest = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
let signatureTestFail = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykZZZZ'

console.log('T/F of signature validation: ' + bitcoinMessage.verify(messageTest, addressTest, signatureTestFail));