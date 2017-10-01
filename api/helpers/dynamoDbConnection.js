const AWS = require('aws-sdk'); //Ensure Lambda timeout is set more than 10 seconds as initial load of aws-sdk takes time
var https = require('https')

module.exports = {
    getDbClient: getDbClient,
    getDocumentClient: getDocumentClient
};

function getDbClient() {
    var config = {
        "region": process.env.AWS_DEFAULT_REGION,
        'endpoint': 'http://localhost:8000'
    };
    
    if(process.env.NODE_ENV != 'development') {
        
        config = {
            "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
            "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
            "endpoint": 'https://dynamodb.' + process.env.AWS_DEFAULT_REGION + '.amazonaws.com',
        }
        console.log(
            'Hitting proudction dynamodb instance! '
        )

        if(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
            console.log('Config: ' + process.env.AWS_ACCESS_KEY_ID.length + ' ' + process.env.AWS_SECRET_ACCESS_KEY.length);
        } else {
            console.log('Config not set ....');
        }
    } else {
        console.log('Hitting local dynamodb instance!')
    } 

    var dynamoDb = new AWS.DynamoDB({
        httpOptions: { 
            agent: new https.Agent({
                rejectUnauthorized: true,
                keepAlive: true, 
                ciphers: 'ALL', 
                secureProtocol: 'TLSv1_method' 
            })
        }
    });
    
    return dynamoDb;
}

function getDocumentClient() {
    return new AWS.DynamoDB.DocumentClient({service: getDbClient()})
}