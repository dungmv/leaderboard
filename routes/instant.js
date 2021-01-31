const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const router = express.Router();
var AWS = require("aws-sdk");

let docClient = new AWS.DynamoDB.DocumentClient({
  region: "ap-southeast-1",
  accessKeyId: "AKIAZEVXB3T77TTEXA5N",
  secretAccessKey: "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",
  endpoint: "dynamodb.ap-southeast-1.amazonaws.com"
});
const errorFormat = (e) => {
  return e.message;
}
router.post('/:gameId',async (req, res, next)=>{
  let timeUpdate = new Date();
  let gameId = req.params.gameId;
  let playerId = req.body.PlayerId; 
  let point =  req.body.Point;
  var params = {
      TableName:gameId,
      Key:{
          "PlayerId": playerId
      },
      UpdateExpression: "set Point = :p,TimeAddPoint = :t",
      ExpressionAttributeValues:{
          ":p":point,
          ":t":timeUpdate.getTime()
      },
      ReturnValues:"UPDATED_NEW"
  };
  
  await docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
          res.json({ err: 1, msg: err });
      } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          res.json({ err: 0, msg: 'ok', entries: records });
          
      }
  });
});
router.get('/:gameId',async (req, res, next)=>{
  let gameId = req.params.gameId;
  let isGlobal = req.body.IsGlobal;

});
router.get('/getBestScore/:gameId',async (req, res, next)=>{
  let playerId = req.query.PlayerId;
  let gameId = req.params.gameId;
  var params = {
    TableName : gameId,
    KeyConditionExpression: "#PlayerId = :playid",
    ExpressionAttributeNames:{
        "#PlayerId": "PlayerId"
    },
    ExpressionAttributeValues: {
        ":playid": playerId
    }
  };

  docClient.query(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          res.json({ err: 1, msg: err });
      } else {
          console.log("Query succeeded.");
          res.json({ err: 0, msg: 'ok', response: data });
      }
  });  
});



module.exports = router;
