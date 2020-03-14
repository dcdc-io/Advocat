import express from "express"
import bodyParser from "body-parser"
import { mongoose, getModelForClass } from "@typegoose/typegoose"
import { Worker, Recipient, PointToPointJob} from "./models"

const app = express()
const port = 3000

let connection = mongoose.connect('mongodb://localhost:27017/advocat_v0', { 
    useNewUrlParser: true
})
let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('the advocat api is running'))
app.listen(port, () => {console.log(`advocat api running on port ${port}`)})

const WorkerModel = getModelForClass(Worker)
app.get('/worker/:id', async (req, res) => {
    try{
        const worker = await WorkerModel.findById(req.params.id)
        if(worker)
            res.send(worker)
        else
            res.status(404).send("worker not found")
    } catch (error){
        res.status(500).send("userid not valid or database not reachable")
    }
})
app.get('/worker', async (req, res) => {    
    try{
        const all = await WorkerModel.find({}).select({"_id": 0})
        res.send(all)
    }
    catch (error){
        res.status(500).send(error)
    }
})
app.post('/worker', async (req,res) =>{
    try {
        const newWorker = await WorkerModel.create(req.body)    
        res.status(201).send(newWorker)
    } catch (error) {
        res.status(500).send(error)
    }
})

const RecipientModel = getModelForClass(Recipient)
app.get('/Recipient/:id', async (req, res) => {
    const recipient = await RecipientModel.findById(req.params.id)
    res.send(recipient)
})
app.get('/Recipient', async (req, res) => {    
    const all = await RecipientModel.find({}).select({"_id": 0})
    res.send(all)
})
app.post('/Recipient', async (req,res) =>{
    try {
        const newRecipient = await RecipientModel.create(req.body)    
        res.send(newRecipient.id)
    } catch (error) {
        res.status(500).send(error)
    }
})

const PointToPointJobModel = getModelForClass(PointToPointJob)
app.get('/job/:id', async (req, res) => {
    const job = await PointToPointJobModel.findById(req.params.id)
    res.send(job)
})
app.get('/job', async (req, res) => {    
    const all = await PointToPointJobModel.find({}).select({"_id": 0})
    res.send(all)
})
app.post('/job', async (req,res) =>{
    try {
        const newJob = await PointToPointJobModel.create(req.body)    
        res.send(newJob.id)
    } catch (error) {
        res.status(500).send(error)
    }
})