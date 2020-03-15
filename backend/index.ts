import express from "express"
import bodyParser from "body-parser"
import { mongoose, getModelForClass } from "@typegoose/typegoose"
import { Worker, Recipient } from "./models"
import { getByID, getAll, createDoc , updateDoc, deleteDoc} from "./helpers"

const app = express()
const port = 3000
const DB_HOST = process.env.DB_HOST || "localhost"

let connection = mongoose.connect(`mongodb://${DB_HOST}:27017/advocat_v0`, { 
    useNewUrlParser: true
})
let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('the advocat api is running'))
app.listen(port, () => {console.log(`advocat api running on port ${port}`)})

const WorkerModel = getModelForClass(Worker)
const RecipientModel = getModelForClass(Recipient)

app.post('/worker',    async (req,res) => { await createDoc(req,res,WorkerModel) })
app.post('/Recipient', async (req,res) => { await createDoc(req,res,RecipientModel) })

app.get('/worker/:id',    async (req, res) => { await getByID(req,res,WorkerModel) })
app.get('/Recipient/:id', async (req, res) => { await getByID(req,res,RecipientModel) })

app.get('/worker',    async (req, res) => { await getAll(req,res,WorkerModel) })
app.get('/Recipient', async (req, res) => { await getAll(req,res,RecipientModel) })

app.put('/worker',    async (req,res) => { await updateDoc(req,res,WorkerModel) })
app.put('/Recipient', async (req,res) => { await updateDoc(req,res,RecipientModel) })

app.delete('/worker/:id',    async (req,res) => { await deleteDoc(req,res,WorkerModel) })
app.delete('/Recipient/:id', async (req,res) => { await deleteDoc(req,res,RecipientModel) })
