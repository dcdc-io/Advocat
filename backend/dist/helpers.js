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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByID = (req, res, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield model.findById(req.params.id);
        if (doc)
            res.send(doc);
        else
            res.status(404).send("not found");
    }
    catch (error) {
        res.status(500).send("id not valid or database not reachable");
    }
});
exports.getAll = (req, res, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield model.find({}).select({ "_id": 0 });
        res.send(all);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.createDoc = (req, res, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDoc = yield model.create(req.body);
        res.status(201).send(newDoc.id);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.updateDoc = (req, res, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model.findOneAndUpdate(req.body._id, req.body);
        res.status(200).send();
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteDoc = (req, res, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model.remove({ _id: req.params.id });
        res.status(200).send();
    }
    catch (error) {
        res.status(500).send(error);
    }
});
