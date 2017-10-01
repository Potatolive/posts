'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var dbPost = require('../helpers/dbPost')
/*
Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  create_post: create_post,
  get_post: get_post,  
  update_post: update_post,
  delete_post: delete_post,
  list_post: list_post
};

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function create_post(req, res) {
  var post = req.body;

  dbPost.create(
    post, 
    function(data) {
      console.log('Return: ' + JSON.stringify(data));
      res.send(data);
    }, function(error) {
      res.status(500).json({'message': error});
    }
  );
}

function get_post(req, res) {
  var id = req.swagger.params.id.value || 'unknown';
  console.log('Get: ' + id);
  try {
    dbPost.get(id, function(data) {
      if(data) res.json(data);
      else res.status(404).json({'message': 'Post not found!'});
    }, function(error) {
      console.log(error);
      res.status(500).json({'message': 'error'});
    });
  } catch(e) {
    console.log(e);
  }
}

function update_post(req, res) {
  var id = req.swagger.params.id.value || 'unknown';
  var post = req.body;

  dbPost.put(id, post, function(data) {
    console.log(data);
    res.json({'message': 'Successfully updated!'});
  }, function(error) {
    res.status(500).json({'message': error});
  });
}

function delete_post(req, res) {
  var id = req.swagger.params.id.value || 'unknown';
  try {
    console.log(id);
    dbPost.delete(id, function(data){
      console.log(data);
      res.json({'message': 'Deleted Sucessfully!'});
    }, function(error) {
      console.log(error);
      res.json({'message': error});
    });
  } catch (e) {
    console.log(e);
  }
}

function list_post(req, res) {
  var date = req.swagger.params.date.value || 'unknown';
  var status = req.swagger.params.status.value || 'unknown';
  dbPost.list(date, status, function(data){
    res.send(data);
  }, function(error) {
    res.status(500).json({'message': error});
  });
}