const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const Port = process.env.PORT || 5001;
const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rqwof3p.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        console.log("Database connected");

        const menuCollection = client.db('regalDragon').collection('menu');

        const reviewCollection = client.db('regalDragon').collection('reviews');

        const cartCollection = client.db('regalDragon').collection('carts');


        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        //reviews
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })

        //carts api
        app.get('/carts', async (req, res) => {
            const query = { };
            const result = await cartCollection.find(query).toArray();
            res.send(result);

        })
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id  : new ObjectId(id)};
            const result = await cartCollection.deleteOne(query);
            res.send(result);

        })
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            //console.log(email);
            if (!email) {
                res.send([]);
            }
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);

        })

        app.post('/carts', async (req, res) => {
            const item = req.body;
            //console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
        })


    } finally {

    }
}
run().catch(err => {
    console.log(err.message);
});

app.get('/', async (req, res) => {
    res.send(`Server Running`);
})

app.listen(Port, () => {
    console.log(`Server running on Port ${Port}`);
})