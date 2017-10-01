var db = require("./dynamoDbConnection");
var uuid = require('uuid');

module.exports = {
    list: list,
    create: create,
    get: get,
    put: put,
    delete: deletePost
}

function list(date, status, success, error) {
    var params = {
        TableName: "Post",
        FilterExpression: "#st = :status and #dt = :date",
        ExpressionAttributeNames: {
            "#st": "status",
            "#dt": "date"
        },
        ExpressionAttributeValues: {
             ":status": status,
             ":date": date 
        }
    };

    var docClient = db.getDocumentClient();

    docClient.scan(params, function(err, data) {
        if(err) {
            console.log(err);
            error("Error listing post!")
        } else {
            console.log(data.Items);
            success(data.Items);
        }
    });
}

function create(post, success, error) {
        post.id = uuid.v4(); //Random unique identifier
    
        console.log(post);
    
        var params = {
            TableName: "Post",
            Item: post
        }
    
        var docClient = db.getDocumentClient();
    
        docClient.put(params, function(err, data) {
            if(err) {
                console.log(err);
                error("Error creating post!");    
            }
            else {
                console.log(data);
                success(post);
            }
        });
    }


function put(id, post, success, error) {
    var params = {
        TableName: "Post",
        Key: {"id": id},
        Item: post
    };

    var docClient = db.getDocumentClient();

    docClient.put(params, function(err, data) {
        if(err) {
            console.log(err);
            error("Error updating post!")
        } else {
            console.log(data);
            success("Successfully updated the post!");
        }
    });
}

function get(id, success, error) {
    var params = {
        TableName: "Post",
        Key: {"id": id}
    }

    var docClient = db.getDocumentClient();

    docClient.get(params, function(err, data) {
        if(err) {
            console.log(err);
            error("Error creating post!");    
        }
        else {
            console.log(data);
            success(data.Item);
        }
    });
}

function deletePost(id, success, error) {
    var params = {
        TableName: "Post",
        Key: {"id": id}
    }

    var docClient = db.getDocumentClient();

    docClient.delete(params, function(err, data) {
        if(err) {
            console.log(err);
            error("Error creating post!");    
        }
        else {
            console.log(data);
            success('Successfully deleted the post!');
        }
    });
}

