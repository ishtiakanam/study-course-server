
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors(
    // {
    //     origin: [
    //         'http://localhost:5173',
    //         'https://bangla-sheba-558d8.web.app',
    //         'https://bangla-sheba-558d8.firebaseapp.com'
    //     ]
    // }
));
app.use(express.json());

const uri = process.env.DB_URL
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        const teacherCollection = client.db('synergy').collection('classes');



        app.post('/class', async (req, res) => {
            const create = req.body;
            console.log({ create });
            const result = await teacherCollection.insertOne(create);
            console.log({ result });
            res.send(result);
        });

        app.get('/class', async (req, res) => {
            const result = await teacherCollection.find().toArray();
            console.log(result);
            res.send(result);
        })

        app.get('/class/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await teacherCollection.findOne(query)
            res.send(result)
        })

        app.patch('/class/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updatedBooking = req.body;
            console.log(updatedBooking);
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await teacherCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        })

        app.delete('/class/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await teacherCollection.deleteOne(query);
            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})