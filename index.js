const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 5000;

//user : mydbuser1
// password : aVntCUas304t0ttY;
// ip address : 0.0.0.0/0

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dbyax.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const usersCollection = database.collection("users");

    // Get API 
    app.get('/users',async (req,res)=>{
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users)
    });

 // Update user
    app.get('/users/:id', async (req,res)=>{
      const id = req.params.id;
      const query ={_id: ObjectId(id)};
      const user = await  usersCollection.findOne(query)
      console.log('load user with id:',id);
      res.send(user)
    })

    //POST Api
    app.post('/users', async(req,res)=>{
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser)
      console.log('Got new user the post',req.body);
      console.log('dded user',result);
      res.json(result)
    })
    
    // DELETE API

    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await usersCollection.deleteOne(query)
      console.log('Delete Your Id',result);
      res.json(result)
    })
  } 

  finally {
   // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
  res.send('Running is Coming with Data base on MongoDb')
})

app.listen(port,()=>{
  console.log('Running Server on port',port);
})