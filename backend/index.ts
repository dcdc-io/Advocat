import express from "express"
import bodyParser from "body-parser"
import { mongoose, getModelForClass } from "@typegoose/typegoose"
import { Worker } from "./models"

const app = express()
const port = 3000

let connection = mongoose.connect('mongodb://localhost:27017/advocat_v0', { 
    useNewUrlParser: true
})
let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('the advocat api is running'))

app.get('/worker/:id', (req, res) => {
    res.status(501).send("you requested a worker (not implemented)")
})

app.get('/worker', async (req, res) => {    
    const WorkerModel = getModelForClass(Worker)
    const all = await WorkerModel.find({}).select({"_id": 0})
    res.send(all)
})

app.post('/worker', async (req,res) =>{
    const WorkerModel = getModelForClass(Worker)
    console.log(req.body)
    res.status(501).send()
})

app.listen(port, () => {
    console.log(`advocat api running on port ${port}`)
})