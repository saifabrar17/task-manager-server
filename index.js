const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;git add <div className=""></div>

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://saif-abrar:x3XZo2T33Edf3N5z@cluster0.erehg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const dataCollection = client.db("task-manager").collection("tasks")


        //POST
        app.post('/allTasks', async (req, res) => {
            const newTask = req.body;
            const result = await dataCollection.insertOne(newTask);
            res.send(result);
        });

        //GET
        app.get('/allTasks', async (req, res) => {
            const query = {};
            const cursor = dataCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })

        app.get('/completedTasks', async (req, res) => {
            const status = req.params.taskStatus;
            const filter = { "taskStatus": "1" };
            const result = await dataCollection.find(filter).toArray();
            res.send(result);
          })


        //UPDATE
        app.put('/complete', async (req, res) => {
            const id = await ObjectId(req.headers.id);
            const doc = {
                $set: {
                    taskStatus: "1"
                }
            }
            const result = await dataCollection.updateOne({ _id: id }, doc, { upsert: true });
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Running server');
});

app.listen(port, () => {
    console.log('Server is runnning');
})