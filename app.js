
//git remote add origin https://github.com/mpUrban/privateBlockchainWithWebAPI.git


//TODO
//1. undo hard coding of timeout limit

const express = require('express');
const app = express();
const port = 8000;

const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');

const Blockchain = require('./blockchainClass');
const Block = require('./blockClass');

const Response = require('./responseClass');
const validationWindow = 300; //5 minutes per project requirements

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
        res.send(blockRes)
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

        resp = new Response;
        resp.validationWindow = validationWindow;
        resp.address = req.body.address;
        resp.requestTimeStamp = nowTime;
        resp.message = resp.address + ':' + resp.requestTimeStamp + ':starRegistry';
        
        let testWindow = 10;

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
            if (timeDiff <= testWindow) {
                console.log('............................');
                console.log('Request already exists...');
                console.log('Please validate at */message-signature/validate');
                console.log('');
            } else if (timeDiff > testWindow) {
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







// redirect to home - needs to be final redirect
// app.get('*', function (req, res) {
//     res.redirect('/');
// });

app.listen(port,
    () => console.log(`app listening on port ${port}!`));
