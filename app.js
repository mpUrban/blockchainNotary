
// link for non-Electrum digital signing
//https://medium.com/@alexpanas/udacity-blockchain-nanodegree-using-node-js-to-verify-digital-signitures-4c44fbe956e0

const express = require('express');
const app = express();
const port = 8000;

const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');

const Blockchain = require('./blockchainClass');
const Block = require('./blockClass');

const Response = require('./responseClass');

const validationWindow = 300; //5 minutes per project requirements (300s)

const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

// http://expressjs.com/en/guide/writing-middleware.html


// Syntax
// app.get('/', (req, res) => res.send('Hello World!'))
// '/' is the path on host
// req - client request
// res - server response


let blockchain = new Blockchain;


app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/home.html')));

app.get('/block/:id', async (req, res) => {
    const blockRes = await blockchain.getBlock(req.params.id);
    if (blockRes) {
        res.send(blockRes) // server response 
    } else {
        res.status(404).send("Block Not Found")
    }
});

//body parser allows form data to be available in req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/block', async (req, res) => {
    console.log('----------------------------');
    console.log('Adding body data of: ' + (req.body.data));
    if (!req.body.data) {
        res.status(400).json({
            "status": 400,
            message: "Body data must not be empty"
        })
    }
    else {
        await blockchain.addBlock(new Block(req.body.data));
        const height = await blockchain.getBlockHeight();
        const response = await blockchain.getBlock(height);
        res.send(response);
    }
});




mempool = [];

app.post('/requestValidation', async (req, res) => {
    if (!req.body.address) {
        res.status(400).json({
            "status": 400,
            message: "Address must not be empty"
        })
        console.log('----------------------------');
        console.log('Empty address request made.');
    }
    else {
        let nowTime = new Date().getTime().toString().slice(0, -3);

        //is this redundant to repackage req.body into a new object?
        resp = new Response;
        resp.validationWindow = validationWindow;
        resp.address = req.body.address;
        resp.requestTimeStamp = nowTime;
        resp.message = resp.address + ':' + resp.requestTimeStamp + ':starRegistry';
        
        if (mempool.findIndex(f => f.address === req.body.address) === -1) {
            console.log('----------------------------');
            //console.log(mempool.findIndex(f => f.address === req.body.address));
            console.log('Address received: ' + (req.body.address));
            console.log('Request will only be valid for 5 minutes.');
            console.log('Please validate at */message-signature/validate');
            console.log('Mempool length is: ' + mempool.length);
            console.log('');
            mempool.push(resp);
        } else if (mempool.findIndex(f => f.address === req.body.address) >= 0) {
            console.log('----------------------------');
            let reqIdx = mempool.findIndex(f => f.address === req.body.address);
            let reqTimeStamp = mempool[reqIdx].requestTimeStamp;
            let timeDiff = nowTime - reqTimeStamp;
            console.log('Address received: ' + (req.body.address));
            console.log('current timestamp is: ' + nowTime);
            console.log('retrieved timestamp is: ' + reqTimeStamp);
            console.log('timeDiff is: ' + timeDiff);
            if (timeDiff <= validationWindow) {
                console.log('............................');
                console.log('Request already exists...');
                console.log('Please validate at */message-signature/validate');
                console.log('');
            } else if (timeDiff > validationWindow) {
                console.log('............................');
                console.log('Expired request exists, new request generated.');
                console.log('Address received: ' + (req.body.address));
                console.log('Request will only be valid for 5 minutes.');
                console.log('Please validate at */message-signature/validate');
                console.log('Mempool length is: ' + mempool.length);
                console.log('');
                //remove expired entry before push
                mempool.splice(reqIdx);
                mempool.push(resp);
            }
        }

        res.send(resp);

    }
});


///////////////////////////////////////////////////

//TEST message set from standard electrum wallet
let addressElecStd = '1KwJmv6KqMNwqZMqd9ZdVYJH9VZ1vnctFt'
let messageElecStd = '1KwJmv6KqMNwqZMqd9ZdVYJH9VZ1vnctFt:1532330740:starRegistry'
let signatureElecStd = 'H0dFqcBJhBpRINpCHirDizr4eCfQiZyj63qC/g1kBQPLUETMb0qzmhwm48IakALeo0To74SqLERtRGCNq9gWCsw='



app.post('/message-signature/validate', async (req, res) => {
    console.log('----------------------------');
    if (!req.body.address || !req.body.signature) {
        res.status(400).json({
            "status": 400,
            message: "Address & signature data must not be empty"
        })
    }
    else {
        //don't know how to build class constructor for this response object
        //for testing, be sure to first send a request to */requestValidation
        //
        //console.log(req.body.address);
        //console.log(req.body.signature);
        
        let reqIdx2 = mempool.findIndex(f => f.address === req.body.address);
        //console.log(reqIdx2);
        let reqTimeStamp2 = mempool[reqIdx2].requestTimeStamp;
        //console.log(mempool[reqIdx2].requestTimeStamp);
        //console.log(reqTimeStamp2);

        ///////////////////////////  testing, switch later
        // since timestamp is part of message, need to hotwire in the matching timestamp

        let message2 = mempool[reqIdx2].message;
        //let message2 = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'
        ///////////////////////////  testing, switch later
        ///////////////////////////  testing, switch later

        let nowTime2 = new Date().getTime().toString().slice(0, -3)
        console.log('Timestamp of Signature Receipt: ' + nowTime2);
        let timeDiff2 = nowTime2 - reqTimeStamp2;
        
        let sigValidity = bitcoinMessage.verify(message2, req.body.address, req.body.signature);;
        if (!sigValidity) {
            console.log('Invalid signature');
        } else if (sigValidity) {
            if (timeDiff2 <= validationWindow) {
                console.log("Ownership of blockchain address is verified");
            } else {
                sigValidity = false;
                console.log('Verification time window has expired, please resubmit request');
                console.log('Signature matches request address');
            }
        }

        //console.log('sig validity flag: '+ sigValidity);
  
        let status = {
            address: req.body.address,
            requestTimeStamp: reqTimeStamp2,
            message: mempool[reqIdx2].message,
            validationWindow: timeDiff2,
            messageSignature: "valid"
        }
        
        let resp2 = {
            registerStar: true,
            status: status
        }

        res.send(resp2);
    }
});








// redirect to home - needs to be final redirect
// app.get('*', function (req, res) {
//     res.redirect('/');
// });

app.listen(port,
    () => console.log(`app listening on port ${port}!`));
