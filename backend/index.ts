import express from "express"
import { mongoose, getModelForClass } from "@typegoose/typegoose"
import { Worker } from "./models"

const app = express()
const port = 3000

let connection = mongoose.connect('mongodb://localhost:27017/advocat_v0', { 
    useNewUrlParser: true
})
let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => res.send('the advocat api is running'))

app.get('/worker/:id', (req, res) => {
    res.send("you requested a worker")
})

app.get('/worker', async (req, res) => {    
    const WorkerModel = getModelForClass(Worker)
    const all = await WorkerModel.find({}).select({"_id": 0})
    res.send(all)
})

app.listen(port, () => {
    console.log(`advocat api running on port ${port}`)
})