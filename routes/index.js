const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const config = require('../config');
const router = express.Router();
var cacheDb = {};
const errorFormat = (e) => {
  return e.message;
}

router.get('/', async (req, res, next) => {
  const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection('leaderboards');
    const cursor = collection.find({});
    const records = await cursor.toArray();
    res.json({ err: 0, msg: 'ok', entries: records });
  } catch(e) {
    res.json({ err: 1, msg: errorFormat(e) });
  } finally {
    client.close();
  }
});

router.post('/', async (req, res) => {
  const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection('leaderboards');
    await collection.insertOne({ name: req.body.name, created_at: new Date() });
    res.json({ err: 0, msg: 'ok' });
  } catch (e) {
    res.json({ err: 1, msg: errorFormat(e) });
  } finally {
    client.close();
  }
})

router.post('/:id', async (req, res, next) => {
  const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection(req.params.id);
    const leaderboardId = new ObjectID(req.params.id);
    const userId = req.body.userId;
    const score = parseInt(req.body.score);
    const name = req.body.name;
    const photo = req.body.photo;
    if(!cacheDb[req.params.id]) cacheDb[req.params.id] = [];
    cacheDb[req.params.id].push({
      lbid: leaderboardId,
      user_id: userId,
      score:score,
      username: name,
      photo: photo,
      user_id: userId,
      updated_at: new Date()
    });
    // await collection.updateOne(
    //   { lbid: leaderboardId, user_id: userId },
    //   { $set: {score, username: name, photo, user_id: userId, updated_at: new Date()} },
    //   { upsert: true }
    // );
    res.json({ err: 0, msg: 'ok' });
  } catch (e) {
    res.json({ err: 1, msg: errorFormat(e) });
  } finally {
    client.close();
  }
})

router.get('/:id', async (req, res, next) => {
  const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('leaderboards');
    const collection = database.collection(req.params.id);
    const leaderboardId = new ObjectID(req.params.id);
    const cursor = collection.find({ lbid: leaderboardId }).sort({score: -1}).limit(25);
    const records = await cursor.toArray();
    console.log(`Game   ${req.params.id} get leaderboard done!`);
    res.json({ err: 0, msg: 'ok', entries: records });
  } catch (e) {
    res.json({ err: 1, msg: errorFormat(e) });
  } finally {
    client.close();
  }
})
router.get('/getCacheDb', async (req, res, next) => {
  let records = cacheDb;
  res.json({ err: 0, msg: 'ok', entries: records });
 
})
module.exports = router;
