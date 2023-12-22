const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleWare
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://Job-Task-Scic:7gxWwBVoRVs650ny@cluster0.2amfc4s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const TaskCollection = client.db("Job-Task-Scic").collection("Task");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    app.get('/createTask',async(req,res)=>{
        const result = await TaskCollection.find().toArray()
        res.send(result)
    })
    app.get('/CardEdit/:id',async(req,res)=>{
      const id = req.params.id 
      console.log(id);
      const query = {_id:new ObjectId(id)}
      const result = await TaskCollection.findOne(query)
      res.send(result)
    })
    app.post("/createTask", async (req, res) => {
        const task = req.body 
        const result = await TaskCollection.insertOne(task)
        res.send(result)
    });
    app.patch('/edit/:id',async(req,res)=>{
      const data = req.body 
      const id = req.params.id 
      const query = {_id:new ObjectId(id)}
      const updateDoc = {
        $set: {
          title:data.title,
          priority:data.priority,
          descriptions: data.descriptions,
          dateInput:data.dateInput
        },
      };
      const result = await TaskCollection.updateOne(query,updateDoc)
      res.send(result)
    })
    app.delete('/delete/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await TaskCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
