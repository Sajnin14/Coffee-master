const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// 4mhoCxI83vCuHIGn
// CofeeMaster


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4adud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    await client.connect();

    const coffeeDatabase = client.db('coffeeDB');
    const coffeeCollection = coffeeDatabase.collection('coffee');
    
    app.get('/coffee', async(req, res) => { 
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffee/:id', async(req, res) => {
      const coffeeId = req.params.id;
      const query = {_id: ObjectId(coffeeId)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffee', async(req, res) => {
       const coffeeBody = req.body;
       console.log(coffeeBody);
       const result = await coffeeCollection.insertOne(coffeeBody);
       res.send(result);
    })

    app.put('/coffee/:id', async(req, res) => {
      const coffeeId = req.params.id;
      const query = {_id: ObjectId(coffeeId)};

      const coffeeBody = req.body;
      console.log(coffeeId, coffeeBody);
      const updateCoffee = {
        $set: {
          name: coffeeBody.name,
          quantity: coffeeBody.quantity,
          supply: coffeeBody.supply,
          taste: coffeeBody.taste,
          category: coffeeBody.category,
          details: coffeeBody.details,
          photo: coffeeBody.photo

        }
      }

      const options = {upsert: true};

      const result = await coffeeCollection.updateOne(query, updateCoffee, options);
      res.send(result);
    })

    app.delete('/coffee/:id', async(req, res) => {
       const coffeeId = req.params.id;
       const query = {_id: ObjectId(coffeeId)};
       const result = await coffeeCollection.deleteOne(query);
       res.send(result);
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


app.get('/', (req, res) => {
    res.send('Server is Running');
})

app.listen(port, () => {
    console.log(`port is running = ${port}`);
})