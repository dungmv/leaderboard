const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const router = express.Router();
var AWS = require("aws-sdk");

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
          res.json({ err: 0, msg: 'ok', entries: data });
          
      }
  });
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
router.get('/getLeaderBoard/:gameId',async (req,res,next)=>{
  let gameId = req.params.gameId;
  let listFriend = req.body.ListFriend;
  let params  = {}; 
  if(!listFriend){

  }else{
    let obSearch = {};
    let arr = listFriend.split(',');
    arr.map((item,index)=>{
      let id = ":PlayerId"+(parseInt(index)+1);
      obSearch[id] = item;
    });
    // console.log('a ',Object.keys(obSearch).toString());
    // console.log('b ',obSearch);
    obSearch[':user'] = "userInstant";
    params['TableName'] = gameId;
    params["KeyConditionExpression"] = "PlayerId = :user";
    params['FilterExpression']= "PlayerId IN ("+Object.keys(obSearch).toString()+ ")";
    params['ExpressionAttributeValues'] = obSearch;
  }
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
