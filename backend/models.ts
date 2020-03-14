import { prop, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'

export enum Defaults {
    UnassignedJob = "UnassignedJob"
}

export class Person {
    @prop({ required: true }) public name!: string
    @prop({ required: true }) public address!: string
    @prop({ required: true }) public phone!: string
}

export class Worker extends Person {
    @prop({ required: true }) public email!: string
}

export class Recipient extends Person {
    @prop() public email!: string
}

export class Job {
    @prop() public workerId?: string = Defaults.UnassignedJob
    @prop({ required: true }) public recipientId!: string 
    @prop() public description!: string 
}

export class PointToPointJob extends Job {
    @prop({ required: true }) public pickupAddress! : string
    @prop({ required: true }) public dropOffAddress! : string
}