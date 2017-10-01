module.exports = {
    create: create
}

var db = require("./dynamoDbConnection")

function deleteTable(next) {
    var client = db.getDbClient();
    
    var params = {
        TableName : "Post"
    };
    
    client.deleteTable(params, function(err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
        next();
    });
}

function create() {
    var client = db.getDbClient();
    
    var params = {
        TableName : "Post",
        KeySchema: [       
            { AttributeName: "id", KeyType: "HASH"}
        ],
        AttributeDefinitions: [       
            { AttributeName: "id", AttributeType: "S" },
            { AttributeName: "status", AttributeType: "S" },
            { AttributeName: "date", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'statusAndDate',
                KeySchema: [
                    { AttributeName: "status", 'KeyType': "HASH"},
                    { AttributeName: "date", 'KeyType': "RANGE"}
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 10,
                    WriteCapacityUnits: 10
                }
            }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    };
    
    client.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}

deleteTable(function() {
    create();
});