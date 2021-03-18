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
  console.log(req.params);
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection(`Instant_${req.params.id}`);
    const leaderboardId = new ObjectID(req.params.id);
    const userId = req.body.userId;
    const score = parseInt(req.body.score);
    const name = req.body.name;
    const photo = req.body.photo;
    await collection.updateOne(
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

  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection(`Instant_${req.params.id}`);
    const leaderboardId = new ObjectID(req.params.id);
    let friendList = req.body.friendList;
    let records = await collection.find({ lbid: leaderboardId , user_id: { $in: friendList } }).toArray();
    res.json({ err: 0, msg: 'ok', entries: records });
} catch (e) {
    consores.json({ err: 1, msg: errorFormat(e) });
    if (callback) callback([]);
} finally {
    client.close();
}
});
router.get('/:id', async (req, res, next) => {
  const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection(`Instant_${req.params.id}`);
    const leaderboardId = new ObjectID(req.params.id);
    const cursor = collection.find({ lbid: leaderboardId }).sort({score: -1}).limit(25);
    const records = await cursor.toArray();
    res.json({ err: 0, msg: 'ok', entries: records });
  } catch (e) {
    res.json({ err: 1, msg: errorFormat(e) });
  } finally {
    client.close();
  }
})

module.exports = router;
