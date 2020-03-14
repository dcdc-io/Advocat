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


const WorkerModel = getModelForClass(Worker)
app.get('/worker/:id', async (req, res) => {
    const worker = await WorkerModel.findById(req.params.id)
    res.send(worker)
})

app.get('/worker', async (req, res) => {    
    const all = await WorkerModel.find({}).select({"_id": 0})
    res.send(all)
})

app.post('/worker', async (req,res) =>{
    const newWorker = await WorkerModel.create(req.body)    
    res.send(newWorker.id)
})

app.listen(port, () => {
    console.log(`advocat api running on port ${port}`)
})