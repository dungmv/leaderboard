const { MongoClient, ObjectID } = require('mongodb');
const config = require('./config');

var test = async function() {
    const client = new MongoClient(config.db.uri, { useUnifiedTopology: true });
    let obStoreDataGame = {
        "5f552458db096a3ebd469155":[],//tlmn1
        "5f714415630b9b9ff8146f15":[],//tlmn2
        "5f714415630b9b9ff8146f17":[]
    }
    try {
        await client.connect();
        const database = client.db('leaderboards');
        const collection = database.collection('records');
        // const leaderboardId = new ObjectID(req.params.id);
        // console.log('req.query.friendList   ',req.query.friendList);
        let records = await collection.find({}).toArray();
        console.log(records.length);
        console.log(records[0]);
        for (let index = 0; index < records.length; index++) {
            let element = records[index];
            if(element.lbid =='5f552458db096a3ebd469155'){
                obStoreDataGame["5f552458db096a3ebd469155"].push(element);
            }else if(element.lbid =='5f714415630b9b9ff8146f15'){
                obStoreDataGame["5f714415630b9b9ff8146f15"].push(element);
            }else if(element.lbid =='5f714415630b9b9ff8146f17'){
                obStoreDataGame["5f714415630b9b9ff8146f17"].push(element);
            }
        }
        console.log('5f552458db096a3ebd469155    ',obStoreDataGame['5f552458db096a3ebd469155'].length);
        console.log('5f714415630b9b9ff8146f15    ',obStoreDataGame['5f714415630b9b9ff8146f15'].length);
        console.log('5f714415630b9b9ff8146f17    ',obStoreDataGame['5f714415630b9b9ff8146f17'].length);
        const fs = require('fs');
        fs.writeFile("UserData.json", JSON.stringify(obStoreDataGame), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 

        // res.json({ err: 0, msg: 'ok', entries: records });
    } catch (e) {

        console.log('errr ',e);
        // res.json({ err: 1, msg: errorFormat(e) });
    } finally {
        client.close();
    }

    
    // setTimeout(()=>{
    //     console.log('Start Clonet ');
    //     let time = 0;
    //     for (let key in obStoreDataGame) {
    //        setTimeout(()=>{
    //             console.log('start clone ',key);
    //             let array = obStoreDataGame[key];
    //             pushCopyUser(array);
    //        },time);
    //     }
        
    // },5000);
}

var pushCopyUser = async function(array){
    let USER = array.shift();
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
        { lbid: USER.lbid, user_id: USER.user_id },
        { $set: {score: USER.score, username: USER.name, photo:USER.photo, user_id: USER.user_id, updated_at: new Date()} },
        { upsert: true }
        );
        res.json({ err: 0, msg: 'ok' });
    } catch (e) {
        res.json({ err: 1, msg: errorFormat(e) });
    } finally {
        client.close();
        pushCopyUser
    }
};
test();