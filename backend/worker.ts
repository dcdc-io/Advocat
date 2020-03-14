import { prop, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'

enum Defaults {
    UnassignedJob = "UnassignedJob"
}

class Worker {
    @prop() public name!: string
    @prop() public address!: string
    @prop() public phone!: string
    @prop() public email!: string
}

class Recipient {
    @prop() public name!: string
    @prop() public address!: string
    @prop() public phone!: string
    @prop() public email!: string
}

class Job {
    @prop() public workerId?: string = Defaults.UnassignedJob
    @prop() public recipientId!: string 
    @prop() public description!: string 
}

class PointToPointJob extends Job {
    @prop() public pickupAddress! : string
    @prop() public dropOffAddress! : string
}


const WorkerModel = getModelForClass(Worker);

(() => {
    (async function() {
        await mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "advocat#test" })

        const { _id: id } = await WorkerModel.create(
            {name: "Jose Bloggs",
             address: "2 metro lane",
             phone: "01111",
             email: "jose@bloggs"
            })
        const worker = await WorkerModel.findById(id).exec()

        const list = await WorkerModel.find()
        console.log(worker)
        return mongoose.disconnect()
    })()
})()