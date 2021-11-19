const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// Connection URI 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwr1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        // Database Connection Call 
        await client.connect();
        console.log('Database connected!');

        // Database and Collections 
        const database = client.db('vromon_db');
        const destinationCollection = database.collection('destinations');
        const packageCollection = database.collection('packages');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');

        //Get All Destinations 
        app.get('/destinations', async (req, res) => {
            // console.log('Hitting destination...')
            const cursor = await destinationCollection.find({}).toArray();
            // console.log(cursor);
            res.send(cursor);
        });

        // Get Single Destination 
        app.get('/destinations/:id', async (req, res) => {
            // console.log('Hitting particular destination...');
            const id = req.params.id;
            // console.log('Given ID is: ', id);
            const query = { _id: ObjectID(id) };
            const cursor = await destinationCollection.findOne(query);
            res.send(cursor);
        });

        //Get All Packages
        app.get('/packages', async (req, res) => {
            // console.log('Hitting Packages!');
            const cursor = await packageCollection.find({}).toArray();
            // console.log(cursor);
            res.send(cursor);
        });

        // Get Single Package 
        app.get('/packages/:id', async (req, res) => {
            // console.log('Hitting particular package...');
            const id = req.params.id;
            // console.log('Given ID is: ', id);
            const query = { _id: ObjectID(id) };
            const cursor = await packageCollection.findOne(query);
            res.send(cursor);
        });

        // Get My Orders 
        app.get('/myOrders', async (req, res) => {
            const email = req.query?.email;

            // console.log('Hitting the post', req.body);
            const query = { receiverEmail: `${email}` };
            const result = await ordersCollection.find(query).toArray();
            console.log(result);
            res.json(result);
        });

        // Get All Orders 
        app.get('/orders', async (req, res) => {
            const email = req.query?.email;
            const query = { email: `${email}` };
            const result = await usersCollection.findOne(query);

            if (result) {
                const searchResult = await ordersCollection.find({}).toArray();
                console.log(searchResult);
                res.json(searchResult);
            }
        });

        // Add a User 
        app.post('/users', async (req, res) => {
            console.log('Hitting the post', req.body);
            const query = { email: `${req.body.email}` };
            const result = await usersCollection.findOne(query);

            if (result === null) {
                const newUser = req.body;
                const insertResult = await usersCollection.insertOne(newUser);
                console.log(insertResult);
                res.json(insertResult);
            }
        });

        // Add an Order 
        app.post('/addOrder', async (req, res) => {
            // console.log('Hitting the post', req.body);
            const newOrder = req.body;
            const insertResult = await ordersCollection.insertOne(newOrder);
            console.log(insertResult);
            res.json(insertResult);
        });

        // Add a Product 
        app.post('/addPackage', async (req, res) => {
            const email = req.query?.email;
            const query = { email: `${email}` };
            const result = await usersCollection.findOne(query);

            if (result) {
                const newProduct = req.body;
                const insertResult = await packageCollection.insertOne(newProduct);
                console.log(insertResult);
                res.json(insertResult);
            }
        });

        // Update Order Status 
        app.put('/updateOrder', async (req, res) => {
            const id = req.body?._id;
            const status = req.body?.status;
            const filter = { _id: ObjectID(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: `${status}`
                },
            };

            const updateResult = await ordersCollection.updateOne(filter, updateDoc, options);
            console.log(updateResult);
            res.json(updateResult);
        });

        // Delete Order 
        app.delete('/deleteOrder', async (req, res) => {
            const id = req.body?._id;
            const filter = { _id: ObjectID(id) };

            const deleteResult = await ordersCollection.deleteOne(filter);
            console.log(deleteResult);
            res.json(deleteResult);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


// GET testing 
app.get('/', (req, res) => {
    res.send('VROMON server is running...');
})

// Port Listening 
app.listen(port, () => {
    console.log('VROMON server is running at port:', port);
})