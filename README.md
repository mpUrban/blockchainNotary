# js Blockchain Star Registry

## Requirements:

* Node.js installed (v8 LTS)
* Web browser
* Terminal (such as Git Bash)
* [Postman](https://www.getpostman.com/) (for testing)
* Bitcoin wallet (non-SegWit) such as [Electrum](https://electrum.org/#download)

## How to run locally:

After downloading this repo, start a terminal session, navigate to the directory of the downloaded repo, and run the following command:

```
node app.js
```

The web API is configured to run on port 8000, so open a web browser tab and navigate to: [localhost:8000](http://localhost:8000)


## Files:

app.js - web API app using the express.js framework <br>
blockClass.js - block class module<br>
blockchainClass.js - blockchain class module<br>
levelFunctions.js - contains all functions using levelDB <br>
notary.postman_collection.json - library of API tests for use with Postman
privateBlockchain.js - contains loop to add blocks, corrupt blocks, and test <br>
responseClass.js - class module for requestValidation API endpoint response <br>

## Folders:

chainData - contains the current chain data, 0 - genesis 1-3 are stars <br> 
chaindata_allGood - contains a set of 10 valid blocks, no star object in data body <br>
chaindata_B2inv - contains 10 blocks where block 2 is invalid, no star object in data body <br>

## Dependencies:

From the project directory, run below command to install & update project dependencies through packages.json.
```
npm install <packagename> --save
```

* LevelDB (level)
* crypto-js
* express.js
* http
* path
* body-parser
* bitcoinjs-message
* bitcoinjs-lib

## Test blockchain data

In the chaindata folder, the chain used for testing contains a genesis block without a registered star, and 3 blocks with sample stars registered.  Blocks 1 & 3 were registered to the same public address.  


## API testing 

Since a front-end web UI does not exist yet, an API tester is used in place.  Postman & Curl are two options.  For development of this app, postman is used.  

### GET testing, view the genesis block
With server running, navigate to [localhost:8000/block/0](http://localhost:8000/block/0)

### POST testing

For testing of adding blocks through http POST, the application Postman is used.  

*Example of testing Postman:*
![alt text][postman]

[postman]: https://github.com/mpUrban/privateBlockchainWithWebAPI/blob/master/postman_POSTtest1.PNG "Postman test example"

### Signing a message via Electrum Wallet

Navigate to the address tab, right-click on the address used to submit for registration, and select 'Sign/verify Message.'  

*Example of signing with Electrum:*
![alt][signing]

[signing]: https://github.com/mpUrban/blockchainNotary/blob/step-3/electrum_signing.PNG "Postman test example"