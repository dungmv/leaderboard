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
    let obStore = {
      lbid: leaderboardId,
      user_id: userId,
      score:score,
      username: name,
      photo: photo,
      user_id: userId,
      updated_at: new Date()
    }
    if(cacheDb[req.params.id].length == 0){
      cacheDb[req.params.id]. push(obStore);
      console.log('1');
    }else{
      let user = cacheDb[req.params.id].find(user=>user.user_id == obStore.user_id);
      if(!user) {
        cacheDb[req.params.id]. push(obStore);
        console.log('2');
      }else{
        console.log(obStore.user_id,'|',user.score,'|',obStore.score);
        user.score = obStore.score;
        console.log(' 3  ',obStore.user_id,' : ',user.score, ' new score ',obStore.score);  
      }
    }
    
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
  console.log('cacheDb   ',cacheDb);
  res.json({ err: 0, msg: 'ok', entries: cacheDb });
})
router.get('/saveDatauserToDb',async (req,res,next) =>{
  var check = async function(id){
      const client3 = new MongoClient(config.db.uri, { useUnifiedTopology: true }); 
      try {
          await client3.connect();
          const database = client3.db('leaderboards');
          const collection = database.collection(id);
          // const leaderboardId = new ObjectID(req.params.id);
          // console.log('req.query.friendList   ',req.query.friendList);
          let records = await collection.find({}).toArray();
          console.log('client3  ',id,' ----->  ',records.length);
          // res.json({ err: 0, msg: 'ok', entries: records });
      } catch (e) {
          console.log('errr ',e);
          // res.json({ err: 1, msg: errorFormat(e) });
      } finally {
          client3.close();
      }
  }
  var pushMany = async function(id,array,callBack){
      const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
      try {
          await client.connect();
          const database = client.db('leaderboards');
          const collection = database.collection(id);
          await collection.insertMany(array);
      } catch (e) {
      } finally {
          client.close();
          console.log('DONE USER LB ',id,' =>>> ',array.length);
          if(callBack) callBack();
      }
  }
  if(cacheDb){
    for (let key in cacheDb) {
        let element = object[key];
        pushMany(key,element,()=>{
          console.log('DONE   push many  ',key);
        })
    }
  }
  res.json({ err: 0, msg: 'ok' });
})
module.exports = router;
