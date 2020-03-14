import { prop, pre, Ref } from '@typegoose/typegoose'


export class Addressed {
  @prop() public address: string = ""
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
    @prop() public active!: boolean
}

export class Recipient extends Person {
    @prop() public email!: string
}

export class Job extends Modifiable{
    @prop({ ref: Worker }) public worker?: Ref<Worker>
    @prop({ ref: Recipient, required: true }) public recipient!: Ref<Recipient>
    @prop() public description!: string
    @prop() public status!: string
}
export class PointToPointJob extends Job {
    @prop({ required: true }) public pickupAddress! : string
    @prop({ required: true }) public dropOffAddress! : string
}