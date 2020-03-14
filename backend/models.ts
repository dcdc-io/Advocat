import { prop, getModelForClass, pre } from '@typegoose/typegoose'
import mongoose from 'mongoose'

export enum Defaults {
    UnassignedJob = "UnassignedJob"
}

@pre<Modifiable>('save', function() { })
export class Logged { }

@pre<Modifiable>('save', function() { if (this.created) { this.modified = Date.now() } else this.created = Date.now() })
export class Modifiable extends Logged {
    @prop() public created!: number
    @prop() public modified!: number
}

export class Person extends Modifiable {
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

export class Job extends Modifiable {
    @prop() public workerId?: string = Defaults.UnassignedJob
    @prop({ required: true }) public recipientId!: string 
    @prop() public description!: string
}
export class PointToPointJob extends Job {
    @prop({ required: true }) public pickupAddress! : string
    @prop({ required: true }) public dropOffAddress! : string
}