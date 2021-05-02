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
        // res.json({ err: 0, msg: 'ok', entries: records });
    } catch (e) {

        console.log('errr ',e);
        // res.json({ err: 1, msg: errorFormat(e) });
    } finally {
        client.close();
    }
}
test();