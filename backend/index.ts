import express from "express"
import bodyParser from "body-parser"
import { mongoose, getModelForClass } from "@typegoose/typegoose"
import { Worker, Recipient, PointToPointJob} from "./models"
import { getByID, getAll, createDoc , updateDoc, deleteDoc} from "./helpers"


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
const RecipientModel = getModelForClass(Recipient)
const PointToPointJobModel = getModelForClass(PointToPointJob)

app.post('/worker',    async (req,res) => { await createDoc(req,res,WorkerModel) })
app.post('/Recipient', async (req,res) => { await createDoc(req,res,RecipientModel) })
app.post('/job',       async (req,res) => { await createDoc(req,res,PointToPointJobModel) })

app.get('/worker/:id',    async (req, res) => { await getByID(req,res,WorkerModel) })
app.get('/Recipient/:id', async (req, res) => { await getByID(req,res,RecipientModel) })
app.get('/job/:id',       async (req, res) => { await getByID(req,res,PointToPointJobModel) }) 

app.get('/worker',    async (req, res) => { await getAll(req,res,WorkerModel) })
app.get('/Recipient', async (req, res) => { await getAll(req,res,RecipientModel) })
app.get('/job',       async (req, res) => { await getAll(req,res,PointToPointJobModel) })

app.put('/worker',    async (req,res) => { await updateDoc(req,res,WorkerModel)})
app.put('/Recipient', async (req,res) => { await updateDoc(req,res,RecipientModel)})
app.put('/job',       async (req,res) => { await updateDoc(req,res,PointToPointJobModel)})

app.delete('/worker/:id',    async (req,res) => { await deleteDoc(req,res,WorkerModel)})
app.delete('/Recipient/:id', async (req,res) => { await deleteDoc(req,res,RecipientModel)})
app.delete('/job/:id',       async (req,res) => { await deleteDoc(req,res,PointToPointJobModel)})