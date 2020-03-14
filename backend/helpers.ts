import { mongoose, ReturnModelType } from "@typegoose/typegoose"
import express, { Request, Response } from "express";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { Modifiable } from "./models";

export const getByID = async (req: Request, res: Response, model: ReturnModelType<typeof Modifiable, unknown>) =>{
    try{
        const doc = await model.findById(req.params.id)
        if(doc)
            res.send(doc)
        else
            res.status(404).send("not found")
    } catch (error){
        res.status(500).send("id not valid or database not reachable")
    }
}   

export const getAll = async  (req: Request, res: Response, model: ReturnModelType<typeof Modifiable, unknown>) =>{
    try{
        const all = await model.find({}).select({"_id": 0})
        res.send(all)
    }
    catch (error){
        res.status(500).send(error)
    }
}

export const create = async  (req: Request, res: Response, model: ReturnModelType<typeof Modifiable, unknown>) =>{
    try {
        const newDoc = await model.create(req.body)    
        res.status(201).send(newDoc.id)
    } catch (error) {
        res.status(500).send(error)
    }
}
