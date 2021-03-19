const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const config = require('../config');
const router = express.Router();
var AWS = require("aws-sdk");

const errorFormat = (e) => {
  return e.message;
}
router.post('/:id', async (req, res, next) => {
  const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
  let idCollection = `Instant_`+req.params.id;
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection(idCollection);
    const leaderboardId = new ObjectID(req.params.id);
    const userId = req.body.userId;
    const score = parseInt(req.body.score);
    const name = req.body.name;
    const photo = req.body.photo;
    await collection.updateOne(
    // await collection.insertOne(
      { lbid: leaderboardId, user_id: userId },
      { $set: {score, username: name, photo, user_id: userId, updated_at: new Date()} },
      { upsert: true }
    );
    res.json({ err: 0, msg: 'ok' });
  } catch (e) {
    res.json({ err: 1, msg: errorFormat(e) });
  } finally {
    client.close();
  }
})
router.get('/:id',async(req,res,next)=>{
  const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
  let idCollection = `Instant_`+req.params.id;
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection(idCollection);
    const leaderboardId = new ObjectID(req.params.id);
    const friendList = req.body.friendList;
    const records = null;
    if(friendList && friendList.length != 0){
      records = await collection.find({ lbid: leaderboardId , user_id: { $in: friendList } }).toArray();
    }else{
      records = await collection.find({ lbid: leaderboardId }).sort({score: -1}).limit(25);
    }
    res.json({ err: 0, msg: 'ok', entries: records });
} catch (e) {
    res.json({ err: 1, msg: errorFormat(e) });
    if (callback) callback([]);
} finally {
    client.close();
}
});

module.exports = router;
