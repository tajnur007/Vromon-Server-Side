const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const { ObjectID } = require('bson');

const app = express();
const port = process.env.PORT || 5000;


// middleware
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
        const bookingCollection = database.collection('bookings');

        //GET Destinations API
        app.get('/destinations', async (req, res) => {
            // console.log('Hitting destination...')
            const cursor = await destinationCollection.find({}).toArray();
            // console.log(cursor);
            res.send(cursor);
        });
        app.get('/destinations/:id', async (req, res) => {
            // console.log('Hitting particular destination...');
            const id = req.params.id;
            // console.log('Given ID is: ', id);
            const query = { _id: ObjectID(id) };
            const cursor = await destinationCollection.findOne(query);
            res.send(cursor);
        });

        //GET Packages API
        app.get('/packages', async (req, res) => {
            // console.log('Hitting Packages!');
            const cursor = await packageCollection.find({}).toArray();
            // console.log(cursor);
            res.send(cursor);
        });
        app.get('/packages/:id', async (req, res) => {
            // console.log('Hitting particular package...');
            const id = req.params.id;
            // console.log('Given ID is: ', id);
            const query = { _id: ObjectID(id) };
            const cursor = await packageCollection.findOne(query);
            res.send(cursor);
        });

        //GET Bookings API
        app.get('/bookings', async (req, res) => {
            console.log('Hitting Bookings!');
            const cursor = await bookingCollection.find({}).toArray();

            res.send(cursor);
        });
        app.get('/bookings/:email', async (req, res) => {
            // console.log('Hitting bookings with particular email...');
            const email = req.params.email;
            // console.log('Given email is: ', email);
            const query = { customerEmail: email };
            // console.log(query);
            const cursor = await bookingCollection.find(query).toArray();
            // console.log(cursor);
            res.send(cursor);
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