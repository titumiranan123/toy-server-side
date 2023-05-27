const express = require('express')
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send("Car server is running")
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhyrmpz.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        const ToyCollection = client.db('AllToyCollection').collection('toyCollection');

        app.get('/alltoys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { seller_email: req.query.email };
            }
            const cursor = ToyCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/alltoys', async (req, res) => {
            const cursor = ToyCollection.find();
            const result = await cursor.toArray()
            // console.log(result)
            res.send(result)
        })

        app.get('/sport-car', async (req, res) => {
            const query = { sub_category: "Sport Car" }

            const cursor = ToyCollection.find(query);
            const result = await cursor.toArray()
            console.log(result)
            res.send(result)

        })
        app.get('/regular-car', async (req, res) => {
            const query = { sub_category: "Regular Car" }
            const cursor = ToyCollection.find(query);
            const result = await cursor.toArray()
            console.log(result)
            res.send(result)

        })
        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const cursor = ToyCollection.find(query);
            const result = await cursor.toArray()
            // console.log(result)
            res.send(result)
        })


        app.get('/police-car', async (req, res) => {
            const query = { sub_category: "Police Car" }
            const cursor = ToyCollection.find(query);
            const result = await cursor.toArray()

            res.send(result)

        })
        app.post('/alltoys', async (req, res) => {
            const data = req.body
            const result = await ToyCollection.insertOne(data)
            res.send(result)
        })
        app.patch('/toy/:id', async (req, res) => {
            const id = req.params.id;
            const updateDoc = req.body;
            const query = { _id: new ObjectId(id) }
            const updateDocData = {
                $set: {
                    available_quantity: updateDoc.available_quantity,
                    detail_description: updateDoc.detail_description,
                    name: updateDoc.name,
                    picture_url: updateDoc.picture_url,
                    seller_email: updateDoc.seller_email,
                    seller_name: updateDoc.seller_name,
                    sub_category: updateDoc.sub_category
                }
            }
            const result = await ToyCollection.updateOne(query, updateDocData)
            res.send(result)
        })
        app.delete('/alltoys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await ToyCollection.deleteOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`server is runnning on this port ---${port}`)
})