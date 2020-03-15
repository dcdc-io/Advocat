"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const typegoose_1 = require("@typegoose/typegoose");
const models_1 = require("./models");
const helpers_1 = require("./helpers");
const app = express_1.default();
const port = 3000;
let connection = typegoose_1.mongoose.connect('mongodb://localhost:27017/advocat_v0', {
    useNewUrlParser: true
});
let db = typegoose_1.mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(body_parser_1.default.json());
app.get('/', (req, res) => res.send('the advocat api is running'));
app.listen(port, () => { console.log(`advocat api running on port ${port}`); });
const WorkerModel = typegoose_1.getModelForClass(models_1.Worker);
const RecipientModel = typegoose_1.getModelForClass(models_1.Recipient);
app.post('/worker', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.createDoc(req, res, WorkerModel); }));
app.post('/Recipient', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.createDoc(req, res, RecipientModel); }));
app.get('/worker/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.getByID(req, res, WorkerModel); }));
app.get('/Recipient/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.getByID(req, res, RecipientModel); }));
app.get('/worker', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.getAll(req, res, WorkerModel); }));
app.get('/Recipient', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.getAll(req, res, RecipientModel); }));
app.put('/worker', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.updateDoc(req, res, WorkerModel); }));
app.put('/Recipient', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.updateDoc(req, res, RecipientModel); }));
app.delete('/worker/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.deleteDoc(req, res, WorkerModel); }));
app.delete('/Recipient/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { yield helpers_1.deleteDoc(req, res, RecipientModel); }));
